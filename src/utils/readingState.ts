/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EpisodeProgressStorage {
  panelIndex: number;
  discoveredThoughts: string[];
  completed: boolean;
  lastUpdated: number;
}

const STORAGE_PREFIX = 'laisha_progress_';

/**
 * Safely loads and parses stored episode progress from localStorage.
 * Handles legacy, partial, null, or corrupted data without throwing errors.
 */
export function loadEpisodeProgress(episodeId: string): EpisodeProgressStorage | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${episodeId}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    // Sanitize and validate fields
    const panelIndex =
      typeof parsed.panelIndex === 'number' && !isNaN(parsed.panelIndex) && parsed.panelIndex >= 0
        ? Math.floor(parsed.panelIndex)
        : 0;

    const discoveredThoughts = Array.isArray(parsed.discoveredThoughts)
      ? parsed.discoveredThoughts.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
      : [];

    const completed = Boolean(parsed.completed);
    const lastUpdated = typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : Date.now();

    return {
      panelIndex,
      discoveredThoughts,
      completed,
      lastUpdated,
    };
  } catch {
    // Corrupted JSON or storage failure fallback
    return null;
  }
}

/**
 * Safely serializes and saves episode progress to localStorage.
 */
export function saveEpisodeProgress(
  episodeId: string,
  progress: {
    panelIndex: number;
    discoveredThoughts: Set<string> | string[];
    completed: boolean;
  }
): EpisodeProgressStorage {
  const normalizedThoughts = Array.from(progress.discoveredThoughts);
  const data: EpisodeProgressStorage = {
    panelIndex: Math.max(0, Math.floor(progress.panelIndex)),
    discoveredThoughts: normalizedThoughts,
    completed: Boolean(progress.completed),
    lastUpdated: Date.now(),
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${episodeId}`, JSON.stringify(data));
    } catch {
      // Storage quota or privacy mode error ignored
    }
  }

  return data;
}

/**
 * Canonical idempotent restart function.
 * Resets the episode to panel 0, empties all discovered thoughts, marks completed as false,
 * and updates localStorage so subsequent reads start completely fresh.
 */
export function resetEpisodeProgress(episodeId: string): {
  panelIndex: number;
  discoveredThoughts: Set<string>;
  completed: boolean;
} {
  const fresh = {
    panelIndex: 0,
    discoveredThoughts: new Set<string>(),
    completed: false,
  };

  saveEpisodeProgress(episodeId, fresh);
  return fresh;
}

/**
 * Determines if an episode should start fresh (e.g. if it was previously completed).
 */
export function shouldStartFresh(episodeId: string): boolean {
  const saved = loadEpisodeProgress(episodeId);
  return !saved || saved.completed === true;
}
