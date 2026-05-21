import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

export const lSystemTree: FormulaFn = (_text, params, _time) => {
  const { angle = 25, stepLength = 6, iterations = 5, startAngle = 90, trunkScale = 0.3 } = params;
  
  // Build L-system string
  let current = 'X';
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const ch of current) {
      if (ch === 'X') next += 'F+[[X]-X]-[-FX[+X]]';
      else if (ch === 'F') next += 'FF';
      else next += ch;
    }
    current = next;
  }

  // Turtle graphics to collect segments
  const segments: LineSegment[] = [];
  let x = 0, y = 0;
  let dir = (startAngle * Math.PI) / 180;
  const angleRad = (angle * Math.PI) / 180;
  const stack: Array<{ x: number; y: number; dir: number; depth: number }> = [];
  let currentDepth = 0;
  let hitFirstBranch = false; // trunk ends at first '['

  for (const ch of current) {
    switch (ch) {
      case 'F': {
        const step = hitFirstBranch ? stepLength : stepLength * trunkScale;
        const newX = x + Math.cos(dir) * step;
        const newY = y + Math.sin(dir) * step;
        segments.push(seg(x, y, newX, newY, currentDepth));
        x = newX;
        y = newY;
        break;
      }
      case '+': dir += angleRad; break;
      case '-': dir -= angleRad; break;
      case '[':
        hitFirstBranch = true;
        stack.push({ x, y, dir, depth: currentDepth });
        currentDepth++;
        break;
      case ']': {
        const s = stack.pop();
        if (s) { x = s.x; y = s.y; dir = s.dir; currentDepth = s.depth; }
        break;
      }
    }
  }

  return { type: 'segments', segments };
};


