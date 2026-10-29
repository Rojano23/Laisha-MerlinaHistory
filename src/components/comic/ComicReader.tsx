/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ComicEpisode } from '../../types/comic';
import { ComicPanelCard } from './ComicPanelCard';
import { comicSound } from '../../utils/audio';
import {
  loadEpisodeProgress,
  saveEpisodeProgress,
  resetEpisodeProgress,
} from '../../utils/readingState';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Scroll,
  Layers,
  Sparkles,
  Trophy,
  ArrowLeft,
} from 'lucide-react';

interface ComicReaderProps {
  episode: ComicEpisode;
  onBackToCatalog: () => void;
  onSelectCharacter?: (characterId: string) => void;
  startFresh?: boolean;
}

export const ComicReader: React.FC<ComicReaderProps> = ({
  episode,
  onBackToCatalog,
  startFresh = false,
}) => {
  const [readingMode, setReadingMode] = useState<'paged' | 'scroll'>('paged');
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(comicSound.isEnabled());
  const [discoveredThoughts, setDiscoveredThoughts] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  // Canonical restart handler (Idempotent and safe)
  const handleRestart = useCallback(() => {
    const fresh = resetEpisodeProgress(episode.id);
    setCurrentPanelIndex(fresh.panelIndex);
    setDiscoveredThoughts(fresh.discoveredThoughts);
    setIsCompleted(fresh.completed);
    comicSound.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [episode.id]);

  // Load progress or apply fresh start on mount or episode change
  useEffect(() => {
    if (startFresh) {
      handleRestart();
      return;
    }

    const saved = loadEpisodeProgress(episode.id);
    if (saved) {
      // If the episode was previously completed and the reader is opened,
      // start fresh so thoughts are discoverable again!
      if (saved.completed) {
        handleRestart();
      } else {
        const safeIndex =
          saved.panelIndex >= 0 && saved.panelIndex < episode.panels.length
            ? saved.panelIndex
            : 0;
        setCurrentPanelIndex(safeIndex);
        setDiscoveredThoughts(new Set(saved.discoveredThoughts));
        setIsCompleted(false);
      }
    } else {
      // First time opening: all thoughts hidden
      setCurrentPanelIndex(0);
      setDiscoveredThoughts(new Set());
      setIsCompleted(false);
    }
  }, [episode.id, episode.panels.length, startFresh, handleRestart]);

  // Toggle thought: reveals if hidden, re-hides if already revealed
  const handleToggleThought = useCallback(
    (thoughtId: string) => {
      setDiscoveredThoughts((prev) => {
        const next = new Set(prev);
        if (next.has(thoughtId)) {
          next.delete(thoughtId);
        } else {
          next.add(thoughtId);
        }
        saveEpisodeProgress(episode.id, {
          panelIndex: currentPanelIndex,
          discoveredThoughts: next,
          completed: isCompleted,
        });
        return next;
      });
    },
    [episode.id, currentPanelIndex, isCompleted]
  );

  // Reveal thought (adds to discovered set)
  const handleThoughtDiscovered = useCallback(
    (thoughtId: string) => {
      setDiscoveredThoughts((prev) => {
        if (prev.has(thoughtId)) return prev;
        const next = new Set(prev);
        next.add(thoughtId);
        saveEpisodeProgress(episode.id, {
          panelIndex: currentPanelIndex,
          discoveredThoughts: next,
          completed: isCompleted,
        });
        return next;
      });
    },
    [episode.id, currentPanelIndex, isCompleted]
  );

  const handleNextPanel = () => {
    if (currentPanelIndex < episode.panels.length - 1) {
      const nextIdx = currentPanelIndex + 1;
      setCurrentPanelIndex(nextIdx);
      comicSound.playPageTurn();
      saveEpisodeProgress(episode.id, {
        panelIndex: nextIdx,
        discoveredThoughts,
        completed: false,
      });
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      comicSound.playFanfare();
      saveEpisodeProgress(episode.id, {
        panelIndex: currentPanelIndex,
        discoveredThoughts,
        completed: true,
      });
    }
  };

  const handlePrevPanel = () => {
    if (currentPanelIndex > 0) {
      const prevIdx = currentPanelIndex - 1;
      setCurrentPanelIndex(prevIdx);
      comicSound.playPageTurn();
      saveEpisodeProgress(episode.id, {
        panelIndex: prevIdx,
        discoveredThoughts,
        completed: false,
      });
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const newState = comicSound.toggleSound();
    setSoundEnabled(newState);
  };

  const currentPanel = episode.panels[currentPanelIndex] || episode.panels[0];

  return (
    <div className="min-h-screen bg-[#FAF5EB] pb-24">
      {/* Friendly Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF5EB]/95 backdrop-blur-md border-b-3 border-[#382B24] px-3 md:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-200 hover:bg-amber-300 storybook-button text-xs md:text-sm font-black text-[#382B24] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Nuestras historias</span>
          </button>

          {/* Current Scene Indicator */}
          <div className="text-center truncate px-2">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider block">
              Escena {currentPanelIndex + 1} de {episode.panels.length}
            </span>
            <h2 className="font-title font-extrabold text-sm md:text-base text-[#382B24] truncate">
              {episode.title}
            </h2>
          </div>

          {/* Controls: Sound & Restart */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => {
                setReadingMode(readingMode === 'paged' ? 'scroll' : 'paged');
                comicSound.playPop();
              }}
              title="Cambiar vista"
              className="px-2.5 py-2 rounded-2xl bg-white hover:bg-amber-100 storybook-button text-xs font-black text-[#382B24] flex items-center gap-1 cursor-pointer"
            >
              {readingMode === 'paged' ? <Scroll className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {readingMode === 'paged' ? 'Ver todo continuo' : 'Una por una'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Sonidos activados' : 'Sonidos apagados'}
              className={`p-2 rounded-2xl storybook-button cursor-pointer ${
                soundEnabled ? 'bg-amber-300 text-amber-950' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              title="Volver a empezar"
              className="p-2 rounded-2xl bg-white hover:bg-amber-100 storybook-button text-[#382B24] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Yellow Progress Bar */}
        <div className="max-w-4xl mx-auto mt-2">
          <div className="w-full bg-[#E8DFC8] h-2.5 rounded-full overflow-hidden border border-[#382B24]/20">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{
                width: `${
                  readingMode === 'scroll'
                    ? 100
                    : ((currentPanelIndex + 1) / episode.panels.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-6">
        {/* Story Intro Card */}
        <header className="bg-white rounded-3xl storybook-border p-4 md:p-6 mb-8 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-400">
              {episode.releaseBadge}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{discoveredThoughts.size} secretos descubiertos</span>
            </div>
          </div>

          <h1 className="font-title font-black text-2xl md:text-3xl text-[#382B24] mb-2 leading-tight">
            {episode.title}
          </h1>
          <p className="font-comic text-base md:text-lg text-[#5A4839] leading-relaxed">
            {episode.synopsis}
          </p>
        </header>

        {/* Content based on Mode */}
        {readingMode === 'paged' ? (
          <div>
            <ComicPanelCard
              key={currentPanel.id}
              panel={currentPanel}
              totalPanels={episode.panels.length}
              onThoughtDiscovered={handleThoughtDiscovered}
              onToggleThought={handleToggleThought}
              discoveredThoughts={discoveredThoughts}
            />

            {/* Paged Navigation Controls */}
            <div className="flex items-center justify-between gap-3 mt-6 bg-white p-4 rounded-3xl storybook-border shadow-md">
              <button
                onClick={handlePrevPanel}
                disabled={currentPanelIndex === 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm md:text-base cursor-pointer ${
                  currentPanelIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-2 border-slate-300'
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-950 storybook-button'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Escena anterior</span>
              </button>

              <span className="font-title font-black text-sm md:text-base text-[#382B24]">
                {currentPanelIndex + 1} / {episode.panels.length}
              </span>

              <button
                onClick={handleNextPanel}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-base md:text-lg bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button cursor-pointer"
              >
                <span>
                  {currentPanelIndex === episode.panels.length - 1
                    ? '¡Finalizar!'
                    : 'Ver siguiente escena'}
                </span>
                <ChevronRight className="w-5 h-5 text-amber-300" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {episode.panels.map((panel) => (
              <ComicPanelCard
                key={panel.id}
                panel={panel}
                totalPanels={episode.panels.length}
                onThoughtDiscovered={handleThoughtDiscovered}
                onToggleThought={handleToggleThought}
                discoveredThoughts={discoveredThoughts}
              />
            ))}
          </div>
        )}

        {/* Cheerful Ending Box */}
        {(currentPanelIndex === episode.panels.length - 1 || isCompleted || readingMode === 'scroll') && (
          <section className="mt-12 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-100 rounded-3xl storybook-border-lg p-6 md:p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-400 rounded-full storybook-border flex items-center justify-center mx-auto mb-3 animate-bounce-soft">
              <Trophy className="w-8 h-8 text-[#382B24]" />
            </div>

            <span className="font-title font-black text-xs uppercase tracking-widest text-amber-900 bg-amber-300 px-3 py-1 rounded-full border border-amber-500 inline-block mb-2">
              ¡Misión cumplida!
            </span>
            <h3 className="font-title font-black text-2xl md:text-3xl text-[#382B24] mb-2">
              ¡Terminaste de leer este capítulo!
            </h3>
            <p className="font-comic text-base md:text-lg text-[#5A4839] max-w-lg mx-auto mb-6">
              Laisha ya tiene su collar rosa, su familia cariñosa... ¡y ya le dio su primer mordisco al zapato de Ceci!
            </p>

            {/* Next Teaser Card */}
            <div className="bg-white/95 rounded-2xl storybook-border p-4 max-w-md mx-auto text-left mb-6">
              <span className="text-[11px] font-black uppercase text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Próximo capítulo
              </span>
              <h4 className="font-title font-bold text-lg text-[#382B24] mb-1">
                {episode.nextTeaser.title}
              </h4>
              <p className="font-comic text-sm md:text-base text-slate-700">
                {episode.nextTeaser.teaserText}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-3 rounded-2xl font-black text-sm bg-white hover:bg-amber-50 text-[#382B24] storybook-button cursor-pointer"
              >
                Volver a leer
              </button>
              <button
                onClick={onBackToCatalog}
                className="px-6 py-3.5 rounded-2xl font-black text-base bg-[#382B24] text-[#FFFBEB] hover:bg-amber-900 storybook-button cursor-pointer"
              >
                Ver más historias 📚
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
