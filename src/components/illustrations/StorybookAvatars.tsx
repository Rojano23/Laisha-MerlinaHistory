/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterId } from '../../types/comic';

interface AvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'normal' | 'happy' | 'thinking' | 'wink' | 'mischievous';
  interactive?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-40 h-40 md:w-48 md:h-48',
};

// ==========================================
// LAISHA: The Wise Storybook Mom (Blue Heeler)
// ==========================================
export const LaishaStorybook: React.FC<AvatarProps> = ({
  className = '',
  size = 'md',
  expression = 'normal',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full drop-shadow-md select-none overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Warm Storybook Glow */}
        <circle cx="70" cy="70" r="64" fill="#FEF3C7" stroke="#382B24" strokeWidth="3.5" />
        <circle cx="70" cy="70" r="56" fill="#FFFBEB" />

        {/* EARS (With soft twitch animation) */}
        <g className="animate-ear-twitch">
          {/* Left Ear */}
          <path
            d="M32 52 C26 30 38 12 46 8 C54 18 58 35 60 52 Z"
            fill="#475569"
            stroke="#382B24"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Left Inner Ear (Tan & Pink warmth) */}
          <path d="M38 46 C34 30 42 18 46 14 C48 22 52 32 54 46 Z" fill="#FDBA74" opacity="0.85" />

          {/* Right Ear */}
          <path
            d="M108 52 C114 30 102 12 94 8 C86 18 82 35 80 52 Z"
            fill="#334155"
            stroke="#382B24"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Inner Ear */}
          <path d="M102 46 C106 30 98 18 94 14 C92 22 88 32 86 46 Z" fill="#FDBA74" opacity="0.85" />
        </g>

        {/* CUDDLY HEAD SHAPE (Fluffy Storybook Curves) */}
        <path
          d="M36 58 C32 40 108 40 104 58 C112 72 108 96 96 106 C84 114 56 114 44 106 C32 96 28 72 36 58 Z"
          fill="#64748B"
          stroke="#382B24"
          strokeWidth="3.5"
        />

        {/* Fluffy Cheeks Tufts */}
        <path d="M30 74 C24 78 28 84 34 82 C28 88 34 94 40 90" stroke="#382B24" strokeWidth="2.5" fill="#64748B" />
        <path d="M110 74 C116 78 112 84 106 82 C112 88 106 94 100 90" stroke="#382B24" strokeWidth="2.5" fill="#64748B" />

        {/* BLUE HEELER MOTTLE SPOTS & COAT DETAILS */}
        {/* Dark patches over forehead & sides */}
        <path d="M42 50 C46 44 58 44 62 52 C58 62 48 62 42 50 Z" fill="#334155" />
        <path d="M80 50 C86 42 98 46 98 56 C92 64 82 60 80 50 Z" fill="#1E293B" />
        {/* Soft white blaze on forehead (Laisha's real trait) */}
        <path d="M68 44 C67 36 73 36 72 44 C72 52 68 52 68 44 Z" fill="#F8FAFC" />
        <circle cx="54" cy="56" r="2" fill="#E2E8F0" />
        <circle cx="86" cy="58" r="2" fill="#E2E8F0" />
        <circle cx="50" cy="66" r="1.5" fill="#E2E8F0" />
        <circle cx="90" cy="68" r="1.5" fill="#E2E8F0" />

        {/* TAN EYEBROWS & CHEEKS (Warm storybook appeal) */}
        <circle cx="50" cy="58" r="4.5" fill="#F59E0B" />
        <circle cx="90" cy="58" r="4.5" fill="#F59E0B" />
        {/* Tan Cheeks */}
        <ellipse cx="44" cy="80" rx="9" ry="7" fill="#F59E0B" opacity="0.9" />
        <ellipse cx="96" cy="80" rx="9" ry="7" fill="#F59E0B" opacity="0.9" />

        {/* EYES (Expressive with Blinking animation) */}
        <g className="animate-dog-blink">
          {expression === 'mischievous' || expression === 'wink' ? (
            <>
              {/* Left eye open, right eye winking */}
              <circle cx="52" cy="70" r="6" fill="#382B24" />
              <circle cx="50" cy="68" r="2" fill="#FFFFFF" />
              <path d="M82 72 Q90 64 98 72" stroke="#382B24" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="52" cy="70" rx="6" ry="7" fill="#382B24" />
              <circle cx="50" cy="67.5" r="2.2" fill="#FFFFFF" />
              <circle cx="53.5" cy="72" r="1" fill="#FFFFFF" />
              {/* Right Eye */}
              <ellipse cx="88" cy="70" rx="6" ry="7" fill="#382B24" />
              <circle cx="86" cy="67.5" r="2.2" fill="#FFFFFF" />
              <circle cx="89.5" cy="72" r="1" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* SNOUT & SWEET SMILE */}
        <ellipse cx="70" cy="86" rx="16" ry="12" fill="#FDE68A" stroke="#382B24" strokeWidth="2.5" />
        {/* Shiny Black Nose */}
        <path
          d="M63 81 C63 78 77 78 77 81 C77 87 70 90 70 90 C70 90 63 87 63 81 Z"
          fill="#382B24"
        />
        <circle cx="67" cy="82" r="1.5" fill="#FFFFFF" opacity="0.8" />
        {/* Gentle smiling mouth */}
        <path d="M70 90 L70 96 M62 94 Q70 100 78 94" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />

        {/* PINK CORAL COLLAR (Her distinctive trait) */}
        <path
          d="M44 104 C52 112 88 112 96 104 L98 114 C88 123 52 123 42 114 Z"
          fill="#FB7185"
          stroke="#382B24"
          strokeWidth="3"
        />
        {/* Golden round medallion tag */}
        <circle cx="70" cy="116" r="6" fill="#FBBF24" stroke="#382B24" strokeWidth="2" />
        <circle cx="68.5" cy="114.5" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

// ==========================================
// MERLINA: The Energetic Storybook Daughter
// ==========================================
export const MerlinaStorybook: React.FC<AvatarProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full drop-shadow-md select-none overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Mint Glow Backdrop */}
        <circle cx="70" cy="70" r="64" fill="#CCFBF1" stroke="#382B24" strokeWidth="3.5" />
        <circle cx="70" cy="70" r="56" fill="#F0FDFA" />

        {/* WAGGING TAIL in background! */}
        <g className="animate-tail-wag" style={{ transformOrigin: '20px 105px' }}>
          <path
            d="M26 102 C14 96 10 78 18 68 C22 76 26 84 32 92 Z"
            fill="#334155"
            stroke="#382B24"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>

        {/* HIGH-ENERGY EARS (One tilted with excitement) */}
        {/* Left Ear */}
        <path
          d="M26 50 C18 28 32 8 42 4 C50 16 56 34 58 50 Z"
          fill="#1E293B"
          stroke="#382B24"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M34 44 C28 28 38 14 42 10 C46 18 50 28 52 44 Z" fill="#FB923C" opacity="0.85" />

        {/* Right Ear (Slightly perked outwards) */}
        <path
          d="M114 50 C122 28 108 8 98 4 C90 16 84 34 82 50 Z"
          fill="#1E293B"
          stroke="#382B24"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M106 44 C112 28 102 14 98 10 C94 18 90 28 88 44 Z" fill="#FB923C" opacity="0.85" />

        {/* HEAD (Cute round puppy-like curves) */}
        <path
          d="M34 56 C30 38 110 38 106 56 C114 70 110 94 98 104 C86 112 54 112 42 104 C30 94 26 70 34 56 Z"
          fill="#475569"
          stroke="#382B24"
          strokeWidth="3.5"
        />

        {/* DARK MASK PATTERN (Super cute hero mask) */}
        <path d="M36 56 C42 46 58 46 62 58 C58 72 44 70 36 56 Z" fill="#0F172A" />
        <path d="M104 56 C98 46 82 46 78 58 C82 72 96 70 104 56 Z" fill="#0F172A" />

        {/* TAN EYEBROW DOTS */}
        <circle cx="48" cy="54" r="5" fill="#FB923C" />
        <circle cx="92" cy="54" r="5" fill="#FB923C" />

        {/* HUGE HAPPY EYES */}
        <ellipse cx="50" cy="68" rx="6.5" ry="7.5" fill="#382B24" />
        <circle cx="47.5" cy="65.5" r="2.5" fill="#FFFFFF" />
        <circle cx="51.5" cy="70" r="1.2" fill="#FFFFFF" />

        <ellipse cx="90" cy="68" rx="6.5" ry="7.5" fill="#382B24" />
        <circle cx="87.5" cy="65.5" r="2.5" fill="#FFFFFF" />
        <circle cx="91.5" cy="70" r="1.2" fill="#FFFFFF" />

        {/* TAN CHEEKS */}
        <ellipse cx="42" cy="78" rx="8" ry="6" fill="#FDBA74" />
        <ellipse cx="98" cy="78" rx="8" ry="6" fill="#FDBA74" />

        {/* SNOUT */}
        <ellipse cx="70" cy="84" rx="15" ry="11" fill="#FDBA74" stroke="#382B24" strokeWidth="2.5" />
        {/* Nose */}
        <path d="M63 79 C63 76 77 76 77 79 C77 84 70 87 70 87 Z" fill="#382B24" />
        <circle cx="67" cy="80" r="1.5" fill="#FFFFFF" opacity="0.8" />

        {/* BIG HAPPY SMILE WITH TONGUE OUT! */}
        <path d="M62 90 Q70 96 78 90" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pink tongue lolling out */}
        <path
          d="M68 92 C68 104 82 104 80 92 Z"
          fill="#F43F5E"
          stroke="#382B24"
          strokeWidth="2.5"
        />
        <line x1="74" y1="92" x2="74" y2="99" stroke="#E11D48" strokeWidth="1.5" />

        {/* MINT TURQUOISE COLLAR (Her signature trait) */}
        <path
          d="M42 102 C50 110 90 110 98 102 L100 112 C90 120 50 120 40 112 Z"
          fill="#2DD4BF"
          stroke="#382B24"
          strokeWidth="3"
        />
        {/* Silver bell/tag */}
        <circle cx="70" cy="115" r="5" fill="#FFFFFF" stroke="#382B24" strokeWidth="2" />
      </svg>
    </div>
  );
};

// ==========================================
// MORE: Warm Storybook Mom
// ==========================================
export const MoreStorybook: React.FC<AvatarProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full drop-shadow-md select-none overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="70" cy="70" r="64" fill="#FFE4E6" stroke="#382B24" strokeWidth="3.5" />
        <circle cx="70" cy="70" r="56" fill="#FFF1F2" />

        {/* Long wavy dark brown hair (Storybook waves) */}
        <path d="M30 60 C22 80 26 110 38 124 C44 124 40 102 46 90 Z" fill="#451A03" stroke="#382B24" strokeWidth="3" />
        <path d="M110 60 C118 80 114 110 102 124 C96 124 100 102 94 90 Z" fill="#451A03" stroke="#382B24" strokeWidth="3" />

        {/* Cozy shirt */}
        <path d="M46 114 C56 104 84 104 94 114 L98 134 L42 134 Z" fill="#E11D48" stroke="#382B24" strokeWidth="3" />

        {/* Warm round face */}
        <circle cx="70" cy="74" r="32" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />

        {/* Hair front locks */}
        <path d="M42 54 C46 36 94 36 98 54 C94 44 86 40 70 40 C54 40 46 44 42 54 Z" fill="#451A03" />
        <path d="M40 56 C38 70 42 84 46 92" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 56 C102 70 98 84 94 92" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />

        {/* LENSES / ROUND WIRE GLASSES (Signature trait) */}
        <circle cx="56" cy="72" r="10" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
        <circle cx="84" cy="72" r="10" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
        <line x1="66" y1="72" x2="74" y2="72" stroke="#92400E" strokeWidth="2.5" />

        {/* Eyes inside lenses */}
        <circle cx="56" cy="72" r="3" fill="#382B24" />
        <circle cx="55" cy="71" r="1" fill="#FFFFFF" />
        <circle cx="84" cy="72" r="3" fill="#382B24" />
        <circle cx="83" cy="71" r="1" fill="#FFFFFF" />

        {/* Rosy cheeks */}
        <ellipse cx="48" cy="80" rx="4" ry="2.5" fill="#FDA4AF" />
        <ellipse cx="92" cy="80" rx="4" ry="2.5" fill="#FDA4AF" />

        {/* Warm smile */}
        <path d="M60 84 Q70 93 80 84" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const CeciStorybook = MoreStorybook;

// ==========================================
// ROX: Cheerful Storybook Dad
// ==========================================
export const RoxStorybook: React.FC<AvatarProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full drop-shadow-md select-none overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="70" cy="70" r="64" fill="#DCFCE7" stroke="#382B24" strokeWidth="3.5" />
        <circle cx="70" cy="70" r="56" fill="#F0FDF4" />

        {/* Green athletic jersey (Park ready!) */}
        <path d="M42 114 C54 102 86 102 98 114 L102 134 L38 134 Z" fill="#059669" stroke="#382B24" strokeWidth="3" />
        <path d="M64 108 L70 116 L76 108" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Short friendly dark hair */}
        <path d="M42 56 C42 36 98 36 98 56 C102 46 94 34 70 34 C46 34 38 46 42 56 Z" fill="#292524" />

        {/* Cheerful round face */}
        <circle cx="70" cy="74" r="32" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />

        {/* Big bright happy eyes */}
        <circle cx="56" cy="70" r="3.5" fill="#382B24" />
        <circle cx="55" cy="69" r="1.2" fill="#FFFFFF" />
        <circle cx="84" cy="70" r="3.5" fill="#382B24" />
        <circle cx="83" cy="69" r="1.2" fill="#FFFFFF" />

        {/* Cheerful eyebrows */}
        <path d="M50 63 Q56 59 62 63" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 63 Q84 59 90 63" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <ellipse cx="48" cy="78" rx="4" ry="2.5" fill="#FCA5A5" />
        <ellipse cx="92" cy="78" rx="4" ry="2.5" fill="#FCA5A5" />

        {/* Big happy open laugh */}
        <path d="M58 82 C58 96 82 96 82 82 Z" fill="#FFFFFF" stroke="#382B24" strokeWidth="2.5" />
        <line x1="58" y1="82" x2="82" y2="82" stroke="#382B24" strokeWidth="2" />
      </svg>
    </div>
  );
};

export const FoxStorybook = RoxStorybook;
export const JorgeStorybook = RoxStorybook;

// Dispatcher Component
export const StorybookCharacter: React.FC<{
  characterId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'normal' | 'happy' | 'thinking' | 'wink' | 'mischievous';
}> = ({ characterId, className = '', size = 'md', expression = 'normal' }) => {
  const normalizedId = (characterId || '').toLowerCase().trim();

  switch (normalizedId) {
    case 'laisha':
      return <LaishaStorybook className={className} size={size} expression={expression} />;
    case 'merlina':
      return <MerlinaStorybook className={className} size={size} expression={expression} />;
    case 'more':
    case 'ceci':
      return <MoreStorybook className={className} size={size} expression={expression} />;
    case 'rox':
    case 'fox':
    case 'jorge':
      return <RoxStorybook className={className} size={size} expression={expression} />;
    default:
      return (
        <div className={`rounded-full bg-amber-100 storybook-border flex items-center justify-center font-bold text-xs ${sizeClasses[size]} ${className}`}>
          🐾
        </div>
      );
  }
};
