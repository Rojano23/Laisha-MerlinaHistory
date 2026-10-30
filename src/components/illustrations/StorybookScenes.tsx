/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterId } from '../../types/comic';

interface StorybookSceneProps {
  sceneId: string;
  onCharacterClick?: (characterId: CharacterId) => void;
  highlightCharacter?: CharacterId | null;
}

export const StorybookScene: React.FC<StorybookSceneProps> = ({
  sceneId,
  onCharacterClick,
}) => {
  const handleCharClick = (charId: CharacterId) => {
    if (onCharacterClick) {
      onCharacterClick(charId);
    }
  };

  switch (sceneId) {
    // ----------------------------------------------------
    // SCENE 1: El pacto de la casa limpia
    // ----------------------------------------------------
    case 'scene-nostalgia-pact':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wall background in warm sunny cream */}
          <rect width="640" height="400" fill="#FFFBEB" />
          {/* Floor with warm wooden parquet tones */}
          <rect y="300" width="640" height="100" fill="#E6D2B5" stroke="#382B24" strokeWidth="3" />
          <line x1="0" y1="340" x2="640" y2="340" stroke="#D1B896" strokeWidth="2.5" strokeDasharray="24 16" />

          {/* Arched Sunny Window with soft drifting clouds */}
          <g>
            <path d="M240 200 L240 90 C240 40 400 40 400 90 L400 200 Z" fill="#BAE6FD" stroke="#382B24" strokeWidth="3.5" />
            <line x1="320" y1="52" x2="320" y2="200" stroke="#382B24" strokeWidth="3" />
            <line x1="240" y1="130" x2="400" y2="130" stroke="#382B24" strokeWidth="3" />
            {/* Friendly sun */}
            <circle cx="280" cy="95" r="22" fill="#FDE047" stroke="#382B24" strokeWidth="2" />
            {/* Soft fluffy clouds */}
            <g className="animate-float-cloud">
              <path d="M330 110 Q345 95 365 110 Q380 105 385 115 L325 115 Z" fill="#FFFFFF" opacity="0.9" />
            </g>
          </g>

          {/* Cozy Armchair in corner */}
          <path d="M50 240 C50 180 80 170 110 170 C140 170 170 180 170 240 L170 310 L50 310 Z" fill="#FCA5A5" stroke="#382B24" strokeWidth="3" />
          <rect x="65" y="250" width="90" height="40" rx="10" fill="#F87171" stroke="#382B24" strokeWidth="2.5" />
          {/* Small framed puppy picture on wall */}
          <g className="cursor-pointer" onClick={() => handleCharClick('jorge')}>
            <rect x="70" y="50" width="80" height="95" rx="10" fill="#FEF08A" stroke="#382B24" strokeWidth="3.5" />
            <rect x="78" y="58" width="64" height="66" rx="6" fill="#E2E8F0" />
            {/* Silueta tierna de perrito */}
            <circle cx="110" cy="88" r="16" fill="#64748B" />
            <polygon points="98,75 106,62 112,76" fill="#475569" />
            <polygon points="115,75 120,62 126,76" fill="#475569" />
            <text x="110" y="138" fontSize="10" textAnchor="middle" fill="#382B24" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">
              Amiga fiel 🐾
            </text>
          </g>

          {/* Coffee Table with cute mugs */}
          <path d="M230 280 L410 280 C420 280 425 295 415 305 L225 305 C215 295 220 280 230 280 Z" fill="#D97706" stroke="#382B24" strokeWidth="3" />
          <line x1="260" y1="305" x2="255" y2="360" stroke="#382B24" strokeWidth="3.5" />
          <line x1="380" y1="305" x2="385" y2="360" stroke="#382B24" strokeWidth="3.5" />
          {/* Mug with heart */}
          <rect x="305" y="260" width="30" height="22" rx="6" fill="#FFFFFF" stroke="#382B24" strokeWidth="2" />
          <path d="M335 264 Q345 270 335 276" stroke="#382B24" strokeWidth="2" />
          <circle cx="320" cy="271" r="3" fill="#EF4444" />

          {/* JORGE (Left) - Storybook style, arms out expressing dreams */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('jorge')}>
            {/* Body */}
            <path d="M125 340 L135 230 C135 190 205 190 205 230 L215 340 Z" fill="#10B981" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="170" cy="165" r="34" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            {/* Hair */}
            <path d="M142 150 C142 125 198 125 198 150 C202 140 192 130 170 130 C148 130 142 140 142 150 Z" fill="#292524" />
            {/* Eyes & Big open smile */}
            <circle cx="158" cy="160" r="4" fill="#382B24" />
            <circle cx="156" cy="158" r="1.5" fill="#FFFFFF" />
            <circle cx="182" cy="160" r="4" fill="#382B24" />
            <circle cx="180" cy="158" r="1.5" fill="#FFFFFF" />
            <path d="M158 175 Q170 190 182 175 Z" fill="#FFFFFF" stroke="#382B24" strokeWidth="2.5" />
            {/* Arm gesturing */}
            <path d="M135 230 Q105 210 115 180" stroke="#10B981" strokeWidth="18" strokeLinecap="round" />
            <path d="M135 230 Q105 210 115 180" stroke="#382B24" strokeWidth="3.5" fill="none" />
            <circle cx="115" cy="175" r="10" fill="#FED7AA" stroke="#382B24" strokeWidth="2.5" />

            {/* Tap Badge */}
            <rect x="130" y="100" width="80" height="24" rx="12" fill="#10B981" stroke="#382B24" strokeWidth="2" />
            <text x="170" y="116" fontSize="12" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">
              ¡Toca a Jorge!
            </text>
          </g>

          {/* CECI (Right) - Storybook style with crossed arms & warm smile */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('ceci')}>
            {/* Hair back */}
            <path d="M470 180 C445 220 445 280 455 310 C480 310 470 250 480 220 Z" fill="#451A03" stroke="#382B24" strokeWidth="3" />
            <path d="M530 180 C555 220 555 280 545 310 C520 310 530 250 520 220 Z" fill="#451A03" stroke="#382B24" strokeWidth="3" />
            {/* Body */}
            <path d="M465 340 L470 230 C470 190 530 190 530 230 L535 340 Z" fill="#E11D48" stroke="#382B24" strokeWidth="3.5" />
            {/* Head */}
            <circle cx="500" cy="165" r="32" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            {/* Front wavy hair */}
            <path d="M472 155 C476 130 524 130 528 155" fill="#451A03" stroke="#382B24" strokeWidth="2" />
            {/* Glasses */}
            <circle cx="488" cy="162" r="9" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="512" cy="162" r="9" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            <line x1="497" y1="162" x2="503" y2="162" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="488" cy="162" r="3" fill="#382B24" />
            <circle cx="512" cy="162" r="3" fill="#382B24" />
            <path d="M492 180 Q500 188 508 180" stroke="#382B24" strokeWidth="2.5" strokeLinecap="round" />

            {/* Tap Badge */}
            <rect x="460" y="100" width="80" height="24" rx="12" fill="#E11D48" stroke="#382B24" strokeWidth="2" />
            <text x="500" y="116" fontSize="12" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">
              ¡Toca a Ceci!
            </text>
          </g>
        </svg>
      );

    // ----------------------------------------------------
    // SCENE 2: El mensaje sorpresa
    // ----------------------------------------------------
    case 'scene-neighbor-message':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="400" fill="#FEF3C7" />
          <rect y="280" width="640" height="120" fill="#FDE68A" stroke="#382B24" strokeWidth="3" />

          {/* Big Colorful Tablet/Phone in center showing Puppy Laisha */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('ceci')}>
            {/* Device Casing */}
            <rect x="220" y="40" width="200" height="310" rx="28" fill="#382B24" stroke="#1E1B18" strokeWidth="4" />
            {/* Screen */}
            <rect x="232" y="55" width="176" height="280" rx="18" fill="#F8FAFC" />

            {/* Social message header */}
            <rect x="242" y="65" width="156" height="32" rx="10" fill="#E0F2FE" />
            <circle cx="260" cy="81" r="9" fill="#0284C7" />
            <text x="275" y="85" fontSize="11" fontWeight="bold" fill="#0369A1" fontFamily="Plus Jakarta Sans, sans-serif">
              Vecino amigo 💬
            </text>

            {/* Adorable puppy illustration inside screen */}
            <rect x="242" y="105" width="156" height="150" rx="14" fill="#FEF9C3" stroke="#FBBF24" strokeWidth="2" />
            {/* Puppy Laisha peeking with big round puppy eyes */}
            <circle cx="320" cy="185" r="38" fill="#64748B" stroke="#382B24" strokeWidth="3" />
            {/* Pointy ears */}
            <polygon points="285,160 270,120 305,145" fill="#475569" stroke="#382B24" strokeWidth="2.5" />
            <polygon points="355,160 370,120 335,145" fill="#334155" stroke="#382B24" strokeWidth="2.5" />
            {/* Tan points */}
            <circle cx="304" cy="172" r="5" fill="#F59E0B" />
            <circle cx="336" cy="172" r="5" fill="#F59E0B" />
            {/* Big puppy eyes */}
            <circle cx="305" cy="185" r="7" fill="#382B24" />
            <circle cx="303" cy="182" r="2.5" fill="#FFFFFF" />
            <circle cx="335" cy="185" r="7" fill="#382B24" />
            <circle cx="333" cy="182" r="2.5" fill="#FFFFFF" />
            {/* Snout */}
            <ellipse cx="320" cy="198" rx="14" ry="10" fill="#FDE68A" stroke="#382B24" strokeWidth="2" />
            <path d="M314 195 Q320 198 326 195" stroke="#382B24" strokeWidth="2" fill="none" />

            {/* Message Banner */}
            <text x="320" y="272" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#B91C1C" fontFamily="Patrick Hand, sans-serif">
              «¡Cachorrita necesita hogar!»
            </text>
            <rect x="250" y="286" width="140" height="34" rx="12" fill="#22C55E" stroke="#382B24" strokeWidth="2" />
            <text x="320" y="308" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif">
              ¡Vamos por ella! ❤️
            </text>
          </g>

          {/* Ceci on Left - Hand on heart, completely moved */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('ceci')}>
            <path d="M80 380 L90 230 C90 190 160 190 160 230 L170 380 Z" fill="#E11D48" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="125" cy="165" r="34" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="113" cy="162" r="9" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="137" cy="162" r="9" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            {/* Hand on heart */}
            <path d="M125 240 Q150 250 160 270" stroke="#E11D48" strokeWidth="18" strokeLinecap="round" />
            <circle cx="160" cy="275" r="10" fill="#FED7AA" stroke="#382B24" strokeWidth="2" />
          </g>

          {/* Jorge on Right - Leaning forward smiling */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('jorge')}>
            <path d="M470 380 L480 230 C480 190 550 190 550 230 L560 380 Z" fill="#10B981" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="515" cy="165" r="34" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            {/* Pointing arm towards phone */}
            <path d="M480 235 Q445 220 425 210" stroke="#10B981" strokeWidth="18" strokeLinecap="round" />
            <circle cx="420" cy="208" r="9" fill="#FED7AA" stroke="#382B24" strokeWidth="2.5" />
          </g>
        </svg>
      );

    // ----------------------------------------------------
    // SCENE 3: Misión rescate al volante
    // ----------------------------------------------------
    case 'scene-neighbor-mission':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Split Screen Storybook Style */}
          {/* Left: Jorge at work */}
          <rect x="0" y="0" width="315" height="400" fill="#F1F5F9" />
          <rect x="30" y="270" width="260" height="40" rx="8" fill="#94A3B8" stroke="#382B24" strokeWidth="3" />
          {/* Jorge with phone */}
          <g className="cursor-pointer" onClick={() => handleCharClick('jorge')}>
            <path d="M70 380 L80 230 C80 190 150 190 150 230 L160 380 Z" fill="#10B981" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="115" cy="165" r="34" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            {/* Phone to ear */}
            <rect x="75" y="145" width="14" height="34" rx="6" fill="#382B24" />
            <rect x="40" y="40" width="180" height="34" rx="14" fill="#10B981" stroke="#382B24" strokeWidth="2.5" />
            <text x="130" y="62" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif">
              «¡Págales lo que sea!»
            </text>
          </g>

          {/* Comic divider line */}
          <line x1="320" y1="0" x2="320" y2="400" stroke="#382B24" strokeWidth="5" />

          {/* Right: Neighbor in fun pickup truck with puppy Laisha */}
          <rect x="325" y="0" width="315" height="400" fill="#FEF9C3" />
          {/* Road */}
          <rect x="325" y="270" width="315" height="130" fill="#78716C" />
          <line x1="325" y1="330" x2="640" y2="330" stroke="#FDE047" strokeWidth="4" strokeDasharray="18 14" />

          {/* Cheerful blue pickup truck */}
          <path d="M350 270 L380 190 L560 190 L615 270 Z" fill="#38BDF8" stroke="#382B24" strokeWidth="3.5" />
          <rect x="390" y="200" width="75" height="55" rx="8" fill="#BAE6FD" stroke="#382B24" strokeWidth="2" />
          <rect x="480" y="200" width="85" height="55" rx="8" fill="#BAE6FD" stroke="#382B24" strokeWidth="2" />

          {/* Neighbor waving */}
          <circle cx="430" cy="225" r="18" fill="#FED7AA" stroke="#382B24" strokeWidth="2" />

          {/* Puppy Laisha in window with tongue out and ears in the wind */}
          <g className="cursor-pointer" onClick={() => handleCharClick('laisha')}>
            <circle cx="530" cy="225" r="22" fill="#64748B" stroke="#382B24" strokeWidth="2.5" />
            <polygon points="510,215 515,185 530,205" fill="#475569" stroke="#382B24" strokeWidth="2" />
            <polygon points="545,215 540,185 528,205" fill="#334155" stroke="#382B24" strokeWidth="2" />
            <circle cx="524" cy="222" r="3.5" fill="#382B24" />
            <circle cx="538" cy="222" r="3.5" fill="#382B24" />
            {/* Happy tongue */}
            <path d="M530 235 Q535 244 531 247 Q527 247 527 238" fill="#F43F5E" />
            {/* Speed wind lines */}
            <line x1="565" y1="205" x2="600" y2="205" stroke="#382B24" strokeWidth="2.5" />
            <line x1="560" y1="220" x2="610" y2="220" stroke="#382B24" strokeWidth="2.5" />
          </g>

          <rect x="370" y="40" width="190" height="34" rx="14" fill="#F59E0B" stroke="#382B24" strokeWidth="2.5" />
          <text x="465" y="62" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif">
            ¡Rumbo a su nuevo hogar! 🚗
          </text>
        </svg>
      );

    // ----------------------------------------------------
    // SCENE 4: ¡Una sorpresa en la puerta!
    // ----------------------------------------------------
    case 'scene-door-arrival':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="400" fill="#FAF5EB" />
          <rect y="280" width="640" height="120" fill="#E8D5B5" stroke="#382B24" strokeWidth="3" />

          {/* Open Main Door on left */}
          <rect x="25" y="40" width="130" height="240" rx="8" fill="#B45309" stroke="#382B24" strokeWidth="3.5" />
          <circle cx="140" cy="160" r="6" fill="#FDE047" stroke="#382B24" strokeWidth="2" />

          {/* Jorge in doorway dropping his keys in pure joy */}
          <g className="cursor-pointer" onClick={() => handleCharClick('jorge')}>
            <path d="M120 380 L130 230 C130 190 200 190 200 230 L210 380 Z" fill="#10B981" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="165" cy="165" r="34" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="152" cy="162" r="4.5" fill="#382B24" />
            <circle cx="178" cy="162" r="4.5" fill="#382B24" />
            <path d="M152 178 C152 196 178 196 178 178 Z" fill="#FFFFFF" stroke="#382B24" strokeWidth="2.5" />
            {/* Keys bouncing on floor */}
            <circle cx="220" cy="340" r="5" fill="#FBBF24" stroke="#382B24" strokeWidth="2" />
            <text x="240" y="345" fontSize="12" fontWeight="bold" fill="#B45309" fontFamily="Patrick Hand, sans-serif">¡CLINK!</text>
          </g>

          {/* LAISHA (Puppy): Adorable Play-Bow posture in center! */}
          <g className="cursor-pointer transition-transform hover:scale-110" onClick={() => handleCharClick('laisha')}>
            {/* WAGGING TAIL with microanimation */}
            <g className="animate-tail-wag" style={{ transformOrigin: '430px 240px' }}>
              <path d="M430 240 Q475 200 480 180" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              <path d="M430 240 Q475 200 480 180" stroke="#382B24" strokeWidth="3" fill="none" />
            </g>

            {/* Rear up */}
            <ellipse cx="400" cy="250" rx="40" ry="32" fill="#475569" stroke="#382B24" strokeWidth="3" />
            {/* Front chest down */}
            <ellipse cx="325" cy="280" rx="34" ry="26" fill="#64748B" stroke="#382B24" strokeWidth="3" />
            {/* Paws stretched forward */}
            <path d="M310 290 L270 330" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
            <path d="M310 290 L270 330" stroke="#382B24" strokeWidth="2.5" fill="none" />
            <path d="M330 290 L290 335" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
            <path d="M330 290 L290 335" stroke="#382B24" strokeWidth="2.5" fill="none" />

            {/* Head facing up at Jorge with bright happy eyes */}
            <circle cx="310" cy="240" r="32" fill="#64748B" stroke="#382B24" strokeWidth="3.5" />
            <polygon points="285,225 270,165 305,195" fill="#334155" stroke="#382B24" strokeWidth="2.5" />
            <polygon points="330,225 348,165 315,195" fill="#334155" stroke="#382B24" strokeWidth="2.5" />
            <circle cx="298" cy="238" r="5.5" fill="#382B24" />
            <circle cx="296" cy="235" r="2" fill="#FFFFFF" />
            <circle cx="322" cy="238" r="5.5" fill="#382B24" />
            <circle cx="320" cy="235" r="2" fill="#FFFFFF" />
            {/* Snout with pink collar */}
            <ellipse cx="310" cy="255" rx="12" ry="9" fill="#FDE68A" stroke="#382B24" strokeWidth="2" />
            <path d="M295 268 C305 278 315 278 325 268" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />

            {/* Click me banner */}
            <rect x="260" y="130" width="110" height="26" rx="13" fill="#F59E0B" stroke="#382B24" strokeWidth="2" />
            <text x="315" y="147" fontSize="13" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">
              ¡Toca a Laisha! 🐾
            </text>
          </g>

          {/* Ceci on right smiling warmly */}
          <g className="cursor-pointer" onClick={() => handleCharClick('ceci')}>
            <path d="M510 380 L515 230 C515 190 575 190 575 230 L580 380 Z" fill="#E11D48" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="545" cy="165" r="32" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="535" cy="162" r="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            <circle cx="555" cy="162" r="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2.5" />
            <path d="M536 178 Q545 186 554 178" stroke="#382B24" strokeWidth="2" fill="none" />
          </g>
        </svg>
      );

    // ----------------------------------------------------
    // SCENE 5: El bautizo de una campeona
    // ----------------------------------------------------
    case 'scene-the-naming':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="400" fill="#FFFBEB" />
          {/* Big cozy oval carpet */}
          <ellipse cx="320" cy="310" rx="270" ry="75" fill="#EADBC8" stroke="#382B24" strokeWidth="3.5" />
          <ellipse cx="320" cy="310" rx="230" ry="60" fill="#DBC4A7" stroke="#382B24" strokeWidth="2" strokeDasharray="10 8" />

          {/* Floating gentle glowing hearts */}
          <g className="animate-bounce-soft">
            <path d="M290 145 C290 135 305 135 305 145 C305 155 290 165 290 165 C290 165 275 155 275 145 C275 135 290 135 290 145 Z" fill="#EF4444" stroke="#382B24" strokeWidth="2" />
            <path d="M330 125 C330 117 342 117 342 125 C342 133 330 141 330 141 C330 141 318 133 318 125 C318 117 330 117 330 125 Z" fill="#F43F5E" />
          </g>

          {/* Jorge kneeling on carpet */}
          <g className="cursor-pointer" onClick={() => handleCharClick('jorge')}>
            <path d="M200 330 C200 270 260 270 290 310 L220 350 Z" fill="#1E293B" stroke="#382B24" strokeWidth="3" />
            <path d="M190 330 L210 230 C210 195 270 195 270 230 L280 330 Z" fill="#10B981" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="230" cy="175" r="32" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="225" cy="172" r="3.5" fill="#382B24" />
            <circle cx="242" cy="172" r="3.5" fill="#382B24" />
            <path d="M226 186 Q236 195 246 186" stroke="#382B24" strokeWidth="2.5" fill="none" />
          </g>

          {/* Laisha resting front paws on Jorge's knee */}
          <g className="cursor-pointer transition-transform hover:scale-105" onClick={() => handleCharClick('laisha')}>
            <ellipse cx="360" cy="290" rx="36" ry="42" fill="#475569" stroke="#382B24" strokeWidth="3.5" />
            {/* Paws on knee */}
            <path d="M340 275 L285 300" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
            <path d="M340 275 L285 300" stroke="#382B24" strokeWidth="2.5" fill="none" />

            {/* Head facing Jorge */}
            <circle cx="340" cy="210" r="32" fill="#64748B" stroke="#382B24" strokeWidth="3.5" />
            <polygon points="320,195 315,135 340,170" fill="#334155" stroke="#382B24" strokeWidth="2.5" />
            <polygon points="355,195 365,135 345,170" fill="#334155" stroke="#382B24" strokeWidth="2.5" />
            <circle cx="330" cy="206" r="5" fill="#382B24" />
            <circle cx="328" cy="204" r="1.8" fill="#FFFFFF" />
            {/* Pink Collar */}
            <path d="M325 235 C335 244 355 244 365 235" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* Ceci watching happily */}
          <g className="cursor-pointer" onClick={() => handleCharClick('ceci')}>
            <circle cx="500" cy="205" r="30" fill="#FED7AA" stroke="#382B24" strokeWidth="3.5" />
            <circle cx="490" cy="202" r="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2" />
            <circle cx="510" cy="202" r="8" fill="#E0F2FE" fillOpacity="0.4" stroke="#92400E" strokeWidth="2" />
            <path d="M492 218 Q500 225 508 218" stroke="#382B24" strokeWidth="2" fill="none" />
          </g>
        </svg>
      );

    // ----------------------------------------------------
    // SCENE 6: La primera travesura secreta (Cliffhanger)
    // ----------------------------------------------------
    case 'scene-shoe-cliffhanger':
      return (
        <svg viewBox="0 0 640 400" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Night bedroom background */}
          <rect width="640" height="400" fill="#1E293B" />
          {/* Crescent Moon Window */}
          <rect x="50" y="30" width="110" height="130" rx="12" fill="#0F172A" stroke="#382B24" strokeWidth="3" />
          <path d="M75 50 Q105 50 120 80 Q95 110 75 85 Z" fill="#FDE047" />
          <text x="360" y="65" fontSize="18" fill="#94A3B8" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">Zzz...</text>
          <text x="390" y="50" fontSize="22" fill="#CBD5E1" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">Zzz...</text>

          {/* Background bed where Ceci & Jorge are sleeping peacefully */}
          <rect x="300" y="80" width="300" height="120" rx="14" fill="#334155" stroke="#382B24" strokeWidth="3" />
          <circle cx="360" cy="110" r="18" fill="#FED7AA" />
          <circle cx="430" cy="110" r="18" fill="#FED7AA" />

          {/* Bedroom carpet floor */}
          <rect y="210" width="640" height="190" fill="#0F172A" stroke="#382B24" strokeWidth="3" />

          {/* Spot on mischievous Laisha & Ceci's red shoe */}
          <ellipse cx="260" cy="300" rx="200" ry="75" fill="#334155" opacity="0.6" />

          {/* THE RED HIGH-HEEL SHOE! */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => {
              handleCharClick('laisha');
            }}
          >
            <path d="M380 350 L455 350 C470 350 480 330 460 310 L435 290 L415 330 L385 330 Z" fill="#E11D48" stroke="#382B24" strokeWidth="3" />
            <rect x="385" y="330" width="10" height="25" fill="#9F1239" stroke="#382B24" strokeWidth="2.5" />
            <text x="475" y="325" fontSize="15" fontWeight="bold" fill="#EF4444" fontFamily="Patrick Hand, sans-serif">¡CRUNCH!</text>
          </g>

          {/* LAISHA: Stealth mode, tasting the shoe tip with a mischievous wink */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => {
              handleCharClick('laisha');
            }}
          >
            <ellipse cx="230" cy="320" rx="64" ry="38" fill="#475569" stroke="#382B24" strokeWidth="3.5" />
            <polygon points="280,265 295,215 315,250" fill="#1E293B" stroke="#382B24" strokeWidth="2.5" />
            <polygon points="245,265 250,215 275,250" fill="#1E293B" stroke="#382B24" strokeWidth="2.5" />

            {/* Head stretched towards shoe */}
            <circle cx="310" cy="295" r="36" fill="#64748B" stroke="#382B24" strokeWidth="3.5" />
            {/* Left eye big and alert, right eye winking at reader */}
            <circle cx="300" cy="285" r="5.5" fill="#382B24" />
            <circle cx="298" cy="283" r="2" fill="#FFFFFF" />
            <path d="M322 288 Q330 280 338 288" stroke="#382B24" strokeWidth="3.5" strokeLinecap="round" />

            {/* Muzzle around the shoe */}
            <ellipse cx="345" cy="315" rx="16" ry="12" fill="#FDE68A" stroke="#382B24" strokeWidth="2.5" />

            {/* Pink Collar */}
            <path d="M285 325 C295 335 315 335 325 325" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />

            {/* Big friendly prompt button */}
            <rect x="200" y="240" width="140" height="28" rx="14" fill="#EF4444" stroke="#382B24" strokeWidth="2" />
            <text x="270" y="259" fontSize="13" textAnchor="middle" fill="#FFFFFF" fontFamily="Patrick Hand, sans-serif" fontWeight="bold">
              👠 ¡Toca el zapato!
            </text>
          </g>
        </svg>
      );

    default:
      return (
        <div className="w-full h-64 bg-amber-50 flex items-center justify-center storybook-border rounded-2xl">
          <p className="font-comic text-amber-900 text-lg">Escena en preparación...</p>
        </div>
      );
  }
};
