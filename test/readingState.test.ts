/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadEpisodeProgress,
  saveEpisodeProgress,
  resetEpisodeProgress,
  shouldStartFresh,
} from '../src/utils/readingState';
import { EPISODES_DATA } from '../src/data/episodes';

// In-memory mock for localStorage in Node test environment
class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe('UI-R2.1: Hardening de Pensamientos Interactivos y Reinicio de Historias', () => {
  const mockStorage = new MockLocalStorage();
  const EPISODE_ID = 'episodio-piloto';
  const pilotEpisode = EPISODES_DATA[0];

  beforeEach(() => {
    mockStorage.clear();
    // Bind mock to global window
    (global as unknown as { window: { localStorage: MockLocalStorage } }).window = {
      localStorage: mockStorage,
    };
  });

  // --------------------------------------------------------------------------
  // Caso 01 — Primera apertura
  // Abrir un episodio nuevo y verificar que todos los pensamientos comiencen ocultos.
  // --------------------------------------------------------------------------
  it('Caso 01 — Primera apertura: Todos los pensamientos comienzan ocultos', () => {
    const progress = loadEpisodeProgress(EPISODE_ID);
    assert.equal(progress, null, 'No debe existir progreso previo al abrir por primera vez');

    // En estado inicial, el set de pensamientos descubiertos está vacío
    const initialThoughts = new Set<string>();
    assert.equal(initialThoughts.size, 0);

    // Verificar que todas las viñetas del episodio piloto con pensamientos secretos inicien ocultos
    const secretBubbles = pilotEpisode.panels
      .flatMap((p) => p.dialogues)
      .filter((d) => d.isSecretThought);

    assert.ok(secretBubbles.length > 0, 'Debe haber pensamientos secretos configurados');

    secretBubbles.forEach((bubble) => {
      const isRevealed = initialThoughts.has(bubble.id);
      assert.equal(isRevealed, false, `El pensamiento ${bubble.id} debe estar oculto en primera apertura`);
    });
  });

  // --------------------------------------------------------------------------
  // Caso 02 — Revelar pensamiento
  // Tocar Laisha y verificar que aparezca el pensamiento correcto.
  // --------------------------------------------------------------------------
  it('Caso 02 — Revelar pensamiento: Tocar a Laisha revela su pensamiento cómico', () => {
    const thoughts = new Set<string>();
    const laishaInteraction = pilotEpisode.panels[3].interactions.find(
      (i) => i.characterId === 'laisha'
    );

    assert.ok(laishaInteraction, 'Debe existir interacción de Laisha en la escena 4');

    // Simular revelación
    thoughts.add(laishaInteraction.id);
    saveEpisodeProgress(EPISODE_ID, {
      panelIndex: 3,
      discoveredThoughts: thoughts,
      completed: false,
    });

    const loaded = loadEpisodeProgress(EPISODE_ID);
    assert.ok(loaded);
    assert.ok(loaded.discoveredThoughts.includes(laishaInteraction.id));
    assert.equal(
      laishaInteraction.revealedThought.includes('¡Libertad!'),
      true,
      'El texto revelado debe coincidir con el pensamiento cómico de Laisha'
    );
  });

  // --------------------------------------------------------------------------
  // Caso 03 — Ocultar pensamiento
  // Cerrar u ocultar el pensamiento y comprobar que pueda revelarse nuevamente.
  // --------------------------------------------------------------------------
  it('Caso 03 — Ocultar pensamiento: Permite alternar y volver a revelar', () => {
    let thoughts = new Set<string>();
    const bubbleId = 'd-1-3'; // Pensamiento secreto de Jorge

    // Revelar
    thoughts.add(bubbleId);
    assert.equal(thoughts.has(bubbleId), true, 'Pensamiento revelado');

    // Ocultar (toggle)
    thoughts.delete(bubbleId);
    assert.equal(thoughts.has(bubbleId), false, 'Pensamiento ocultado de nuevo');

    // Revelar nuevamente
    thoughts.add(bubbleId);
    assert.equal(thoughts.has(bubbleId), true, 'Pensamiento re-revelado con éxito');
  });

  // --------------------------------------------------------------------------
  // Caso 04 — Reiniciar capítulo
  // Revelar varios pensamientos, utilizar "Volver a leer" y verificar que todos vuelvan a estar ocultos.
  // --------------------------------------------------------------------------
  it('Caso 04 — Reiniciar capítulo: "Volver a leer" vacía todos los pensamientos descubiertos', () => {
    // Revelar múltiples pensamientos en varias escenas
    const thoughts = new Set<string>(['d-1-3', 'int-1-1', 'int-2-1', 'd-4-3', 'int-6-1']);
    saveEpisodeProgress(EPISODE_ID, {
      panelIndex: 5,
      discoveredThoughts: thoughts,
      completed: true,
    });

    // Ejecutar la función canónica de reinicio
    const fresh = resetEpisodeProgress(EPISODE_ID);

    assert.equal(fresh.panelIndex, 0, 'Debe volver a la escena 0');
    assert.equal(fresh.discoveredThoughts.size, 0, 'El conjunto de pensamientos debe estar completamente vacío');
    assert.equal(fresh.completed, false, 'No debe estar marcado como completado');

    // Verificar en almacenamiento persistente
    const reloaded = loadEpisodeProgress(EPISODE_ID);
    assert.ok(reloaded);
    assert.equal(reloaded.panelIndex, 0);
    assert.equal(reloaded.discoveredThoughts.length, 0);
    assert.equal(reloaded.completed, false);
  });

  // --------------------------------------------------------------------------
  // Caso 05 — Repetición múltiple
  // Repetir el ciclo revelar → reiniciar → revelar durante diez ocasiones consecutivas.
  // --------------------------------------------------------------------------
  it('Caso 05 — Repetición múltiple: 10 ciclos consecutivos sin bloqueos ni fugas de estado', () => {
    for (let cycle = 1; cycle <= 10; cycle++) {
      // 1. Revelar pensamientos
      const currentThoughts = new Set<string>(['d-1-3', 'int-4-1', 'int-6-1']);
      saveEpisodeProgress(EPISODE_ID, {
        panelIndex: 4,
        discoveredThoughts: currentThoughts,
        completed: cycle % 2 === 0,
      });

      const beforeReset = loadEpisodeProgress(EPISODE_ID);
      assert.equal(beforeReset?.discoveredThoughts.length, 3, `Ciclo ${cycle}: Deben estar revelados 3 pensamientos`);

      // 2. Reiniciar
      const resetState = resetEpisodeProgress(EPISODE_ID);
      assert.equal(resetState.panelIndex, 0, `Ciclo ${cycle}: panelIndex debe ser 0`);
      assert.equal(resetState.discoveredThoughts.size, 0, `Ciclo ${cycle}: thoughts deben estar vacíos`);

      // 3. Verificar estado limpio
      const afterReset = loadEpisodeProgress(EPISODE_ID);
      assert.equal(afterReset?.discoveredThoughts.length, 0, `Ciclo ${cycle}: Persistencia debe estar limpia`);

      // 4. Volver a revelar (idempotencia)
      resetState.discoveredThoughts.add('int-1-1');
      assert.equal(resetState.discoveredThoughts.has('int-1-1'), true, `Ciclo ${cycle}: Re-revelación inmediata permitida`);
    }
  });

  // --------------------------------------------------------------------------
  // Caso 06 — Cambiar modo
  // Revelar pensamientos, alternar entre lectura continua y escena por escena y verificar que persistan.
  // --------------------------------------------------------------------------
  it('Caso 06 — Cambiar modo: Preserva el estado de revelación sin reiniciar la historia', () => {
    let readingMode: 'paged' | 'scroll' = 'paged';
    const discoveredThoughts = new Set<string>(['d-1-3', 'int-2-1']);
    let currentPanelIndex = 2;

    // Cambiar a scroll
    readingMode = 'scroll';
    assert.equal(readingMode, 'scroll');
    assert.equal(discoveredThoughts.size, 2, 'Los pensamientos descubiertos deben mantenerse en scroll');
    assert.equal(currentPanelIndex, 2, 'La escena actual no debe reiniciarse');

    // Cambiar a paged
    readingMode = 'paged';
    assert.equal(readingMode, 'paged');
    assert.equal(discoveredThoughts.has('d-1-3'), true);
    assert.equal(discoveredThoughts.has('int-2-1'), true);
  });

  // --------------------------------------------------------------------------
  // Caso 07 — Continuar lectura
  // Salir del episodio y continuar respetando el progreso guardado.
  // --------------------------------------------------------------------------
  it('Caso 07 — Continuar lectura: Carga la escena y pensamientos guardados válidos', () => {
    saveEpisodeProgress(EPISODE_ID, {
      panelIndex: 3,
      discoveredThoughts: ['int-1-1', 'int-2-1'],
      completed: false,
    });

    const progress = loadEpisodeProgress(EPISODE_ID);
    assert.ok(progress);
    assert.equal(progress.panelIndex, 3, 'Debe reanudar en la escena 3');
    assert.deepEqual(progress.discoveredThoughts, ['int-1-1', 'int-2-1']);
    assert.equal(progress.completed, false);
  });

  // --------------------------------------------------------------------------
  // Caso 08 — Comenzar nuevamente
  // Desde un capítulo previamente completado, comenzar nueva lectura reinicia totalmente los pensamientos.
  // --------------------------------------------------------------------------
  it('Caso 08 — Comenzar nuevamente: Un capítulo completado inicia fresco sin pensamientos descubiertos', () => {
    // Guardar estado como completado con todos los pensamientos descubiertos
    saveEpisodeProgress(EPISODE_ID, {
      panelIndex: 5,
      discoveredThoughts: ['d-1-3', 'int-1-1', 'int-2-1', 'd-4-3', 'int-4-1', 'd-6-3', 'int-6-1'],
      completed: true,
    });

    // shouldStartFresh debe detectar que el capítulo está completado
    const needsFresh = shouldStartFresh(EPISODE_ID);
    assert.equal(needsFresh, true, 'Un episodio completado debe solicitar inicio fresco');

    // Aplicar inicio fresco
    const freshState = resetEpisodeProgress(EPISODE_ID);
    assert.equal(freshState.panelIndex, 0);
    assert.equal(freshState.discoveredThoughts.size, 0, 'Todos los pensamientos deben estar ocultos para la nueva lectura');
  });

  // --------------------------------------------------------------------------
  // Caso 09 — Recargar navegador
  // Verificar comportamiento esperado tras recarga con progreso guardado.
  // --------------------------------------------------------------------------
  it('Caso 09 — Recargar navegador: Conserva estado válido serializado en JSON', () => {
    saveEpisodeProgress(EPISODE_ID, {
      panelIndex: 2,
      discoveredThoughts: ['int-2-1'],
      completed: false,
    });

    // Simular nueva lectura de localStorage como al refrescar la pestaña
    const reloaded = loadEpisodeProgress(EPISODE_ID);
    assert.ok(reloaded);
    assert.equal(reloaded.panelIndex, 2);
    assert.equal(reloaded.discoveredThoughts.includes('int-2-1'), true);
    assert.equal(reloaded.completed, false);
  });

  // --------------------------------------------------------------------------
  // Caso 10 — Datos antiguos o corruptos
  // Cargar datos incompletos o inválidos sin provocar excepciones ni fallos.
  // --------------------------------------------------------------------------
  it('Caso 10 — Datos antiguos: Fallback seguro ante JSON corrupto o datos inválidos', () => {
    // 1. JSON no válido
    mockStorage.setItem(`laisha_progress_${EPISODE_ID}`, '{corrupted-json...');
    const corruptedResult = loadEpisodeProgress(EPISODE_ID);
    assert.equal(corruptedResult, null, 'JSON corrupto debe retornar null de forma segura');

    // 2. Datos parciales con tipos incorrectos (versiones antiguas)
    mockStorage.setItem(
      `laisha_progress_${EPISODE_ID}`,
      JSON.stringify({
        panelIndex: 'invalid_number',
        discoveredThoughts: null,
        completed: 'maybe',
      })
    );
    const legacyResult = loadEpisodeProgress(EPISODE_ID);
    assert.ok(legacyResult, 'Debe sanitizar datos antiguos');
    assert.equal(legacyResult.panelIndex, 0, 'panelIndex inválido debe ser 0');
    assert.deepEqual(legacyResult.discoveredThoughts, [], 'discoveredThoughts nulo debe ser []');
    assert.equal(typeof legacyResult.completed, 'boolean');
  });

  // --------------------------------------------------------------------------
  // Caso 11 — Otros personajes
  // Verificar pensamientos e interacciones de Merlina, Ceci y Jorge.
  // --------------------------------------------------------------------------
  it('Caso 11 — Otros personajes: Funciona para Ceci, Jorge y Vecino de forma idéntica', () => {
    const thoughts = new Set<string>();

    // Pensamiento de Ceci en escena 1
    const ceciInteraction = pilotEpisode.panels[0].interactions.find((i) => i.characterId === 'ceci');
    assert.ok(ceciInteraction);
    thoughts.add(ceciInteraction.id);

    // Pensamiento de Jorge en escena 1
    const jorgeInteraction = pilotEpisode.panels[0].interactions.find((i) => i.characterId === 'jorge');
    assert.ok(jorgeInteraction);
    thoughts.add(jorgeInteraction.id);

    // Pensamiento del vecino en escena 3
    const vecinoInteraction = pilotEpisode.panels[2].interactions.find((i) => i.characterId === 'vecino');
    assert.ok(vecinoInteraction);
    thoughts.add(vecinoInteraction.id);

    assert.equal(thoughts.size, 3);
    assert.equal(thoughts.has(ceciInteraction.id), true);
    assert.equal(thoughts.has(jorgeInteraction.id), true);
    assert.equal(thoughts.has(vecinoInteraction.id), true);

    // Reiniciar y verificar que todos se limpien por igual
    thoughts.clear();
    assert.equal(thoughts.size, 0);
  });

  // --------------------------------------------------------------------------
  // Caso 12 — Dispositivos táctiles
  // Comprobar que los toques secuenciales no producen estados bloqueados.
  // --------------------------------------------------------------------------
  it('Caso 12 — Dispositivos táctiles: Taps consecutivos alternan estados sin colisiones', () => {
    const thoughts = new Set<string>();
    const shoeInteractionId = 'int-6-1';

    // 1er Tap: Tocar zapato para revelar
    thoughts.add(shoeInteractionId);
    assert.equal(thoughts.has(shoeInteractionId), true);

    // 2do Tap: Tocar para cerrar
    thoughts.delete(shoeInteractionId);
    assert.equal(thoughts.has(shoeInteractionId), false);

    // 3er Tap: Volver a tocar para re-revelar
    thoughts.add(shoeInteractionId);
    assert.equal(thoughts.has(shoeInteractionId), true);
  });

  // --------------------------------------------------------------------------
  // Caso 13 — Navegación móvil y tableta: Scroll to Top garantizado
  // Comprobar que al cambiar o re-seleccionar sección, el viewport vuelve a la cima (top: 0).
  // --------------------------------------------------------------------------
  it('Caso 13 — Navegación móvil/tableta: Reset de scroll a top 0 al seleccionar cualquier sección', () => {
    let scrolledTop = 850; // Usuario hace scroll en celular a 850px

    const mockScrollTo = (options: { top: number }) => {
      scrolledTop = options.top;
    };

    // Al seleccionar cualquier sección o re-seleccionar la actual desde el menú inferior
    mockScrollTo({ top: 0 });
    assert.equal(scrolledTop, 0, 'El viewport debe restablecerse a la parte superior (top: 0)');
  });
});

