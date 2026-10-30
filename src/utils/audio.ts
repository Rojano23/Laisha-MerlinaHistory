/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AmbienceType = 'park' | 'home' | 'patio' | 'quiet';

export interface AudioSettings {
  soundEnabled: boolean;       // Master toggle (default: false for silent start)
  ambienceEnabled: boolean;    // Nature / home background ambience
  effectsEnabled: boolean;     // Dog barks and comic effects
  masterVolume: number;        // 0.0 to 1.0 (default 0.8)
  ambienceVolume: number;      // 0.0 to 1.0 (default 0.35, gentle background)
  effectsVolume: number;       // 0.0 to 1.0 (default 0.85)
}

const STORAGE_KEY = 'laisha_audio_settings_v1';

// Default initial state: SILENT by default as required by browser autoplay policies
const DEFAULT_SETTINGS: AudioSettings = {
  soundEnabled: false,
  ambienceEnabled: true,
  effectsEnabled: true,
  masterVolume: 0.8,
  ambienceVolume: 0.35,
  effectsVolume: 0.85,
};

/**
 * Centralized ComicSoundManager:
 * - Zero external runtime dependencies ($0 budget).
 * - Mixkit verified free sound assets under /audio/ with synthetic Web Audio fallbacks.
 * - Distinct, recognizable barks for Laisha and Merlina.
 * - Gentle ambient loops (park birds, home breeze) with smooth crossfading transitions.
 * - Autoplay-compliant: starts strictly silent until user interaction.
 * - Automatically pauses on tab visibility change to avoid background battery drain.
 */
class ComicSoundManager {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings;
  private listeners: Set<(settings: AudioSettings) => void> = new Set();

  // AudioBuffer cache for instant low-latency playback
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private pendingFetches: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Ambient playback state
  private currentAmbienceType: AmbienceType | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private ambienceGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private isTabHidden = false;

  constructor() {
    this.settings = this.loadSettings();

    if (typeof window !== 'undefined') {
      // Listen to tab visibility changes to pause audio in background
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isTabHidden = true;
          this.suspendAmbienceOnHide();
        } else {
          this.isTabHidden = false;
          this.resumeAmbienceOnShow();
        }
      });
    }
  }

  private loadSettings(): AudioSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Always ensure boolean / numeric types are valid
          soundEnabled: Boolean(parsed.soundEnabled),
          ambienceEnabled: parsed.ambienceEnabled !== undefined ? Boolean(parsed.ambienceEnabled) : true,
          effectsEnabled: parsed.effectsEnabled !== undefined ? Boolean(parsed.effectsEnabled) : true,
          masterVolume: typeof parsed.masterVolume === 'number' ? Math.max(0, Math.min(1, parsed.masterVolume)) : 0.8,
          ambienceVolume: typeof parsed.ambienceVolume === 'number' ? Math.max(0, Math.min(1, parsed.ambienceVolume)) : 0.35,
          effectsVolume: typeof parsed.effectsVolume === 'number' ? Math.max(0, Math.min(1, parsed.effectsVolume)) : 0.85,
        };
      }
    } catch {
      // Fallback to defaults on corrupt storage
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore storage errors
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public isEnabled(): boolean {
    return this.settings.soundEnabled;
  }

  public subscribe(listener: (settings: AudioSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const copy = this.getSettings();
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch {
        // ignore listener errors
      }
    });
  }

  /**
   * Lazily initializes and returns the AudioContext.
   * Suspended until user interaction to comply with browser autoplay restrictions.
   */
  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.settings.masterVolume, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Updates audio preferences and applies immediate gain/playback changes
   */
  public updateSettings(partial: Partial<AudioSettings>): AudioSettings {
    const wasSoundEnabled = this.settings.soundEnabled;
    this.settings = { ...this.settings, ...partial };
    this.saveSettings();

    // Update master gain node in real-time if context exists
    if (this.ctx && this.masterGainNode) {
      const now = this.ctx.currentTime;
      const targetGain = this.settings.soundEnabled ? this.settings.masterVolume : 0;
      this.masterGainNode.gain.cancelScheduledValues(now);
      this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, now);
      this.masterGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.05);
    }

    // Update ambience gain or stop/resume
    if (!this.settings.soundEnabled || !this.settings.ambienceEnabled) {
      this.stopAmbienceImmediate();
    } else if (this.currentAmbienceType && !this.ambienceSource) {
      // Resume current ambience
      this.playAmbience(this.currentAmbienceType);
    } else if (this.ambienceGainNode && this.ctx) {
      const now = this.ctx.currentTime;
      const targetAmb = this.settings.ambienceVolume;
      this.ambienceGainNode.gain.cancelScheduledValues(now);
      this.ambienceGainNode.gain.linearRampToValueAtTime(targetAmb, now + 0.1);
    }

    // If sound was newly enabled by user, play a subtle confirmation pop
    if (!wasSoundEnabled && this.settings.soundEnabled) {
      this.playPop();
    }

    this.notifyListeners();
    return this.getSettings();
  }

  /**
   * Quick toggle master sound on / off
   */
  public toggleSound(): boolean {
    const newState = !this.settings.soundEnabled;
    this.updateSettings({ soundEnabled: newState });
    return newState;
  }

  /**
   * Preload or fetch an audio asset safely from local static files.
   * If network fails or file is corrupt, returns null gracefully without throwing.
   */
  public async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }

    if (this.pendingFetches.has(url)) {
      return this.pendingFetches.get(url)!;
    }

    const fetchPromise = (async () => {
      try {
        const ctx = this.getContext();
        if (!ctx) return null;

        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`[ComicSound] Could not load audio from ${url}: HTTP ${res.status}`);
          return null;
        }

        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[ComicSound] Error decoding audio ${url}:`, err);
        return null;
      } finally {
        this.pendingFetches.delete(url);
      }
    })();

    this.pendingFetches.set(url, fetchPromise);
    return fetchPromise;
  }

  /**
   * Helper to play an AudioBuffer with gain and destination routing
   */
  private playBuffer(
    buffer: AudioBuffer,
    volumeMultiplier = 1.0,
    startTime = 0
  ): AudioBufferSourceNode | null {
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return null;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      const actualGain = this.settings.effectsVolume * volumeMultiplier;
      gain.gain.setValueAtTime(actualGain, ctx.currentTime);

      source.connect(gain);
      gain.connect(this.masterGainNode);

      source.start(startTime);
      return source;
    } catch {
      return null;
    }
  }

  // ==========================================================================
  // CHARACTER VOICES / BARKS
  // ==========================================================================

  /**
   * LAISHA'S DEFINITIVE BARK:
   * "Doble Guau Atento" ('¡Guau! ¡Guau!')
   * Authentic canine recording of an adult female herding dog (Australian Shepherd / Cattle Dog).
   * Warm, noble, rhythmic double bark.
   */
  public async playLaishaBark() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;

    const buffer = await this.loadBuffer('/audio/laisha_bark.mp3');
    if (buffer) {
      this.playBuffer(buffer, 0.95);
    } else {
      // Fallback: double bark at medium-low adult dog frequency
      this.playSyntheticWoof(175, 140, 0.22);
      setTimeout(() => this.playSyntheticWoof(165, 135, 0.25), 260);
    }
  }

  /**
   * Preview audition for Laisha's authentic canine bark candidate options:
   * Option 1: Guau Clásico y Noble (un guau real, cálido y equilibrado)
   * Option 2: Doble Guau Atento (dos ladridos reales rítmicos '¡Guau! ¡Guau!')
   * Option 3: Ladrido Firme y Acogedor (ladrido real con cuerpo y presencia)
   * Option 4: Guau Seco de Estudio (ladrido breve y conciso)
   */
  public async playLaishaOption(option: 1 | 2 | 3 | 4) {
    if (!this.settings.soundEnabled) {
      // Auto-enable sound when explicitly testing options
      this.updateSettings({ soundEnabled: true });
    }

    let audioUrl = '/audio/laisha_opcion1_guau_maternal.mp3';
    if (option === 2) audioUrl = '/audio/laisha_opcion2_doble_guau.mp3';
    if (option === 3) audioUrl = '/audio/laisha_opcion3_ladrido_firme.mp3';
    if (option === 4) audioUrl = '/audio/laisha_opcion4_guau_estudio.mp3';

    const buffer = await this.loadBuffer(audioUrl);
    if (buffer) {
      this.playBuffer(buffer, 0.95);
    } else {
      // Fallback
      this.playSyntheticWoof(180, 150, 0.35);
    }
  }

  /**
   * MERLINA'S CARTOON BARK:
   * Cheerful, bouncy, light cartoon puppy double-bark ("Arf! ... Arf!").
   * Musical, playful, and delightfully friendly for children.
   */
  public async playMerlinaBark() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;

    const buffer = await this.loadBuffer('/audio/merlina_bark.mp3');
    if (buffer) {
      this.playBuffer(buffer, 0.9);
    } else {
      // Fallback: higher pitch bouncy puppy double yip
      this.playSyntheticPuppyDouble();
    }
  }

  /**
   * Centralized, defensive character audio dispatcher.
   * Single authority ensuring:
   * 1. Humans (jorge, ceci, vecino, narrador) NEVER bark under any circumstance.
   * 2. Merlina produces ONLY Merlina sound.
   * 3. Laisha produces ONLY Laisha sound (or chew effect if specified).
   * 4. Unknown characters NEVER bark (default to pop).
   */
  public playCharacterSound(charId: string, soundCue?: string) {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;

    const lowerId = (charId || '').toLowerCase().trim();

    // Human Safety Rule: Humans must NEVER bark, even if story metadata has malformed soundCue
    const isHuman =
      lowerId === 'more' ||
      lowerId === 'rox' ||
      lowerId === 'fox' ||
      lowerId === 'jorge' ||
      lowerId === 'ceci' ||
      lowerId === 'vecino' ||
      lowerId === 'narrador' ||
      lowerId === 'humano';

    if (isHuman) {
      if (soundCue === 'chew') {
        this.playChew();
      } else {
        // Safe comic pop for human interaction
        this.playPop();
      }
      return;
    }

    if (lowerId === 'merlina') {
      this.playMerlinaBark();
      return;
    }

    if (lowerId === 'laisha') {
      if (soundCue === 'chew') {
        this.playChew();
      } else {
        this.playLaishaBark();
      }
      return;
    }

    // Defensive fallback: Non-dog characters default to pop, never dog bark
    this.playPop();
  }

  /**
   * Deprecated generic woof: removed fallback to Laisha to avoid ambiguity.
   * Use playCharacterSound(), playLaishaBark(), or playMerlinaBark().
   */
  public playWoof() {
    console.warn(
      '[ComicSound] playWoof() is deprecated. Use playCharacterSound(), playLaishaBark(), or playMerlinaBark().'
    );
  }

  // ==========================================================================
  // COMIC SOUND EFFECTS (Pop, Boing, PageTurn, Chew, Fanfare)
  // ==========================================================================

  /**
   * Cartoon pop sound for revealing speech & thought balloons
   */
  public async playPop() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;

    const buffer = await this.loadBuffer('/audio/fx_pop.mp3');
    if (buffer) {
      this.playBuffer(buffer, 0.85);
    } else {
      this.playSyntheticPop();
    }
  }

  /**
   * Boing effect for bounces, ball play, and comic surprises
   */
  public async playBoing() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;

    const buffer = await this.loadBuffer('/audio/fx_boing.mp3');
    if (buffer) {
      this.playBuffer(buffer, 0.9);
    } else {
      this.playSyntheticBoing();
    }
  }

  /**
   * Paper page turn sound for moving across panels
   */
  public playPageTurn() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12 * this.settings.effectsVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGainNode);

      noise.start(now);
    } catch {
      // ignore
    }
  }

  /**
   * Shoe nibble / chew sound effect
   */
  public playChew() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(320, now + 0.04);
      osc.frequency.setValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.12 * this.settings.effectsVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  /**
   * Fanfare melody upon completing an episode
   */
  public playFanfare() {
    if (!this.settings.soundEnabled || !this.settings.effectsEnabled) return;
    const ctx = this.getContext();
    const masterGain = this.masterGainNode;
    if (!ctx || !masterGain) return;

    try {
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.16 * this.settings.effectsVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // ==========================================================================
  // CONTEXTUAL AMBIENCE (Park, Home, Patio) WITH SMOOTH CROSSFADING
  // ==========================================================================

  /**
   * Transitions to a contextual environment ambience.
   * If already playing that ambience, maintains playback smoothly.
   * If switching (e.g. from home to park), crossfades gently over 1.2s.
   */
  public async playAmbience(type: AmbienceType) {
    // Interior scenes and quiet mode have NO ambient audio (silence is intentional)
    if (type === 'quiet' || type === 'home') {
      this.stopAmbience();
      this.currentAmbienceType = null;
      return;
    }

    // Only outdoor environments ('park', 'patio') receive ambient sound
    if (type !== 'park' && type !== 'patio') {
      this.stopAmbience();
      this.currentAmbienceType = null;
      return;
    }

    // If already playing this ambience, no-op
    if (this.currentAmbienceType === type && this.ambienceSource) {
      return;
    }

    this.currentAmbienceType = type;

    // If sound is disabled by user, don't start playback, just record current type
    if (!this.settings.soundEnabled || !this.settings.ambienceEnabled || this.isTabHidden) {
      return;
    }

    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    // Outdoor ambience asset strictly
    const audioUrl = '/audio/ambience_park.mp3';

    const buffer = await this.loadBuffer(audioUrl);
    if (!buffer) {
      // In offline / asset-missing mode, keep scene quiet
      return;
    }

    // Check if another call cancelled this type while loading
    if (this.currentAmbienceType !== type) return;

    const now = ctx.currentTime;

    // Crossfade: fade out previous ambience source if active
    const oldSource = this.ambienceSource;
    const oldGain = this.ambienceGainNode;
    if (oldGain && oldSource) {
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
      setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
        } catch {
          // ignore
        }
      }, 1100);
    }

    // Create new ambience source and gain node
    const newSource = ctx.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;

    const newGain = ctx.createGain();
    const targetGain = this.settings.ambienceVolume;
    newGain.gain.setValueAtTime(0.0001, now);
    newGain.gain.linearRampToValueAtTime(targetGain, now + 1.2);

    newSource.connect(newGain);
    newGain.connect(this.masterGainNode);

    newSource.start(now);
    this.ambienceSource = newSource;
    this.ambienceGainNode = newGain;
  }

  /**
   * Smoothly fades out and stops the current ambience
   */
  public stopAmbience(fadeDuration = 0.8) {
    this.currentAmbienceType = null;
    if (!this.ambienceSource || !this.ambienceGainNode || !this.ctx) {
      this.ambienceSource = null;
      this.ambienceGainNode = null;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.ambienceGainNode.gain.cancelScheduledValues(now);
      this.ambienceGainNode.gain.setValueAtTime(this.ambienceGainNode.gain.value, now);
      this.ambienceGainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      const src = this.ambienceSource;
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // ignore
        }
      }, (fadeDuration + 0.1) * 1000);
    } catch {
      // ignore
    } finally {
      this.ambienceSource = null;
      this.ambienceGainNode = null;
    }
  }

  /**
   * Immediate stop without fade (for mute toggle)
   */
  public stopAmbienceImmediate() {
    this.currentAmbienceType = null;
    if (this.ambienceSource) {
      try {
        this.ambienceSource.stop();
        this.ambienceSource.disconnect();
      } catch {
        // ignore
      }
      this.ambienceSource = null;
      this.ambienceGainNode = null;
    }
  }

  public getCurrentAmbience(): AmbienceType | null {
    return this.currentAmbienceType;
  }

  private suspendAmbienceOnHide() {
    this.stopAmbienceImmediate();
  }

  private resumeAmbienceOnShow() {
    if (
      this.settings.soundEnabled &&
      this.settings.ambienceEnabled &&
      this.currentAmbienceType &&
      this.currentAmbienceType !== 'quiet'
    ) {
      const target = this.currentAmbienceType;
      this.currentAmbienceType = null;
      this.playAmbience(target);
    }
  }

  // ==========================================================================
  // SYNTHETIC FALLBACKS (Guarantees zero crashes if files fail to load)
  // ==========================================================================

  private playSyntheticPop() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.18 * this.settings.effectsVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  private playSyntheticBoing() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.36);
      gain.gain.setValueAtTime(0.18 * this.settings.effectsVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGainNode);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // ignore
    }
  }

  private playSyntheticWoof(startFreq: number, endFreq: number, duration: number) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft rounded sine wave with cartoon pitch swoop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.3, now + duration * 0.2);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.85);

      // Cartoon formant resonance for friendly vowel shape
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(520, now);
      filter.Q.setValueAtTime(2.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22 * this.settings.effectsVolume, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch {
      // ignore
    }
  }

  private playSyntheticPuppyDouble() {
    this.playSyntheticWoof(410, 390, 0.13);
    setTimeout(() => {
      this.playSyntheticWoof(460, 430, 0.15);
    }, 150);
  }

  private startSyntheticBreeze() {
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;
    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06 * this.settings.ambienceVolume, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGainNode);

      noise.start();
      this.ambienceSource = noise;
      this.ambienceGainNode = gain;
    } catch {
      // ignore
    }
  }
}

export const comicSound = new ComicSoundManager();

/**
 * Determines whether a given scene setting corresponds to an outdoor environment.
 * Interior scenes or ambiguous locations safely evaluate to false (silence).
 */
export function isOutdoorSetting(setting?: string): boolean {
  if (!setting || typeof setting !== 'string') return false;
  const s = setting.toLowerCase().trim();
  if (!s) return false;

  // Explicit interior keywords that always take precedence
  const interiorKeywords = [
    'cocina',
    'recámara',
    'recamara',
    'sala',
    'tapete',
    'cuarto',
    'cuartito',
    'auto',
    'carro',
    'coche',
    'comedor',
    'baño',
    'bano',
    'pasillo',
    'oficina',
  ];

  if (interiorKeywords.some((k) => s.includes(k))) {
    return false;
  }

  // Explicit outdoor keywords
  const outdoorKeywords = [
    'parque',
    'jardín',
    'jardin',
    'patio exterior',
    'banqueta',
    'calle',
    'campo',
    'playa',
    'bosque',
    'aire libre',
    'pasto',
    'azotea',
  ];

  return outdoorKeywords.some((k) => s.includes(k));
}

/**
 * Resolves the appropriate ambience type for a given scene setting.
 * Interior scenes and unknown scenes resolve strictly to 'quiet' (silence).
 * Only explicitly outdoor scenes resolve to 'park'.
 */
export function resolveSettingAmbience(setting?: string): AmbienceType {
  return isOutdoorSetting(setting) ? 'park' : 'quiet';
}

