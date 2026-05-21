/**
 * Language Manager for Vimana Multilingual System
 * 
 * Time-based language cycling. Languages transition smoothly,
 * creating a multilingual journey through the Vimana universe.
 * 
 * Usage:
 *   const langMgr = new LanguageManager(12); // 12 seconds per language
 *   // In your render loop:
 *   const lang = langMgr.update(deltaTime);
 *   const texts = FORMULA_TEXTS[lang];
 */

import { type Language, LANGUAGES } from './textRegistry';

export interface LanguageState {
  /** Current active language */
  current: Language;
  /** Previous language (for crossfade) */
  previous: Language;
  /** Transition progress 0-1 (0 = fully previous, 1 = fully current) */
  transitionProgress: number;
  /** Whether a transition is currently happening */
  isTransitioning: boolean;
}

export class LanguageManager {
  private currentIndex: number = 0;
  private elapsed: number = 0;
  private cycleDuration: number; // seconds per language
  private transitionDuration: number = 1.5; // seconds for crossfade
  private state: LanguageState;

  constructor(cycleDurationSeconds: number = 12) {
    this.cycleDuration = cycleDurationSeconds;
    this.state = {
      current: LANGUAGES[0],
      previous: LANGUAGES[0],
      transitionProgress: 1,
      isTransitioning: false,
    };
  }

  /**
   * Update the language state. Call once per frame.
   * @param dt - delta time in seconds
   * @returns current language code
   */
  update(dt: number): Language {
    this.elapsed += dt;

    if (this.elapsed >= this.cycleDuration) {
      this.elapsed -= this.cycleDuration;
      this.currentIndex = (this.currentIndex + 1) % LANGUAGES.length;
      this.state.previous = this.state.current;
      this.state.current = LANGUAGES[this.currentIndex];
      this.state.transitionProgress = 0;
      this.state.isTransitioning = true;
    }

    if (this.state.isTransitioning) {
      this.state.transitionProgress = Math.min(
        1,
        this.state.transitionProgress + dt / this.transitionDuration,
      );
      if (this.state.transitionProgress >= 1) {
        this.state.isTransitioning = false;
      }
    }

    return this.state.current;
  }

  /** Get the current language state (for crossfade rendering) */
  getState(): LanguageState {
    return this.state;
  }

  /** Force-set a specific language */
  setLanguage(lang: Language): void {
    const idx = LANGUAGES.indexOf(lang);
    if (idx >= 0) {
      this.currentIndex = idx;
      this.state.current = lang;
      this.state.previous = lang;
      this.state.transitionProgress = 1;
      this.state.isTransitioning = false;
      this.elapsed = 0;
    }
  }

  /** Get the cycle duration */
  getCycleDuration(): number {
    return this.cycleDuration;
  }

  /** Set cycle duration (seconds per language) */
  setCycleDuration(seconds: number): void {
    this.cycleDuration = seconds;
  }
}

/**
 * Get the appropriate canvas font string for a given language.
 * Non-Latin scripts need Noto Sans variants for proper rendering.
 */
export function getFontForLanguage(
  lang: Language,
  size: number = 12,
  weight: number = 600,
  baseFont: string = "'Space Grotesk', sans-serif",
): string {
  const scriptFonts: Record<Language, string> = {
    en: `'Space Grotesk', 'Arial Narrow', sans-serif`,
    hi: `'Noto Sans Devanagari', 'Noto Sans', sans-serif`,
    bn: `'Noto Sans Bengali', 'Noto Sans', sans-serif`,
    ur: `'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Noto Sans', sans-serif`,
    ta: `'Noto Sans Tamil', 'Noto Sans', sans-serif`,
  };
  return `${weight} ${size}px ${scriptFonts[lang]}`;
}

/** Returns true if the language is written right-to-left (Urdu). */
export function isRTL(lang: Language): boolean {
  return lang === 'ur';
}

/** Returns 'rtl' or 'ltr' for use in HTML dir attributes or ctx.direction. */
export function textDirection(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ur' ? 'rtl' : 'ltr';
}

/** Get just the CSS font-family string (no size/weight) for canvas layout functions. */
export function getFontFamilyForLanguage(lang: Language): string {
  const families: Record<Language, string> = {
    en: `'Arial Narrow', 'Space Grotesk', sans-serif`,
    hi: `'Noto Sans Devanagari', 'Noto Sans', sans-serif`,
    bn: `'Noto Sans Bengali', 'Noto Sans', sans-serif`,
    ur: `'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Noto Sans', sans-serif`,
    ta: `'Noto Sans Tamil', 'Noto Sans', sans-serif`,
  };
  return families[lang];
}

/**
 * Get the appropriate CSS font-family for a given language.
 * For DOM rendering (not canvas).
 */
export function getCSSFontFamily(lang: Language): string {
  const families: Record<Language, string> = {
    en: `'Space Grotesk', 'Arial Narrow', sans-serif`,
    hi: `'Noto Sans Devanagari', 'Noto Sans', sans-serif`,
    bn: `'Noto Sans Bengali', 'Noto Sans', sans-serif`,
    ur: `'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Noto Sans', sans-serif`,
    ta: `'Noto Sans Tamil', 'Noto Sans', sans-serif`,
  };
  return families[lang];
}

/**
 * Interpolate between two text strings for crossfade.
 * Returns the text that should be displayed based on transition progress.
 * At progress < 0.5 shows previous, at >= 0.5 shows current.
 */
export function crossfadeText(
  previous: string,
  current: string,
  progress: number,
): string {
  return progress < 0.5 ? previous : current;
}

/**
 * Get crossfade opacity for the current language text.
 * Returns [previousOpacity, currentOpacity] for dual-layer rendering.
 */
export function getCrossfadeOpacities(progress: number): [number, number] {
  if (progress >= 1) return [0, 1];
  if (progress <= 0) return [1, 0];
  // Smooth ease-in-out crossfade
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  return [1 - eased, eased];
}
