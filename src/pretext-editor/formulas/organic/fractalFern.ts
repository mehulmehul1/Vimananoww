import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

export const fractalFern: FormulaFn = (_text, params, _time) => {
  const { stemLength = 120, frondPairs = 6, depth = 5, angleSpread = 0.45, lengthDecay = 0.72 } = params;
  const segments: LineSegment[] = [];

  const drawFrond = (x: number, y: number, angle: number, len: number, level: number) => {
    if (level <= 0) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    segments.push(seg(x, y, endX, endY, depth - level));

    const nextLen = len * lengthDecay;
    drawFrond(endX, endY, angle - angleSpread, nextLen, level - 1);
    drawFrond(endX, endY, angle + angleSpread, nextLen, level - 1);
    drawFrond(endX, endY, angle + angleSpread * 0.15, nextLen * 0.9, level - 1);
  };

  for (let i = 0; i < frondPairs; i++) {
    const t = i / frondPairs;
    const stemX = Math.sin(t * Math.PI) * 15;
    const stemY = -t * stemLength;
    const stemAngle = -Math.PI / 2 + Math.sin(t * Math.PI) * 0.1;
    const stemLen = stemLength / frondPairs;
    const nextStemX = stemX + Math.cos(stemAngle) * stemLen;
    const nextStemY = stemY + Math.sin(stemAngle) * stemLen;
    segments.push(seg(stemX, stemY, nextStemX, nextStemY, 0));
    drawFrond(nextStemX, nextStemY, stemAngle - angleSpread - 0.2, stemLen * 0.7, depth - 1);
    drawFrond(nextStemX, nextStemY, stemAngle + angleSpread + 0.2, stemLen * 0.7, depth - 1);
  }

  return { type: 'segments', segments };
};


