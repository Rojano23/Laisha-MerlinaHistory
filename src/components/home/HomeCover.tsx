/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StorybookCharacter } from '../illustrations/StorybookAvatars';
import { CHARACTERS_DATA } from '../../data/characters';
import { comicSound } from '../../utils/audio';
import { shouldStartFresh } from '../../utils/readingState';
import {
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Trees,
} from 'lucide-react';

interface HomeCoverProps {
  onStartReading: (options?: { restart?: boolean }) => void;
  onGoToEpisodes: () => void;
  onGoToCharacters: (charId?: string) => void;
}

export const HomeCover: React.FC<HomeCoverProps> = ({
  onStartReading,
  onGoToEpisodes,
  onGoToCharacters,
}) => {
  const handleReadClick = () => {
    comicSound.playWoof();
    const needsFresh = shouldStartFresh('episodio-piloto');
    onStartReading({ restart: needsFresh });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Big Warm Storybook Cover Hero */}
      <section className="bg-gradient-to-b from-[#FFFDF7] via-[#FFF9EB] to-[#FEF3C7] rounded-3xl storybook-border-lg p-6 md:p-12 shadow-xl relative overflow-hidden mb-12">
        {/* Soft floating clouds in background */}
        <div className="absolute top-4 right-12 opacity-40 pointer-events-none animate-float-cloud">
          <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
            <path d="M20 40 Q30 20 50 30 Q70 10 90 25 Q110 20 115 40 Z" fill="#E0F2FE" />
          </svg>
        </div>

        {/* Top Playful Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <span className="font-title font-black text-xs md:text-sm bg-amber-400 text-[#382B24] px-4 py-1.5 rounded-2xl storybook-border-sm uppercase tracking-wider rotate-[-2deg] shadow-sm">
            ¡Historietas para toda la familia! 🐾
          </span>

          <div className="flex items-center gap-2 text-xs font-black text-amber-950 bg-white/90 px-3.5 py-1.5 rounded-full storybook-border-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Historietas con mucho amor y pelos</span>
          </div>
        </div>

        {/* Grid split: Title & Pitch on left; Animated Duo on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title & CTA */}
          <div className="lg:col-span-7">
            <h1 className="font-title font-black text-5xl sm:text-6xl md:text-7xl text-[#382B24] tracking-tight leading-[1] mb-2">
              Laisha <span className="text-amber-700 font-comic">&amp;</span> Merlina
            </h1>
            <p className="font-title font-extrabold text-2xl sm:text-3xl text-amber-800 tracking-tight mb-4">
              Una vida de pelos
            </p>

            <p className="font-comic text-xl sm:text-2xl text-[#4A382D] leading-relaxed mb-6 max-w-lg font-medium">
              Dos generaciones, cuatro personalidades y una casa llena de aventuras, risas... ¡y muchos pelos en el sillón!
            </p>

            {/* Quick Character Tags for Kids */}
            <div className="flex flex-wrap items-center gap-2 mb-8 text-xs md:text-sm font-extrabold">
              <span className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-2xl storybook-border-sm">
                🐾 Laisha (La sabia)
              </span>
              <span className="bg-teal-100 text-teal-950 px-3 py-1.5 rounded-2xl storybook-border-sm">
                🌪️ Merlina (El torbellino)
              </span>
              <span className="bg-rose-100 text-rose-950 px-3 py-1.5 rounded-2xl storybook-border-sm">
                👓 Ceci (La protectora)
              </span>
              <span className="bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-2xl storybook-border-sm">
                ⚽ Jorge (El optimista)
              </span>
            </div>

            {/* Big Tactile CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleReadClick}
                className="w-full sm:w-auto px-8 py-4 rounded-3xl font-title font-black text-lg md:text-xl bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button flex items-center justify-center gap-3 cursor-pointer shadow-lg"
              >
                <BookOpen className="w-6 h-6 text-amber-300" />
                <span>¡Vamos a leer!</span>
                <ArrowRight className="w-6 h-6 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  comicSound.playPop();
                  onGoToCharacters();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-3xl font-title font-black text-base md:text-lg bg-white hover:bg-amber-100 text-[#382B24] storybook-button flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-5 h-5 text-amber-800" />
                <span>Conoce a la familia</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Animated Artwork of Laisha & Merlina */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl storybook-border-lg p-6 shadow-xl relative text-center">
              <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-400 inline-block mb-3">
                ¡Tócanos para escuchar un ladrido! 🐶
              </span>

              {/* Central Animated Duo: Laisha & Merlina */}
              <div className="relative flex items-center justify-center gap-4 py-2">
                {/* Laisha (Blinks and head tilts) */}
                <div
                  onClick={() => {
                    comicSound.playLaishaBark();
                    onGoToCharacters('laisha');
                  }}
                  className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  title="¡Toca a Laisha para escuchar su ladrido!"
                >
                  <StorybookCharacter characterId="laisha" size="xl" />
                  <span className="font-title font-black text-base text-amber-950 mt-2">
                    Laisha
                  </span>
                  <span className="text-xs text-amber-800 font-comic font-bold">Collar rosa</span>
                </div>

                {/* Merlina (Wags tail and bounces!) */}
                <div
                  onClick={() => {
                    comicSound.playMerlinaBark();
                    onGoToCharacters('merlina');
                  }}
                  className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  title="¡Toca a Merlina para escuchar su ladrido!"
                >
                  <StorybookCharacter characterId="merlina" size="xl" />
                  <span className="font-title font-black text-base text-teal-950 mt-2">
                    Merlina
                  </span>
                  <span className="text-xs text-teal-800 font-comic font-bold">Collar verde menta</span>
                </div>
              </div>

              {/* Parents row */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t-2 border-slate-100 mt-2">
                <div
                  onClick={() => {
                    comicSound.playPop();
                    onGoToCharacters('ceci');
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <StorybookCharacter characterId="ceci" size="sm" />
                  <div className="text-left">
                    <span className="text-xs font-black text-[#382B24] block">Mamá Ceci</span>
                    <span className="text-[11px] text-slate-500 font-comic">Cuidadosa</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    comicSound.playPop();
                    onGoToCharacters('jorge');
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <StorybookCharacter characterId="jorge" size="sm" />
                  <div className="text-left">
                    <span className="text-xs font-black text-[#382B24] block">Papá Jorge</span>
                    <span className="text-[11px] text-slate-500 font-comic">¡Al parque!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Protagonists Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-3 border-[#382B24]/15">
          <div>
            <h2 className="font-title font-black text-2xl md:text-3xl text-[#382B24]">
              Los Cuatro Protagonistas
            </h2>
            <p className="font-comic text-base text-[#5A4839]">
              Toca a cualquiera para descubrir su superpoder y travesuras
            </p>
          </div>
          <button
            onClick={() => onGoToCharacters()}
            className="text-xs md:text-sm font-black text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(CHARACTERS_DATA) as Array<keyof typeof CHARACTERS_DATA>).map((cId) => {
            const char = CHARACTERS_DATA[cId];
            return (
              <div
                key={cId}
                onClick={() => {
                  if (cId === 'laisha') comicSound.playLaishaBark();
                  else if (cId === 'merlina') comicSound.playMerlinaBark();
                  else comicSound.playPop();
                  onGoToCharacters(cId);
                }}
                className="bg-white rounded-3xl storybook-border p-4 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${char.themeColor.badgeBg}`}>
                      {char.nickname}
                    </span>
                    <span className="text-xs font-bold text-amber-700">Ver ficha 👉</span>
                  </div>

                  <div className="flex items-center justify-center my-2">
                    <StorybookCharacter
                      characterId={char.id}
                      size="lg"
                      className="transition-transform group-hover:scale-110"
                    />
                  </div>

                  <h3 className="font-title font-black text-xl text-[#382B24] text-center mb-1">
                    {char.name}
                  </h3>
                  <p className="font-comic text-sm text-amber-800 text-center font-bold mb-2">
                    {char.role}
                  </p>
                  <p className="font-comic text-sm text-slate-700 text-center line-clamp-2">
                    {char.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-900 group-hover:translate-x-1 transition-transform">
                  <span>Conocer más</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Neighborhood & Park Setting Feature */}
      <section className="bg-white rounded-3xl storybook-border p-6 md:p-8 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                🌳 El escenario de nuestras historias
              </span>
            </div>
            <h2 className="font-title font-black text-2xl md:text-3xl text-[#382B24] mb-2">
              Una casa acogedora y un gran parque para correr
            </h2>
            <p className="font-comic text-base md:text-lg text-slate-700 leading-relaxed mb-4">
              Nuestras historias suceden en un conjunto familiar tranquilo: la sala con sus sillones cómodos,
              el jardín donde Laisha toma el sol, las banquetas por donde pasea Jorge, y sobre todo...
              ¡el gran parque verde lleno de árboles, mariposas y pelotas rebotando!
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-black text-slate-700">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Cuidado y amor animal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Paseos y juego al aire libre</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Paciencia y convivencia</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center bg-amber-100 rounded-3xl p-6 storybook-border-sm text-center">
            <span className="text-sm font-black text-amber-950 uppercase mb-2">
              ¿Listo para empezar la aventura?
            </span>
            <p className="font-comic text-sm md:text-base text-slate-700 mb-4">
              Lee cómo llegó Laisha a casa en el primer capítulo interactivo.
            </p>
            <button
              onClick={handleReadClick}
              className="w-full px-5 py-3 rounded-2xl font-title font-black text-base bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button cursor-pointer"
            >
              ¡Vamos a leer!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
