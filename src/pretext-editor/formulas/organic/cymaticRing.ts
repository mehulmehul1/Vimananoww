import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const cymaticRing: FormulaFn = (_text, params, time) => {
  const { ringCount = 8, waveAmp = 25, waveFreq = 5 } = params;
  const segments: LineSegment[] = [];

  for (let r = ringCount; r >= 1; r--) {
    const baseR = (r / ringCount) * 250;
    const samples = Math.max(60, Math.floor(baseR * 2));
    const depth = ringCount - r; // outer rings = deeper = smaller text

    for (let i = 0; i < samples; i++) {
      const t0 = i / samples;
      const t1 = (i + 1) / samples;
      const theta0 = t0 * Math.PI * 2;
      const theta1 = t1 * Math.PI * 2;

      const wave0 = Math.sin(waveFreq * theta0 + time) * waveAmp * (r / ringCount) +
        Math.sin(waveFreq * 2 * theta0 + time * 2) * waveAmp * 0.3 * (r / ringCount);
      const wave1 = Math.sin(waveFreq * theta1 + time) * waveAmp * (r / ringCount) +
        Math.sin(waveFreq * 2 * theta1 + time * 2) * waveAmp * 0.3 * (r / ringCount);

      const finalR0 = baseR + wave0;
      const finalR1 = baseR + wave1;

      segments.push(seg(
        finalR0 * Math.cos(theta0), finalR0 * Math.sin(theta0),
        finalR1 * Math.cos(theta1), finalR1 * Math.sin(theta1),
        depth
      ));
    }
  }

  return { type: 'segments', segments };
};



