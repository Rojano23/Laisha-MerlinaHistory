/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DialogueBubble } from '../../types/comic';
import { comicSound } from '../../utils/audio';
import { Sparkles } from 'lucide-react';

interface SpeechBalloonProps {
  bubble: DialogueBubble;
  isRevealed?: boolean;
  onToggleThought?: (id: string) => void;
  onRevealThought?: (id: string) => void;
  initiallyRevealed?: boolean; // Backwards compatibility fallback
}

export const SpeechBalloon: React.FC<SpeechBalloonProps> = ({
  bubble,
  isRevealed,
  onToggleThought,
  onRevealThought,
  initiallyRevealed = false,
}) => {
  // Fully controlled revelation: secret thoughts depend strictly on the reader's state
  const isSecret = Boolean(bubble.isSecretThought);
  const revealed = !isSecret || (isRevealed !== undefined ? isRevealed : initiallyRevealed);

  const handleToggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    comicSound.playPop();
    if (onToggleThought) {
      onToggleThought(bubble.id);
    } else if (onRevealThought) {
      onRevealThought(bubble.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  };

  // Dialogue Balloon (Spoken words - always visible)
  if (bubble.type === 'dialogue') {
    return (
      <div className="relative inline-block w-full max-w-sm bg-white rounded-3xl p-3.5 md:p-4 storybook-border text-[#382B24] storybook-balloon-shadow">
        <div className="flex items-center gap-1.5 mb-1 text-xs font-black text-amber-800 tracking-wide uppercase">
          <span>{bubble.speakerName}</span>
        </div>
        <p className="font-comic text-base md:text-lg leading-snug tracking-tight text-[#382B24]">
          {bubble.text}
        </p>
        {/* Tail */}
        <div className="absolute -bottom-2.5 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#382B24]" />
        <div className="absolute -bottom-1.5 left-[25px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white" />
      </div>
    );
  }

  // Shout / Exclamation Balloon (Spoken aloud with excitement - always visible)
  if (bubble.type === 'shout') {
    return (
      <div className="relative inline-block w-full max-w-sm bg-amber-200 rounded-3xl p-3.5 md:p-4 storybook-border-lg text-[#382B24] shadow-md">
        <div className="flex items-center justify-between gap-1.5 mb-1 text-xs font-black text-red-700 tracking-wider uppercase">
          <span>{bubble.speakerName}</span>
          <span className="text-sm">⚡</span>
        </div>
        <p className="font-title font-extrabold text-base md:text-lg leading-tight text-red-950 uppercase">
          {bubble.text}
        </p>
        <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#382B24]" />
        <div className="absolute -bottom-2 left-[33px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[11px] border-t-amber-200" />
      </div>
    );
  }

  // Thought Balloon (Cloud-like with secret thought prompt for kids)
  return (
    <div className="relative inline-block w-full max-w-sm">
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={revealed}
        aria-label={revealed ? `Pensamiento revelado de ${bubble.speakerName}: ${bubble.text}` : `Toca para descubrir qué está pensando ${bubble.speakerName}`}
        className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-amber-400 ${
          revealed
            ? 'bg-amber-100/95 storybook-border text-[#382B24] storybook-balloon-shadow animate-pop-thought hover:bg-amber-100'
            : 'bg-amber-200/90 border-3 border-dashed border-[#382B24] hover:bg-amber-300 storybook-button'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
            <span>💭 Pensamiento de {bubble.speakerName}</span>
          </div>
          {bubble.isSecretThought && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                revealed
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-amber-400 text-amber-950 animate-bounce-soft'
              }`}
            >
              {revealed ? '¡Descubierto! ✨' : '¡Tócame! 👈'}
            </span>
          )}
        </div>

        {revealed ? (
          <p className="font-comic italic text-base md:text-lg leading-snug text-[#382B24] font-medium">
            {bubble.text}
          </p>
        ) : (
          <div className="py-2 flex items-center justify-center gap-2 text-center">
            <Sparkles className="w-4 h-4 text-amber-800 animate-pulse" />
            <p className="font-comic text-base md:text-lg text-amber-950 font-bold">
              ¿Qué estará pensando? ¡Toca aquí!
            </p>
          </div>
        )}
      </div>

      {/* Cloud thought bubbles trailing */}
      <div className="flex items-center gap-1.5 mt-1.5 ml-8" aria-hidden="true">
        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#382B24]" />
        <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#382B24]" />
        <div className="w-2 h-2 rounded-full bg-white border-2 border-[#382B24]" />
      </div>
    </div>
  );
};
