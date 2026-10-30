/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterId = 'laisha' | 'merlina' | 'more' | 'rox' | 'vecino' | 'narrador' | 'More' | 'Rox' | 'fox' | 'Fox' | 'ceci' | 'jorge';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  nickname: string; // e.g. "La mamá sabia", "El torbellino feliz"
  species: 'perrita' | 'humano';
  role: string;
  tagline: string;
  themeColor: {
    bg: string;
    border: string;
    accent: string;
    badgeBg: string;
    lightBg: string;
  };
  appearance: {
    collarColor?: string;
    superpower: string; // Distinctive trait in kid terms
    lookDescription: string;
  };
  funFacts: {
    favoriteActivity: string;
    favoriteSnack: string;
    funnyHabit: string;
    favoriteThought: string;
  };
}

export type BalloonType = 'dialogue' | 'thought' | 'shout';

export interface DialogueBubble {
  id: string;
  speakerId: CharacterId;
  speakerName: string;
  text: string;
  type: BalloonType;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-top' | 'center-bottom';
  isSecretThought?: boolean; // Tapping character reveals this thought!
}

export interface ComicInteraction {
  id: string;
  characterId: CharacterId;
  promptLabel: string;
  revealedThought: string;
  soundCue?: 'woof' | 'pop' | 'laugh' | 'gasp' | 'chew' | 'laisha_bark' | 'merlina_bark';
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  title: string;
  setting: string; // e.g. "La sala de la casa", "El jardín y la banqueta", "La recámara"
  sceneSummary: string; // Brief, kid-friendly explanation
  charactersPresent: CharacterId[];
  illustrationSceneId: string;
  narration?: string;
  dialogues: DialogueBubble[];
  interactions: ComicInteraction[];
  funStickers?: {
    text: string;
    position: string;
    color: string;
    rotation: string;
  }[];
}

export interface ComicEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  synopsis: string;
  status: 'available' | 'coming_soon';
  releaseBadge: string;
  charactersInEpisode: CharacterId[];
  panels: ComicPanel[];
  nextTeaser: {
    episodeNumber: number;
    title: string;
    teaserText: string;
  };
}
