/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CHARACTERS_DATA } from '../../data/characters';
import { CharacterId, CharacterProfile } from '../../types/comic';
import { StorybookCharacter } from '../illustrations/StorybookAvatars';
import { comicSound } from '../../utils/audio';
import {
  Volume2,
  Heart,
  Zap,
  Sparkles,
  Smile,
  BookOpen,
} from 'lucide-react';

interface CharacterRosterProps {
  initialCharacterId?: CharacterId;
  onStartReading?: () => void;
}

export const CharacterRoster: React.FC<CharacterRosterProps> = ({
  initialCharacterId = 'laisha',
  onStartReading,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>(initialCharacterId);
  const [thoughtRevealed, setThoughtRevealed] = useState<boolean>(false);

  const character: CharacterProfile = CHARACTERS_DATA[selectedCharId] || CHARACTERS_DATA.laisha;

  const handleSelectCharacter = (id: CharacterId) => {
    setSelectedCharId(id);
    setThoughtRevealed(false);
    if (id === 'laisha' || id === 'merlina') {
      comicSound.playWoof();
    } else {
      comicSound.playPop();
    }
  };

  const handleToggleThought = () => {
    comicSound.playPop();
    setThoughtRevealed(!thoughtRevealed);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Title */}
      <header className="text-center max-w-xl mx-auto mb-8">
        <span className="font-title font-black text-xs uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-400 inline-block mb-2">
          Conoce a la familia
        </span>
        <h1 className="font-title font-black text-3xl md:text-4xl text-[#382B24]">
          ¡Nuestros Protagonistas!
        </h1>
        <p className="font-comic text-base md:text-lg text-slate-700 mt-2 font-medium">
          Toca a cada personaje para escuchar su voz y descubrir sus superpoderes
        </p>

        {/* Character Selector Pills for Kids */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          {(Object.keys(CHARACTERS_DATA) as CharacterId[]).map((id) => {
            const char = CHARACTERS_DATA[id];
            const isActive = selectedCharId === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectCharacter(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#382B24] text-[#FFFBEB] storybook-button shadow-md'
                    : 'bg-white text-slate-700 hover:bg-amber-100 storybook-border-sm'
                }`}
              >
                <StorybookCharacter characterId={id} size="sm" className="w-8 h-8" />
                <span>{char.name}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Friendly Character Card */}
      <div className="bg-white rounded-3xl storybook-border-lg p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b-2 border-slate-100">
          {/* Big Illustrated Avatar */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-amber-50 rounded-3xl p-6 storybook-border-sm relative">
            <StorybookCharacter characterId={character.id} size="xl" />
            <button
              onClick={() => {
                if (character.id === 'laisha' || character.id === 'merlina') comicSound.playWoof();
                else comicSound.playPop();
              }}
              className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-300 hover:bg-amber-400 text-amber-950 font-black text-xs storybook-border-sm cursor-pointer active:scale-95 transition-transform"
            >
              <Volume2 className="w-4 h-4" />
              <span>¡Tócame para hablar!</span>
            </button>
          </div>

          {/* Character Details */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${character.themeColor.badgeBg}`}>
                {character.nickname}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {character.role}
              </span>
            </div>

            <h2 className="font-title font-black text-3xl md:text-4xl text-[#382B24] mb-2">
              {character.name}
            </h2>

            <p className="font-comic text-lg md:text-xl text-[#4A382D] leading-snug mb-4 font-semibold">
              {character.tagline}
            </p>

            {/* Superpower Callout */}
            <div className="p-3.5 bg-amber-100 rounded-2xl storybook-border-sm mb-4 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-title font-black text-xs uppercase text-amber-950 block">
                  Su superpoder especial:
                </span>
                <p className="font-comic text-base text-amber-900 font-bold">
                  {character.appearance.superpower}
                </p>
              </div>
            </div>

            {/* Appearance description */}
            <p className="font-comic text-sm md:text-base text-slate-700 mb-2">
              <strong>Cómo reconocerle: </strong> {character.appearance.lookDescription}
            </p>
          </div>
        </div>

        {/* Fun Facts & Secret Thought Interactive Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#FAF5EB] p-4 rounded-2xl storybook-border-sm">
            <div className="flex items-center gap-2 mb-2 text-xs font-black text-[#382B24] uppercase">
              <Smile className="w-4 h-4 text-amber-700" />
              <span>Cosas que le encantan:</span>
            </div>
            <ul className="space-y-1.5 font-comic text-sm md:text-base text-slate-700">
              <li>• <strong>Actividad favorita:</strong> {character.funFacts.favoriteActivity}</li>
              <li>• <strong>Premio o comida favorita:</strong> {character.funFacts.favoriteSnack}</li>
              <li>• <strong>Hábito chistoso:</strong> {character.funFacts.funnyHabit}</li>
            </ul>
          </div>

          {/* Interactive Thought Bubble */}
          <div
            onClick={handleToggleThought}
            className="bg-amber-100 hover:bg-amber-200/90 p-4 rounded-2xl storybook-border-sm cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span>¿Qué estará pensando ahora?</span>
                </span>
                <span className="text-[11px] font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                  {thoughtRevealed ? 'Ocultar' : '¡Tócame! 👈'}
                </span>
              </div>

              {thoughtRevealed ? (
                <p className="font-comic text-base md:text-lg text-[#382B24] italic font-bold animate-pop-thought">
                  {character.funFacts.favoriteThought}
                </p>
              ) : (
                <p className="font-comic text-sm md:text-base text-amber-900 font-semibold py-2">
                  💭 Toca aquí para espiar el pensamiento secreto de {character.name}...
                </p>
              )}
            </div>

            <div className="text-[11px] text-amber-800 font-bold mt-2 text-right">
              {thoughtRevealed ? '✨ ¡Pensamiento leído!' : '¡Haz clic para ver!'}
            </div>
          </div>
        </div>

        {/* Action Button to Read */}
        {onStartReading && (
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <p className="font-comic text-base text-slate-700 font-bold">
              ¿Quieres ver a {character.name} en acción en la historieta?
            </p>
            <button
              onClick={onStartReading}
              className="px-6 py-3 rounded-2xl font-title font-black text-base bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>¡Vamos a leer el capítulo piloto!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
