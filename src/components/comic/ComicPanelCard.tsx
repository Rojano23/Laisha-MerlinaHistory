/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ComicPanel, CharacterId } from '../../types/comic';
import { StorybookScene } from '../illustrations/StorybookScenes';
import { StorybookCharacter } from '../illustrations/StorybookAvatars';
import { SpeechBalloon } from './SpeechBalloon';
import { CHARACTERS_DATA } from '../../data/characters';
import { comicSound } from '../../utils/audio';
import { Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';

interface ComicPanelCardProps {
  panel: ComicPanel;
  totalPanels: number;
  onThoughtDiscovered?: (thoughtId: string) => void;
  onToggleThought?: (thoughtId: string) => void;
  discoveredThoughts?: Set<string>;
}

export const ComicPanelCard: React.FC<ComicPanelCardProps> = ({
  panel,
  totalPanels,
  onThoughtDiscovered,
  onToggleThought,
  discoveredThoughts = new Set(),
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);

  // When all thoughts are reset (e.g. restart), ensure the character drawer also closes
  useEffect(() => {
    if (discoveredThoughts.size === 0) {
      setSelectedCharacter(null);
    }
  }, [discoveredThoughts.size]);

  // Active interaction for tapped character in the illustration
  const activeInteraction = panel.interactions.find(
    (i) => selectedCharacter && i.characterId === selectedCharacter
  );

  const handleCharacterClick = (charId: CharacterId) => {
    // If the user taps the same character again, toggle it closed
    if (selectedCharacter === charId) {
      setSelectedCharacter(null);
      comicSound.playPop();
      return;
    }

    setSelectedCharacter(charId);
    const interaction = panel.interactions.find((i) => i.characterId === charId);
    if (interaction && onThoughtDiscovered) {
      onThoughtDiscovered(interaction.id);
    }

    // Single audio authority: plays character sound with strict human safety
    comicSound.playCharacterSound(charId, interaction?.soundCue);
  };

  const handleCloseCharacterDrawer = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCharacter(null);
    comicSound.playPop();
  };

  return (
    <article className="bg-[#FFFDF9] rounded-3xl storybook-border-lg p-4 md:p-6 mb-8 md:mb-12 shadow-lg relative overflow-hidden transition-all">
      {/* Top Header of the Scene */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#382B24]/15 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="font-title font-black text-xs md:text-sm px-3 py-1 bg-[#382B24] text-[#FFFBEB] rounded-xl tracking-wider uppercase">
            Escena {panel.panelNumber} de {totalPanels}
          </span>
          <h3 className="font-title font-extrabold text-xl md:text-2xl text-[#382B24]">
            {panel.title}
          </h3>
        </div>

        <div className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          📍 {panel.setting}
        </div>
      </header>

      {/* Narration Box */}
      {panel.narration && (
        <div className="bg-[#FEF9C3] rounded-2xl p-3.5 storybook-border-sm mb-4">
          <p className="font-comic text-base md:text-lg leading-relaxed text-[#451A03] font-medium">
            {panel.narration}
          </p>
        </div>
      )}

      {/* Main Illustration Scene Canvas */}
      <div className="relative rounded-2xl overflow-hidden storybook-border bg-amber-50 mb-5">
        <div className="w-full aspect-[16/10] max-h-[460px]">
          <StorybookScene
            sceneId={panel.illustrationSceneId}
            onCharacterClick={handleCharacterClick}
            highlightCharacter={selectedCharacter}
          />
        </div>

        {/* Fun Story Stickers */}
        {panel.funStickers?.map((sticker, idx) => (
          <div
            key={idx}
            className={`absolute ${sticker.position} ${sticker.color} ${sticker.rotation} storybook-border-sm px-3 py-1 rounded-xl font-marker text-xs md:text-sm font-extrabold shadow-md pointer-events-none select-none`}
          >
            {sticker.text}
          </div>
        ))}

        {/* Floating Tap-me Tip */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs font-extrabold text-[#382B24] storybook-border-sm flex items-center gap-2 shadow-sm pointer-events-none">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span>¡Toca a los personajes para ver qué piensan!</span>
        </div>
      </div>

      {/* Character Thought Box Popup when a character is tapped */}
      {selectedCharacter && activeInteraction && (
        <div className="mb-5 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl storybook-border border-[#382B24] animate-pop-thought">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <StorybookCharacter characterId={selectedCharacter} size="sm" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 block">
                  Pensamiento secreto de {CHARACTERS_DATA[selectedCharacter]?.name}
                </span>
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡Pensamiento revelado!</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseCharacterDrawer}
              className="text-xs font-bold px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-xl text-amber-950 storybook-border-sm cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>
          <p className="font-comic text-lg md:text-xl text-[#382B24] italic bg-white/90 p-3.5 rounded-2xl storybook-border-sm font-semibold">
            {activeInteraction.revealedThought}
          </p>
        </div>
      )}

      {/* Speech and Thought Balloons (Controlled) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 mb-2 text-xs font-black text-[#382B24] uppercase tracking-wider">
          <MessageCircle className="w-4 h-4 text-amber-800" />
          <span>Lo que dicen y piensan en esta escena:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {panel.dialogues.map((bubble) => (
            <div key={bubble.id} className="flex flex-col items-start w-full">
              <SpeechBalloon
                bubble={bubble}
                isRevealed={discoveredThoughts.has(bubble.id)}
                onToggleThought={onToggleThought}
                onRevealThought={onThoughtDiscovered}
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
