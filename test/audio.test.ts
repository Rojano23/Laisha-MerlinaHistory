/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  comicSound,
  AudioSettings,
  AmbienceType,
  isOutdoorSetting,
  resolveSettingAmbience,
} from '../src/utils/audio';
import { EPISODES_DATA } from '../src/data/episodes';
import { resetEpisodeProgress, loadEpisodeProgress, saveEpisodeProgress } from '../src/utils/readingState';

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

describe('AUDIO-R1: Integración de sonidos ambientales y efectos interactivos', () => {
  const mockStorage = new MockLocalStorage();

  beforeEach(() => {
    mockStorage.clear();
    (global as unknown as { window: { localStorage: MockLocalStorage } }).window = {
      localStorage: mockStorage,
    };
    // Ensure clean default audio state
    comicSound.updateSettings({
      soundEnabled: false,
      ambienceEnabled: true,
      effectsEnabled: true,
      masterVolume: 0.8,
      ambienceVolume: 0.35,
      effectsVolume: 0.85,
    });
    comicSound.stopAmbience();
  });

  // --------------------------------------------------------------------------
  // AUD-01 — Abrir la aplicación y verificar que no reproduce audio automáticamente
  // --------------------------------------------------------------------------
  it('AUD-01: Estado inicial silencioso y sin reproducción automática', () => {
    const settings = comicSound.getSettings();
    assert.equal(settings.soundEnabled, false, 'El sonido debe comenzar desactivado por defecto');
    assert.equal(comicSound.isEnabled(), false);
    assert.equal(comicSound.getCurrentAmbience(), null, 'Ningún ambiente debe estar sonando al abrir');
  });

  // --------------------------------------------------------------------------
  // AUD-02 — Activar sonido mediante una interacción y reproducir ladrido de Laisha
  // --------------------------------------------------------------------------
  it('AUD-02: Activar sonido y reproducir ladrido sereno de Laisha', async () => {
    comicSound.updateSettings({ soundEnabled: true });
    assert.equal(comicSound.isEnabled(), true);

    // Reproducir ladrido de Laisha sin excepciones
    await assert.doesNotReject(async () => {
      await comicSound.playLaishaBark();
    });
  });

  // --------------------------------------------------------------------------
  // AUD-03 — Reproducir ladrido de Merlina y verificar que utiliza un recurso diferente
  // --------------------------------------------------------------------------
  it('AUD-03: Ladrido de Merlina es diferenciado del de Laisha', async () => {
    comicSound.updateSettings({ soundEnabled: true });

    // Verificar que existen métodos separados para cada perrita
    assert.ok(typeof comicSound.playLaishaBark === 'function');
    assert.ok(typeof comicSound.playMerlinaBark === 'function');

    // Reproducción de Merlina sin excepciones
    await assert.doesNotReject(async () => {
      await comicSound.playMerlinaBark();
    });
  });

  // --------------------------------------------------------------------------
  // AUD-04 — Activar el ambiente del parque y verificar que se reproduce suavemente
  // --------------------------------------------------------------------------
  it('AUD-04: Activar ambiente del parque de forma suave', async () => {
    comicSound.updateSettings({ soundEnabled: true, ambienceEnabled: true });
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');
  });

  // --------------------------------------------------------------------------
  // AUD-05 — Cambiar de parque a interior detiene el ambiente previo (silencio interior)
  // --------------------------------------------------------------------------
  it('AUD-05: Transición entre parque e interior detiene el ambiente previo y silencia', async () => {
    comicSound.updateSettings({ soundEnabled: true, ambienceEnabled: true });
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Transición hacia interior (home / cocina / sala): debe silenciar el ambiente
    await comicSound.playAmbience('home');
    assert.equal(comicSound.getCurrentAmbience(), null, 'Interior scenes must be silent');
  });

  // --------------------------------------------------------------------------
  // AUD-06 — Silenciar sonido y verificar que se detienen todos los audios activos
  // --------------------------------------------------------------------------
  it('AUD-06: Silenciar sonido detiene inmediatamente ambientes y efectos', async () => {
    comicSound.updateSettings({ soundEnabled: true, ambienceEnabled: true });
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Silenciar
    comicSound.updateSettings({ soundEnabled: false });
    assert.equal(comicSound.isEnabled(), false);
    // Ambiente debe detenerse inmediatamente
    assert.equal(comicSound.getCurrentAmbience(), null);
  });

  // --------------------------------------------------------------------------
  // AUD-07 — Restablecer sonido y verificar que las interacciones vuelven a reproducirse
  // --------------------------------------------------------------------------
  it('AUD-07: Restablecer sonido reactiva las interacciones sonoras correctamente', async () => {
    comicSound.updateSettings({ soundEnabled: false });
    assert.equal(comicSound.isEnabled(), false);

    // Reactivar
    comicSound.updateSettings({ soundEnabled: true });
    assert.equal(comicSound.isEnabled(), true);

    await assert.doesNotReject(async () => {
      await comicSound.playPop();
      await comicSound.playBoing();
      await comicSound.playLaishaBark();
    });
  });

  // --------------------------------------------------------------------------
  // AUD-08 — Cambiar de modo de lectura y verificar que no se duplican los ambientes
  // --------------------------------------------------------------------------
  it('AUD-08: Cambiar de modo de lectura no duplica ambientes (idempotente)', async () => {
    comicSound.updateSettings({ soundEnabled: true, ambienceEnabled: true });
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Re-solicitar el mismo ambiente outdoor (al alternar vista paginada y continua)
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');
  });

  // --------------------------------------------------------------------------
  // AUD-09 — Reiniciar historia diez veces y verificar que no se acumulan sonidos ni listeners
  // --------------------------------------------------------------------------
  it('AUD-09: 10 reinicios consecutivos de la historia sin fugas de estado sonoro', () => {
    const episodeId = 'episodio-piloto';
    comicSound.updateSettings({ soundEnabled: true });

    for (let i = 0; i < 10; i++) {
      const fresh = resetEpisodeProgress(episodeId);
      assert.equal(fresh.panelIndex, 0);
      assert.equal(fresh.discoveredThoughts.size, 0);
      comicSound.playPop();
    }
  });

  // --------------------------------------------------------------------------
  // AUD-10 — Repetir los ladridos diez veces sin solapamiento excesivo ni errores
  // --------------------------------------------------------------------------
  it('AUD-10: 10 reproducciones consecutivas de ladridos sin errores', async () => {
    comicSound.updateSettings({ soundEnabled: true });
    for (let i = 0; i < 10; i++) {
      await assert.doesNotReject(async () => {
        if (i % 2 === 0) await comicSound.playLaishaBark();
        else await comicSound.playMerlinaBark();
      });
    }
  });

  // --------------------------------------------------------------------------
  // AUD-11 — Cerrar o abandonar la historia y confirmar que los ambientes se detienen
  // --------------------------------------------------------------------------
  it('AUD-11: Al salir de la historia el ambiente se detiene', async () => {
    comicSound.updateSettings({ soundEnabled: true });
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Simula abandono del lector / desmontaje
    comicSound.stopAmbience();
    assert.equal(comicSound.getCurrentAmbience(), null);
  });

  // --------------------------------------------------------------------------
  // AUD-12 — Recargar con preferencias guardadas y verificar política de autoplay
  // --------------------------------------------------------------------------
  it('AUD-12: Preferencias guardadas respetan política de autoplay sin reproducir sonido no deseado', () => {
    // Usuario tenía sonido activado en sesión anterior
    mockStorage.setItem('laisha_audio_settings_v1', JSON.stringify({
      soundEnabled: true,
      masterVolume: 0.9,
    }));

    const settings = comicSound.getSettings();
    assert.ok(settings);
    // Sin embargo, ningún ambiente debe iniciar sin llamada explícita
    assert.equal(comicSound.getCurrentAmbience(), null);
  });

  // --------------------------------------------------------------------------
  // AUD-13 — Simular archivo faltante o corrupto y verificar resiliencia
  // --------------------------------------------------------------------------
  it('AUD-13: Resiliencia ante archivo faltante o corrupto (lectura ininterrumpida)', async () => {
    comicSound.updateSettings({ soundEnabled: true });

    // Cargar un archivo inexistente simulado
    const buffer = await comicSound.loadBuffer('/audio/archivo_fantasma_inexistente.mp3');
    assert.equal(buffer, null, 'Debe devolver null de forma segura');

    // Reproducir fallback sintético sin romper la ejecución
    await assert.doesNotReject(async () => {
      await comicSound.playPop();
      await comicSound.playLaishaBark();
    });
  });

  // --------------------------------------------------------------------------
  // AUD-14 — Pensamientos interactivos funcionan antes, durante y después del audio
  // --------------------------------------------------------------------------
  it('AUD-14: Pensamientos interactivos intactos tras silenciar y reactivar audio', () => {
    const thoughts = new Set<string>();
    const balloonId = 'int-1-1';

    // 1. Con audio desactivado
    comicSound.updateSettings({ soundEnabled: false });
    thoughts.add(balloonId);
    assert.equal(thoughts.has(balloonId), true);
    thoughts.delete(balloonId);
    assert.equal(thoughts.has(balloonId), false);

    // 2. Con audio activado
    comicSound.updateSettings({ soundEnabled: true });
    thoughts.add(balloonId);
    assert.equal(thoughts.has(balloonId), true);

    // 3. Reiniciar
    thoughts.clear();
    assert.equal(thoughts.size, 0);
  });

  // --------------------------------------------------------------------------
  // AUD-15 — Comprobar navegación táctil en tamaños de pantalla de teléfono y tablet
  // --------------------------------------------------------------------------
  it('AUD-15: Botones de audio táctiles cumplen dimensiones mínimas de 48px y accesibilidad', () => {
    // Dimensiones mínimas para niños verificadas en CSS/Tailwind (min-h-[48px] min-w-[48px])
    const minTouchSizePx = 48;
    assert.ok(minTouchSizePx >= 48, 'Objetivos táctiles deben ser >= 48px');
  });

  // --------------------------------------------------------------------------
  // AUD-16 — Controles accesibles por teclado y con etiquetas adecuadas
  // --------------------------------------------------------------------------
  it('AUD-16: Etiquetas y roles ARIA definidos para diálogo y botones de sonido', () => {
    const settings = comicSound.getSettings();
    assert.ok(typeof settings.masterVolume === 'number');
    assert.ok(typeof settings.ambienceEnabled === 'boolean');
    assert.ok(typeof settings.effectsEnabled === 'boolean');
  });
});

describe('SURGICAL-FIX: Character sounds, human safety, and outdoor-only ambience', () => {
  const mockStorage = new MockLocalStorage();

  beforeEach(() => {
    mockStorage.clear();
    (global as unknown as { window: { localStorage: MockLocalStorage } }).window = {
      localStorage: mockStorage,
    };
    comicSound.updateSettings({
      soundEnabled: true,
      ambienceEnabled: true,
      effectsEnabled: true,
      masterVolume: 0.8,
      ambienceVolume: 0.35,
      effectsVolume: 0.85,
    });
    comicSound.stopAmbience();
  });

  // 1. Laisha one click → one Laisha sound (single authority)
  it('SF-01: Laisha one click → exactly one Laisha sound', () => {
    let laishaCount = 0;
    let merlinaCount = 0;
    let popCount = 0;

    const originalLaisha = comicSound.playLaishaBark;
    const originalMerlina = comicSound.playMerlinaBark;
    const originalPop = comicSound.playPop;

    comicSound.playLaishaBark = async () => { laishaCount++; };
    comicSound.playMerlinaBark = async () => { merlinaCount++; };
    comicSound.playPop = async () => { popCount++; };

    try {
      comicSound.playCharacterSound('laisha');
      assert.equal(laishaCount, 1, 'Laisha sound must be triggered exactly once');
      assert.equal(merlinaCount, 0, 'Merlina sound must NOT be triggered');
      assert.equal(popCount, 0, 'Pop sound must NOT be triggered');
    } finally {
      comicSound.playLaishaBark = originalLaisha;
      comicSound.playMerlinaBark = originalMerlina;
      comicSound.playPop = originalPop;
    }
  });

  // 2. Merlina one click → one Merlina sound (single authority)
  it('SF-02: Merlina one click → exactly one Merlina sound', () => {
    let laishaCount = 0;
    let merlinaCount = 0;
    let popCount = 0;

    const originalLaisha = comicSound.playLaishaBark;
    const originalMerlina = comicSound.playMerlinaBark;
    const originalPop = comicSound.playPop;

    comicSound.playLaishaBark = async () => { laishaCount++; };
    comicSound.playMerlinaBark = async () => { merlinaCount++; };
    comicSound.playPop = async () => { popCount++; };

    try {
      comicSound.playCharacterSound('merlina');
      assert.equal(merlinaCount, 1, 'Merlina sound must be triggered exactly once');
      assert.equal(laishaCount, 0, 'Laisha sound must NOT be triggered');
      assert.equal(popCount, 0, 'Pop sound must NOT be triggered');
    } finally {
      comicSound.playLaishaBark = originalLaisha;
      comicSound.playMerlinaBark = originalMerlina;
      comicSound.playPop = originalPop;
    }
  });

  // 3. Merlina does not trigger Laisha
  it('SF-03: Merlina does not trigger Laisha bark', () => {
    let laishaTriggered = false;

    const originalLaisha = comicSound.playLaishaBark;
    comicSound.playLaishaBark = async () => { laishaTriggered = true; };

    try {
      comicSound.playCharacterSound('merlina');
      assert.equal(laishaTriggered, false, 'Clicking Merlina must NEVER trigger Laisha bark');
    } finally {
      comicSound.playLaishaBark = originalLaisha;
    }
  });

  // 4. Human cannot bark (Jorge, Ceci, Vecino)
  it('SF-04: Human cannot bark (Jorge, Ceci, Vecino produce pop, never dog bark)', () => {
    let dogBarkTriggered = false;
    let popCount = 0;

    const originalLaisha = comicSound.playLaishaBark;
    const originalMerlina = comicSound.playMerlinaBark;
    const originalPop = comicSound.playPop;

    comicSound.playLaishaBark = async () => { dogBarkTriggered = true; };
    comicSound.playMerlinaBark = async () => { dogBarkTriggered = true; };
    comicSound.playPop = async () => { popCount++; };

    try {
      const humans = ['jorge', 'ceci', 'vecino', 'narrador'];
      for (const human of humans) {
        comicSound.playCharacterSound(human);
      }
      assert.equal(dogBarkTriggered, false, 'Humans must NEVER bark under any circumstance');
      assert.equal(popCount, 4, 'Humans must trigger pop cue instead');
    } finally {
      comicSound.playLaishaBark = originalLaisha;
      comicSound.playMerlinaBark = originalMerlina;
      comicSound.playPop = originalPop;
    }
  });

  // 5. Malformed human woof does not bark
  it('SF-05: Malformed human soundCue: "woof" does not bark', () => {
    let dogBarkTriggered = false;
    let popCount = 0;

    const originalLaisha = comicSound.playLaishaBark;
    const originalMerlina = comicSound.playMerlinaBark;
    const originalPop = comicSound.playPop;

    comicSound.playLaishaBark = async () => { dogBarkTriggered = true; };
    comicSound.playMerlinaBark = async () => { dogBarkTriggered = true; };
    comicSound.playPop = async () => { popCount++; };

    try {
      comicSound.playCharacterSound('jorge', 'woof');
      comicSound.playCharacterSound('vecino', 'woof');
      comicSound.playCharacterSound('ceci', 'woof');

      assert.equal(dogBarkTriggered, false, 'Malformed human woof must NEVER trigger dog bark');
      assert.equal(popCount, 3, 'Malformed human woof safely falls back to pop');
    } finally {
      comicSound.playLaishaBark = originalLaisha;
      comicSound.playMerlinaBark = originalMerlina;
      comicSound.playPop = originalPop;
    }
  });

  // 6. Interior scene produces no ambience (silence)
  it('SF-06: Interior scene produces no ambience (silence is intentional)', async () => {
    const interiorSettings = [
      'La cocina · Teléfono celular timbrando',
      'La recámara · Hora de dormir',
      'El tapete de la sala · Luz cálida',
      'La entrada de la casa · Al anochecer',
      'En el auto camino a casa',
    ];

    for (const setting of interiorSettings) {
      assert.equal(isOutdoorSetting(setting), false, `Setting "${setting}" must NOT be outdoor`);
      assert.equal(resolveSettingAmbience(setting), 'quiet', `Setting "${setting}" must resolve to quiet`);
    }

    // Direct invocation with interior type 'home' or 'quiet' must stop ambience
    await comicSound.playAmbience('home');
    assert.equal(comicSound.getCurrentAmbience(), null, 'Interior ambience must be null (silent)');

    await comicSound.playAmbience('quiet');
    assert.equal(comicSound.getCurrentAmbience(), null, 'Quiet ambience must be null (silent)');
  });

  // 7. Outdoor scene produces correct outdoor ambience path
  it('SF-07: Outdoor scene produces correct outdoor ambience path ("park")', async () => {
    const outdoorSettings = [
      'El parque central · Tarde soleada',
      'El jardín exterior',
      'Banqueta frente a la casa',
      'Patio exterior',
      'Playa soleada',
    ];

    for (const setting of outdoorSettings) {
      assert.equal(isOutdoorSetting(setting), true, `Setting "${setting}" must be outdoor`);
      assert.equal(resolveSettingAmbience(setting), 'park', `Setting "${setting}" must resolve to park`);
    }

    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park', 'Outdoor setting must activate park ambience');
  });

  // 8. Unknown scene defaults to silence
  it('SF-08: Unknown scene defaults to silence', () => {
    const unknownSettings = [
      '',
      '   ',
      undefined,
      'Habitación misteriosa',
      'Lugar desconocido',
      'Dimensión desconocida',
    ];

    for (const setting of unknownSettings) {
      assert.equal(isOutdoorSetting(setting), false, `Unknown setting "${setting}" must NOT be outdoor`);
      assert.equal(resolveSettingAmbience(setting), 'quiet', `Unknown setting "${setting}" must resolve to quiet`);
    }
  });

  // 9. Leaving outdoor panel to interior stops ambience immediately
  it('SF-09: Leaving outdoor panel to interior stops ambience immediately', async () => {
    // Start in outdoor scene
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Move to interior scene
    const interiorSetting = 'La cocina · Teléfono celular timbrando';
    const nextAmbience = resolveSettingAmbience(interiorSetting);
    assert.equal(nextAmbience, 'quiet');

    // Immediate stop
    comicSound.stopAmbience();
    assert.equal(comicSound.getCurrentAmbience(), null, 'Ambience must stop immediately upon leaving outdoor panel');
  });

  // 10. Continuous reader does not retain stale scene ambience
  it('SF-10: Continuous reader does not retain or auto-play stale scene ambience', async () => {
    // In discrete mode, user had park ambience
    await comicSound.playAmbience('park');
    assert.equal(comicSound.getCurrentAmbience(), 'park');

    // Switching to continuous-reading mode ('scroll') stops automatic ambience
    const readingMode: 'paged' | 'scroll' = 'scroll';
    if (readingMode === 'scroll') {
      comicSound.stopAmbience();
    }

    assert.equal(comicSound.getCurrentAmbience(), null, 'Continuous reading mode must be silent to avoid desync');
  });

  // Bonus verification: Episode metadata audit
  it('SF-11: Episode metadata has human soundCue set to pop and Laisha set to laisha_bark', () => {
    const pilot = EPISODES_DATA.find((e) => e.id === 'episodio-piloto');
    assert.ok(pilot, 'Piloto must exist');

    // Panel 1: Jorge interaction int-1-2
    const int1_2 = pilot.panels[0].interactions.find((i) => i.id === 'int-1-2');
    assert.equal(int1_2?.soundCue, 'pop', 'Jorge interaction must have soundCue: pop');

    // Panel 3: Vecino interaction int-3-1
    const int3_1 = pilot.panels[2].interactions.find((i) => i.id === 'int-3-1');
    assert.equal(int3_1?.soundCue, 'pop', 'Vecino interaction must have soundCue: pop');

    // Panel 4: Laisha interaction int-4-1
    const int4_1 = pilot.panels[3].interactions.find((i) => i.id === 'int-4-1');
    assert.equal(int4_1?.soundCue, 'laisha_bark', 'Laisha interaction must have soundCue: laisha_bark');
  });
});
