/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HomeCover } from './components/home/HomeCover';
import { ComicReader } from './components/comic/ComicReader';
import { EpisodeCatalog } from './components/episodes/EpisodeCatalog';
import { CharacterRoster } from './components/characters/CharacterRoster';
import { EPISODES_DATA } from './data/episodes';
import { ComicEpisode, CharacterId } from './types/comic';
import { comicSound } from './utils/audio';
import { shouldStartFresh } from './utils/readingState';
import { scrollToPageTop } from './utils/scroll';
import { AudioSettingsModal } from './components/audio/AudioSettingsModal';
import {
  BookOpen,
  Users,
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'reader' | 'episodes' | 'characters'>('home');
  const [activeEpisode, setActiveEpisode] = useState<ComicEpisode>(EPISODES_DATA[0]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId>('laisha');
  const [soundActive, setSoundActive] = useState<boolean>(comicSound.isEnabled());
  const [readerStartFresh, setReaderStartFresh] = useState<boolean>(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);

  // Sync soundActive reactively with audio manager
  useEffect(() => {
    return comicSound.subscribe((s) => {
      setSoundActive(s.soundEnabled);
    });
  }, []);

  // Guarantee that whenever currentView changes, the viewport scrolls immediately to top
  useEffect(() => {
    scrollToPageTop(false);
  }, [currentView]);

  const handleNavigate = useCallback(
    (view: 'home' | 'reader' | 'episodes' | 'characters', extraAction?: () => void) => {
      comicSound.playPop();
      extraAction?.();
      setCurrentView(view);
      scrollToPageTop(false);
    },
    []
  );

  const handleStartReading = useCallback(
    (episode?: ComicEpisode, options?: { restart?: boolean }) => {
      comicSound.playWoof();
      const targetEpisode = episode || EPISODES_DATA[0];
      setActiveEpisode(targetEpisode);
      const startFresh = options?.restart !== undefined ? options.restart : shouldStartFresh(targetEpisode.id);
      setReaderStartFresh(startFresh);
      setCurrentView('reader');
      scrollToPageTop(false);
    },
    []
  );

  const handleGoToCharacters = useCallback((charId?: string) => {
    comicSound.playPop();
    if (charId) setSelectedCharacterId(charId as CharacterId);
    setCurrentView('characters');
    scrollToPageTop(false);
  }, []);

  const handleSoundToggle = () => {
    const newState = comicSound.toggleSound();
    setSoundActive(newState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB] text-[#382B24]">
      {/* Top Bar for Kids & Families */}
      <header className="sticky top-0 z-40 bg-[#FAF5EB]/95 backdrop-blur-md border-b-3 border-[#382B24] px-4 md:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => handleNavigate('home')}
            className="text-left cursor-pointer group flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Ir al inicio"
          >
            <span className="font-title font-black text-2xl md:text-3xl tracking-tight text-[#382B24] group-hover:text-amber-800 transition-colors">
              Laisha &amp; Merlina
            </span>
            <span className="font-comic text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400 hidden sm:inline">
              Una vida de pelos
            </span>
          </button>

          {/* Zone 2: Navigation Links (Shown on desktop >= 1024px; mobile & tablets use bottom bar) */}
          <nav className="hidden lg:flex items-center gap-6 text-base font-black text-[#382B24]">
            <button
              onClick={() => handleNavigate('home')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'home' ? 'text-amber-800 border-b-3 border-amber-800 pb-0.5' : ''
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => handleStartReading(undefined, { restart: false })}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'reader' ? 'text-amber-800 border-b-3 border-amber-800 pb-0.5' : ''
              }`}
            >
              ¡A leer!
            </button>

            <button
              onClick={() => handleNavigate('episodes')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'episodes' ? 'text-amber-800 border-b-3 border-amber-800 pb-0.5' : ''
              }`}
            >
              Nuestras historias
            </button>

            <button
              onClick={() => handleNavigate('characters')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'characters' ? 'text-amber-800 border-b-3 border-amber-800 pb-0.5' : ''
              }`}
            >
              Conoce a la familia
            </button>
          </nav>

          {/* Zone 3: Sound & Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Controls: Quick Toggle + Settings Modal */}
            <div className="flex items-center bg-amber-200 rounded-2xl storybook-border-sm p-0.5">
              <button
                onClick={handleSoundToggle}
                title={soundActive ? 'Silenciar sonidos' : 'Activar sonidos'}
                aria-label={soundActive ? 'Silenciar sonidos' : 'Activar sonidos'}
                className="p-2 rounded-xl hover:bg-amber-300 text-amber-950 transition-colors cursor-pointer"
              >
                {soundActive ? <Volume2 className="w-5 h-5 text-emerald-900" /> : <VolumeX className="w-5 h-5 text-slate-600" />}
              </button>
              <button
                onClick={() => setIsAudioModalOpen(true)}
                title="Ajustes de sonido"
                aria-label="Abrir ajustes de sonido"
                className="p-2 rounded-xl hover:bg-amber-300 text-amber-950 transition-colors cursor-pointer border-l border-amber-300/80"
              >
                <Sliders className="w-4 h-4 text-amber-900" />
              </button>
            </div>

            <button
              onClick={() => handleStartReading(undefined, { restart: false })}
              className="px-5 py-2.5 text-sm md:text-base font-title font-black text-[#FFFBEB] bg-[#382B24] rounded-2xl hover:bg-amber-900 storybook-button transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              ¡Vamos a leer!
            </button>
          </div>
        </div>
      </header>

      {/* Main View Container with bottom padding on mobile/tablet to clear fixed nav */}
      <div id="main-content-view" className="flex-1 pb-20 lg:pb-6">
        {currentView === 'home' && (
          <HomeCover
            onStartReading={(opts) => handleStartReading(undefined, opts)}
            onGoToEpisodes={() => handleNavigate('episodes')}
            onGoToCharacters={handleGoToCharacters}
          />
        )}

        {currentView === 'reader' && (
          <ComicReader
            key={`${activeEpisode.id}-${readerStartFresh ? 'fresh' : 'continue'}`}
            episode={activeEpisode}
            startFresh={readerStartFresh}
            onBackToCatalog={() => handleNavigate('episodes')}
            onSelectCharacter={handleGoToCharacters}
          />
        )}

        {currentView === 'episodes' && (
          <EpisodeCatalog
            onSelectEpisode={(ep, opts) => handleStartReading(ep, opts)}
            onViewCharacter={handleGoToCharacters}
          />
        )}

        {currentView === 'characters' && (
          <CharacterRoster
            initialCharacterId={selectedCharacterId}
            onStartReading={() => handleStartReading(undefined, { restart: false })}
          />
        )}
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar (Large touch targets >= 48px) */}
      <nav
        aria-label="Navegación principal inferior"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5EB]/95 backdrop-blur-md border-t-3 border-[#382B24] grid grid-cols-4 items-center h-16 sm:h-18 pb-safe shadow-2xl"
      >
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 cursor-pointer transition-colors ${
            currentView === 'home' ? 'text-amber-900 font-black' : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[11px] sm:text-xs font-bold mt-0.5">Inicio</span>
        </button>

        <button
          onClick={() => handleStartReading(undefined, { restart: false })}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 cursor-pointer transition-colors ${
            currentView === 'reader' ? 'text-amber-900 font-black' : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-[11px] sm:text-xs font-bold mt-0.5">¡A leer!</span>
        </button>

        <button
          onClick={() => handleNavigate('episodes')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 cursor-pointer transition-colors ${
            currentView === 'episodes' ? 'text-amber-900 font-black' : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-[11px] sm:text-xs font-bold mt-0.5">Historias</span>
        </button>

        <button
          onClick={() => handleNavigate('characters')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 cursor-pointer transition-colors ${
            currentView === 'characters' ? 'text-amber-900 font-black' : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[11px] sm:text-xs font-bold mt-0.5">Familia</span>
        </button>
      </nav>

      {/* Friendly Storybook Footer */}
      <footer className="mt-auto border-t-3 border-[#382B24]/15 py-6 px-4 pb-24 lg:pb-6 text-center text-xs md:text-sm text-[#4A382D]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-comic font-bold">
            <strong>Laisha &amp; Merlina — Una vida de pelos</strong> 🐾 Una aventura familiar interactiva.
          </p>
          <div className="flex items-center gap-3 font-bold text-xs text-slate-600">
            <span>Para toda la familia</span>
            <span aria-hidden="true">·</span>
            <span>Cero anuncios ni costos</span>
            <span aria-hidden="true">·</span>
            <span>Lectura interactiva</span>
          </div>
        </div>
      </footer>

      {/* Kid-friendly Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
