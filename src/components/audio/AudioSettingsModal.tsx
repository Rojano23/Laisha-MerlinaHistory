/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { comicSound, AudioSettings } from '../../utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  TreePine,
  Home,
  Check,
  X,
  Sliders,
  Dog,
} from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<AudioSettings>(comicSound.getSettings());

  useEffect(() => {
    const unsubscribe = comicSound.subscribe((newSettings) => {
      setSettings(newSettings);
    });
    return unsubscribe;
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleMaster = () => {
    comicSound.updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleToggleAmbience = () => {
    comicSound.updateSettings({ ambienceEnabled: !settings.ambienceEnabled });
  };

  const handleToggleEffects = () => {
    comicSound.updateSettings({ effectsEnabled: !settings.effectsEnabled });
  };

  const handleVolumePreset = (volume: number) => {
    comicSound.updateSettings({ masterVolume: volume });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFDF9] rounded-3xl storybook-border-lg p-5 sm:p-6 shadow-2xl relative text-[#382B24] animate-pop-thought"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar ajustes de sonido"
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-[#382B24] storybook-border-sm cursor-pointer transition-transform active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b-2 border-[#382B24]/15">
          <div className="p-2.5 rounded-2xl bg-amber-200 storybook-border-sm text-amber-950">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h2 id="audio-modal-title" className="font-title font-black text-2xl text-[#382B24]">
              Ajustes de Sonido
            </h2>
            <p className="font-comic text-sm text-[#5A4839] font-medium">
              Ladridos, risas y la brisa del parque
            </p>
          </div>
        </div>

        {/* Master Sound Switch */}
        <div className="bg-amber-50 rounded-2xl p-4 storybook-border-sm mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${settings.soundEnabled ? 'bg-emerald-200 border-emerald-400 text-emerald-950' : 'bg-slate-200 border-slate-300 text-slate-600'}`}>
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-title font-black text-base block">
                Sonido de la historieta
              </span>
              <span className="font-comic text-xs text-slate-600 font-bold">
                {settings.soundEnabled ? '¡Sonidos activados!' : 'Silencio completo'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleMaster}
            aria-pressed={settings.soundEnabled}
            className={`px-4 py-2 rounded-2xl font-title font-black text-xs uppercase tracking-wider storybook-border-sm cursor-pointer transition-all ${
              settings.soundEnabled
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-slate-300 text-slate-800 hover:bg-slate-400'
            }`}
          >
            {settings.soundEnabled ? 'Escuchar' : 'Silencio'}
          </button>
        </div>

        {/* Controls when sound is enabled */}
        {settings.soundEnabled ? (
          <div className="space-y-4 mb-5">
            {/* Volume Presets */}
            <div>
              <label className="font-title font-black text-xs uppercase tracking-wider text-slate-600 block mb-2">
                Volumen general
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Suave 🔉', val: 0.4 },
                  { label: 'Medio 🔊', val: 0.75 },
                  { label: 'Fuerte 📢', val: 1.0 },
                ].map((preset) => {
                  const isActive = Math.abs(settings.masterVolume - preset.val) < 0.15;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleVolumePreset(preset.val)}
                      className={`py-2 px-1 rounded-xl text-xs font-black storybook-border-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#382B24] text-[#FFFBEB]'
                          : 'bg-white text-slate-700 hover:bg-amber-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Sound Categories */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Nature / Ambience */}
              <button
                onClick={handleToggleAmbience}
                aria-pressed={settings.ambienceEnabled}
                className={`p-3 rounded-2xl text-left storybook-border-sm transition-all cursor-pointer flex flex-col justify-between ${
                  settings.ambienceEnabled
                    ? 'bg-teal-50 border-teal-600 text-teal-950'
                    : 'bg-slate-100 text-slate-500 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <TreePine className="w-5 h-5 text-teal-700" />
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${settings.ambienceEnabled ? 'bg-teal-200 text-teal-900' : 'bg-slate-200'}`}>
                    {settings.ambienceEnabled ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <div>
                  <span className="font-title font-black text-xs block">Ambiente</span>
                  <span className="font-comic text-[11px] text-slate-600">Pájaros y brisa</span>
                </div>
              </button>

              {/* Dog Barks & Effects */}
              <button
                onClick={handleToggleEffects}
                aria-pressed={settings.effectsEnabled}
                className={`p-3 rounded-2xl text-left storybook-border-sm transition-all cursor-pointer flex flex-col justify-between ${
                  settings.effectsEnabled
                    ? 'bg-amber-50 border-amber-600 text-amber-950'
                    : 'bg-slate-100 text-slate-500 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Dog className="w-5 h-5 text-amber-800" />
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${settings.effectsEnabled ? 'bg-amber-200 text-amber-900' : 'bg-slate-200'}`}>
                    {settings.effectsEnabled ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <div>
                  <span className="font-title font-black text-xs block">Ladridos</span>
                  <span className="font-comic text-[11px] text-slate-600">Laisha y Merlina</span>
                </div>
              </button>
            </div>

            {/* Character Bark Audition Buttons */}
            <div className="pt-2 border-t border-slate-100">
              <span className="font-title font-black text-xs uppercase tracking-wider text-slate-600 block mb-2">
                ¡Escucha a las protagonistas!
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => comicSound.playLaishaBark()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs storybook-border-sm cursor-pointer active:scale-95 transition-transform"
                >
                  <span>🐾 Laisha</span>
                  <span className="text-[10px] opacity-75 font-comic">(Doble Guau)</span>
                </button>

                <button
                  type="button"
                  onClick={() => comicSound.playMerlinaBark()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-950 font-black text-xs storybook-border-sm cursor-pointer active:scale-95 transition-transform"
                >
                  <span>🌪️ Merlina</span>
                  <span className="text-[10px] opacity-75 font-comic">(Alegre)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-slate-500 font-comic text-sm">
            <p className="mb-2">El sonido está apagado.</p>
            <p className="text-xs">
              Toca <strong>«Escuchar»</strong> para disfrutar de los ladridos de Laisha y Merlina y los ambientes naturales.
            </p>
          </div>
        )}

        {/* Bottom Accept Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#382B24] text-[#FFFBEB] font-title font-black text-sm uppercase tracking-wider hover:bg-amber-950 storybook-button cursor-pointer"
        >
          ¡Listo!
        </button>
      </div>
    </div>
  );
};
