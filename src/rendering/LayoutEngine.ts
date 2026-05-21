import { prepareWithSegments, type PreparedTextWithSegments } from '@chenglou/pretext';
import { FONT_STRING, GHOST_WORDS } from './constants';

export interface CharLayout {
  char: string;
  x: number; // center-x position relative to word start
  width: number; // measured width of this character
  cumulativeX: number; // running total from left edge of word
}

export interface WordLayout {
  word: string;
  chars: CharLayout[];
  totalWidth: number;
  prepared: PreparedTextWithSegments;
}

export class PretextLayout {
  private layouts: Map<string, WordLayout> = new Map();

  initialize(words: string[] = []): void {
    // Initialize ghost words + any additional words
    const allWords = new Set([...GHOST_WORDS, ...words]);
    for (const word of allWords) {
      if (this.layouts.has(word)) continue;
      const prepared = prepareWithSegments(word, FONT_STRING);
      const chars = this.computeCharPositions(prepared);
      const totalWidth =
        chars.length > 0
          ? chars[chars.length - 1]!.cumulativeX + chars[chars.length - 1]!.width
          : 0;
      this.layouts.set(word, { word, chars, totalWidth, prepared });
    }
  }

  private computeCharPositions(prepared: PreparedTextWithSegments): CharLayout[] {
    // prepared.segments and prepared.widths are parallel arrays.
    // Each segment may contain 1+ characters (e.g. CJK, emoji).
    // For ASCII words like VIMANA, each segment is exactly 1 character.
    const chars: CharLayout[] = [];
    let cumulativeX = 0;

    for (let i = 0; i < prepared.segments.length; i++) {
      const segment = prepared.segments[i]!;
      const width = prepared.widths[i]!;

      // Uniform split of segment width across its characters
      const charWidth = width / segment.length;

      for (const char of segment) {
        chars.push({
          char,
          x: cumulativeX + charWidth / 2,
          width: charWidth,
          cumulativeX,
        });
        cumulativeX += charWidth;
      }
    }

    return chars;
  }

  getLayout(word: string): WordLayout | undefined {
    return this.layouts.get(word);
  }

  /** Get per-character 3D positions centered at origin (word center = 0) */
  getCenteredPositions(word: string): { x: number; y: number; z: number }[] {
    const layout = this.layouts.get(word);
    if (!layout) return [];
    const halfWidth = layout.totalWidth / 2;
    return layout.chars.map((c) => ({
      x: c.x - halfWidth,
      y: 0,
      z: 0,
    }));
  }

  /** Get total measured width of a word */
  getTotalWidth(word: string): number {
    return this.layouts.get(word)?.totalWidth ?? 0;
  }

  /** Get the character layout at a specific index */
  getChar(word: string, index: number): CharLayout | undefined {
    return this.layouts.get(word)?.chars[index];
  }

  /** Get positions for characters distributed evenly around a ring.
   *  Places each character at a specific angle on the ring,
   *  rotated to follow the ring tangent (perpendicular to radius).
   *
   *  @param word       - The word to place (must be initialized)
   *  @param ringRadius - Radius of the ring in pixels
   *  @param startAngle - Starting angle in radians (default 0 = rightward)
   *  @returns Array of {x, y, rotation} for each character
   */
  getRingPositions(
    word: string,
    ringRadius: number,
    startAngle: number = 0,
  ): { x: number; y: number; rotation: number }[] {
    const layout = this.layouts.get(word);
    if (!layout) return [];

    const count = layout.chars.length;
    const angleStep = (2 * Math.PI) / count;

    return layout.chars.map((_c, i) => {
      const angle = startAngle + i * angleStep;
      return {
        x: ringRadius * Math.cos(angle),
        y: ringRadius * Math.sin(angle),
        // Tangent rotation: perpendicular to the radius vector at this angle
        rotation: angle + Math.PI / 2,
      };
    });
  }

  /** Get positions for characters at lobe peaks of a standing wave.
   *  Distributes characters to the N highest points of a lobed cymatic pattern.
   *  Each character sits at a lobe peak, displaced outward from the base ring
   *  by the lobe amplitude.
   *
   *  @param word           - The word to place (must be initialized)
   *  @param ringRadius     - Base ring radius in pixels
   *  @param lobeCount      - Number of lobes in the standing wave (2..8)
   *  @param lobeAmplitude  - Peak radial displacement in pixels
   *  @param time           - Animation time for slow rotation
   *  @returns Array of {x, y, rotation} for each character
   */
  getLobePeakPositions(
    word: string,
    ringRadius: number,
    lobeCount: number,
    lobeAmplitude: number,
    time: number,
  ): { x: number; y: number; rotation: number }[] {
    const layout = this.layouts.get(word);
    if (!layout) return [];

    const count = layout.chars.length;
    // Distribute characters evenly across lobe peaks.
    // If fewer characters than lobes, skip some lobes; if more, share lobes.
    const angleStep = (2 * Math.PI) / count;

    return layout.chars.map((_c, i) => {
      const angle = i * angleStep + time * 0.2;
      // Radial displacement at lobe peak: cos(lobeCount * angle) = 1 at peaks
      // We place characters at angles that coincide with lobe peaks
      const peakAngle = (2 * Math.PI * (i % lobeCount)) / lobeCount + time * 0.2;
      const finalAngle = i < lobeCount
        ? peakAngle
        : angle; // extra chars follow even distribution
      const radialDisplacement = lobeAmplitude * Math.cos(lobeCount * finalAngle);
      const finalR = ringRadius + radialDisplacement;

      return {
        x: finalR * Math.cos(finalAngle),
        y: finalR * Math.sin(finalAngle),
        rotation: finalAngle + Math.PI / 2,
      };
    });
  }

  /** Prepare the full PROSE text for sequential character placement.
   *  Returns a flat array of every character with its Pretext-measured width.
   *  Used for continuous text flow along cymatic geometry (ring, lobes, etc.)
   */
  private proseChars: { char: string; width: number }[] | null = null;

  prepareProseLayout(text: string): void {
    const prepared = prepareWithSegments(text, FONT_STRING);
    const result: { char: string; width: number }[] = [];
    
    for (let i = 0; i < prepared.segments.length; i++) {
      const segment = prepared.segments[i]!;
      const width = prepared.widths[i]!;
      const charWidth = width / segment.length;
      
      for (const ch of segment) {
        result.push({ char: ch, width: charWidth });
      }
    }
    this.proseChars = result;
  }

  /** Get the flat Pretext-measured character layout for PROSE text */
  getProseChars(): { char: string; width: number }[] {
    return this.proseChars ?? [];
  }

  /** Get total width of the prepared PROSE text */
  getProseTotalWidth(): number {
    if (!this.proseChars) return 0;
    return this.proseChars.reduce((sum, c) => sum + c.width, 0);
  }
}