/**
 * i18n module for Vimana Multilingual System
 */

export { LanguageManager, getFontForLanguage, getCSSFontFamily, crossfadeText, getCrossfadeOpacities, isRTL, textDirection, getFontFamilyForLanguage } from './LanguageManager';
export type { LanguageState } from './LanguageManager';

export {
  LANGUAGES,
  LANGUAGE_LABELS,
  SCENE_TEXTS,
  FORMULA_TEXTS,
  GHOST_WORDS,
  VIMANA_WORD,
  DNA_DEEP_TEXT,
  FLORA_DEEP_TEXT,
  ORNAMENTAL_TEXT,
  UI_TEXTS,
  NARRATIVE_TEXTS,
} from './textRegistry';
export type { Language, SceneTexts } from './textRegistry';
