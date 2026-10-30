/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EPISODES_DATA } from '../../data/episodes';
import { ComicEpisode } from '../../types/comic';
import { StorybookCharacter } from '../illustrations/StorybookAvatars';
import { CHARACTERS_DATA } from '../../data/characters';
import { comicSound } from '../../utils/audio';
import { loadEpisodeProgress } from '../../utils/readingState';
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Play,
} from 'lucide-react';

interface EpisodeCatalogProps {
  onSelectEpisode: (episode: ComicEpisode, options?: { restart?: boolean }) => void;
  onViewCharacter: (characterId: string) => void;
}

export const EpisodeCatalog: React.FC<EpisodeCatalogProps> = ({
  onSelectEpisode,
  onViewCharacter,
}) => {
  const [selectedUpcoming, setSelectedUpcoming] = useState<ComicEpisode | null>(null);

  // Check saved progress safely using canonical loader
  const pilotProgress = loadEpisodeProgress('episodio-piloto');
  const isPilotCompleted = Boolean(pilotProgress?.completed);
  const isInProgress = Boolean(
    pilotProgress && !pilotProgress.completed && pilotProgress.panelIndex > 0
  );

  const handleOpenEpisode = (ep: ComicEpisode, restart = false) => {
    comicSound.playPop();
    if (ep.status === 'available') {
      onSelectEpisode(ep, { restart });
    } else {
      setSelectedUpcoming(ep);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Header */}
      <header className="text-center max-w-xl mx-auto mb-8 md:mb-12">
        <span className="font-title font-black text-xs uppercase tracking-wider text-amber-900 bg-amber-200 px-3.5 py-1 rounded-full border border-amber-400 inline-block mb-2">
          Historietas familiares
        </span>
        <h1 className="font-title font-black text-3xl md:text-4xl text-[#382B24]">
          Nuestras Historias
        </h1>
        <p className="font-comic text-base md:text-lg text-slate-700 mt-2 font-medium">
          De cómo llegó Laisha a casa hasta los increíbles saltos de Merlina en el parque
        </p>
      </header>

      {/* Featured Pilot Story */}
      {EPISODES_DATA.filter((e) => e.status === 'available').map((pilot) => (
        <div
          key={pilot.id}
          className="bg-white rounded-3xl storybook-border-lg p-6 md:p-8 mb-10 shadow-xl relative overflow-hidden group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Cover Art */}
            <div className="lg:col-span-5 relative aspect-[16/11] rounded-3xl overflow-hidden storybook-border bg-gradient-to-br from-amber-200 via-orange-100 to-amber-100 p-6 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-[#382B24] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  ¡Capítulo Piloto!
                </span>
                {isPilotCompleted ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full border border-emerald-400">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>¡Leído!</span>
                  </span>
                ) : isInProgress ? (
                  <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-400">
                    Escena {(pilotProgress?.panelIndex || 0) + 1} de {pilot.panels.length}
                  </span>
                ) : null}
              </div>

              {/* Characters Lineup in Cover */}
              <div className="flex items-center justify-center gap-2 my-2">
                <StorybookCharacter characterId="rox" size="md" />
                <StorybookCharacter characterId="laisha" size="lg" />
                <StorybookCharacter characterId="more" size="md" />
              </div>

              <div className="text-center bg-white/95 rounded-2xl p-2.5 storybook-border-sm">
                <p className="font-title font-black text-xs uppercase text-amber-950">
                  6 Escenas Divertidas e Interactivas
                </p>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full border border-emerald-400">
                  ¡Disponible para leer ya!
                </span>
                <span className="text-xs font-bold text-slate-500">Con pensamientos ocultos</span>
              </div>

              <h2 className="font-title font-black text-2xl md:text-3xl text-[#382B24] mb-2 leading-tight">
                {pilot.title}
              </h2>
              <p className="font-comic text-base md:text-lg text-slate-700 leading-relaxed mb-4 font-medium">
                {pilot.synopsis}
              </p>

              {/* Characters in this episode */}
              <div className="mb-6">
                <span className="text-xs font-black uppercase text-amber-900 block mb-2">
                  ¿Quiénes aparecen en esta historia?
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {pilot.charactersInEpisode.map((cId) => (
                    <button
                      key={cId}
                      onClick={() => onViewCharacter(cId)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-[#382B24] text-xs font-black text-[#382B24] transition-colors cursor-pointer"
                    >
                      <StorybookCharacter characterId={cId} size="sm" className="w-6 h-6" />
                      <span>{CHARACTERS_DATA[cId]?.name || cId}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Differentiating Continue vs Fresh Start */}
              <div className="flex flex-wrap items-center gap-3">
                {isInProgress ? (
                  <>
                    <button
                      onClick={() => handleOpenEpisode(pilot, false)}
                      className="px-6 py-3.5 rounded-3xl font-title font-black text-base bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                    >
                      <Play className="w-5 h-5 text-amber-300" />
                      <span>Continuar lectura (Escena {(pilotProgress?.panelIndex || 0) + 1})</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>

                    <button
                      onClick={() => handleOpenEpisode(pilot, true)}
                      className="px-5 py-3.5 rounded-3xl font-title font-bold text-sm bg-amber-100 hover:bg-amber-200 text-[#382B24] storybook-button flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-900" />
                      <span>Comenzar de nuevo</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenEpisode(pilot, true)}
                    className="w-full sm:w-auto px-8 py-4 rounded-3xl font-title font-black text-base md:text-lg bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button flex items-center justify-center gap-3 cursor-pointer shadow-md"
                  >
                    <BookOpen className="w-5 h-5 text-amber-300" />
                    <span>{isPilotCompleted ? 'Volver a leer (Reiniciar)' : '¡Comenzar a leer ahora!'}</span>
                    <ArrowRight className="w-5 h-5 text-amber-300" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Upcoming Stories Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-3 border-[#382B24]/15">
          <div>
            <h2 className="font-title font-black text-2xl md:text-3xl text-[#382B24]">
              Próximas Historias
            </h2>
            <p className="font-comic text-base text-slate-700">
              Más travesuras y paseos que ya se están preparando
            </p>
          </div>
          <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
            8 historias en camino
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EPISODES_DATA.filter((e) => e.status === 'coming_soon').map((ep) => (
            <div
              key={ep.id}
              onClick={() => handleOpenEpisode(ep)}
              className="bg-white rounded-3xl storybook-border p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                    Capítulo #{ep.episodeNumber}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Próximamente</span>
                  </span>
                </div>

                <h3 className="font-title font-black text-xl text-[#382B24] mb-1 group-hover:text-amber-800 transition-colors">
                  {ep.title}
                </h3>
                <p className="font-comic text-xs text-amber-800 font-bold mb-2">
                  {ep.subtitle}
                </p>
                <p className="font-comic text-sm text-slate-700 line-clamp-3 mb-4 font-medium">
                  {ep.synopsis}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mb-3">
                  {ep.charactersInEpisode.map((cId) => (
                    <div key={cId} title={CHARACTERS_DATA[cId]?.name}>
                      <StorybookCharacter characterId={cId} size="sm" className="w-7 h-7" />
                    </div>
                  ))}
                  <span className="text-xs text-slate-600 font-bold ml-1 font-comic">
                    {ep.charactersInEpisode.map((c) => CHARACTERS_DATA[c]?.name || c).join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-black text-amber-900 group-hover:translate-x-1 transition-transform">
                  <span>Descubrir de qué tratará</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Episode Modal Preview for Kids */}
      {selectedUpcoming && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl storybook-border-lg p-6 max-w-md w-full shadow-2xl animate-pop-thought">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-400">
                Capítulo #{selectedUpcoming.episodeNumber} · En preparación
              </span>
              <button
                onClick={() => setSelectedUpcoming(null)}
                className="text-xs font-black px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 storybook-border-sm cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <h3 className="font-title font-black text-2xl text-[#382B24] mb-1">
              {selectedUpcoming.title}
            </h3>
            <p className="font-comic text-base text-amber-800 font-bold mb-4">
              {selectedUpcoming.subtitle}
            </p>

            <div className="p-4 bg-amber-100 rounded-2xl storybook-border-sm mb-5">
              <span className="text-xs font-black uppercase text-amber-950 block mb-1">
                ¿De qué tratará esta aventura?
              </span>
              <p className="font-comic text-base text-slate-800 leading-relaxed font-medium">
                {selectedUpcoming.synopsis}
              </p>
            </div>

            <button
              onClick={() => setSelectedUpcoming(null)}
              className="w-full py-3 rounded-2xl font-title font-black text-base bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button cursor-pointer"
            >
              ¡Genial, gracias! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
