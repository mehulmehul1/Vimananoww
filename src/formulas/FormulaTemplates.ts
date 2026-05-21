/**
 * Pretext Asset Generator — Formula Templates
 *
 * DUAL ARCHITECTURE:
 *   - Organic formulas (tree, fern, spiral, etc.) return LINE SEGMENTS
 *     Text flows tangent along each branch/segment
 *   - Geometric formulas (triangle, carpet, snowflake) return SHAPE BOUNDS
 *     Text fills interior with proper line wrapping
 */

// ============================================================================
// TYPES
// ============================================================================

export interface FormulaParams {
  [key: string]: number;
}

/** A line segment where text flows */
export interface LineSegment {
  x1: number; y1: number;  // start point
  x2: number; y2: number;  // end point
  angle: number;           // tangent angle
  length: number;
  depth: number;           // for scale variation
}

/** Shape bounds for geometric fill */
export interface ShapeBounds {
  type: 'shape-fill';
  boundsFn: (y: number) => { left: number; right: number } | null;
  segments?: LineSegment[]; // outline segments for red-line visualization
}

/** Formula result: either segments or shape bounds */
export interface SegmentResult {
  type: 'segments';
  segments: LineSegment[];
}

export type FormulaResult = SegmentResult | ShapeBounds;
export type FormulaFn = (text: string, params: FormulaParams, time: number) => FormulaResult;

// ============================================================================
// HELPERS
// ============================================================================

function seg(x1: number, y1: number, x2: number, y2: number, depth: number): LineSegment {
  const dx = x2 - x1, dy = y2 - y1;
  return {
    x1, y1, x2, y2,
    angle: Math.atan2(dy, dx),
    length: Math.sqrt(dx * dx + dy * dy),
    depth,
  };
}

// ============================================================================
// ORGANIC FORMULAS — Line Segments
// ============================================================================

// ============================================================================
// FORMULA: FRACTAL TREE (ref_028)
// ============================================================================
export const fractalTree: FormulaFn = (_text, params, time) => {
  const { rootBranches = 5, depth = 6, angleSpread = 52, branchLength = 90, lengthDecay = 0.68 } = params;
  const segments: LineSegment[] = [];

  const drawBranch = (x: number, y: number, angle: number, len: number, level: number) => {
    if (level <= 0) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    segments.push(seg(x, y, endX, endY, depth - level));

    const nextLen = len * lengthDecay;
    const halfAngle = (angleSpread * Math.PI) / 180 / 2;
    drawBranch(endX, endY, angle - halfAngle, nextLen, level - 1);
    drawBranch(endX, endY, angle + halfAngle, nextLen, level - 1);
  };

  for (let i = 0; i < rootBranches; i++) {
    const angle = (i / rootBranches) * Math.PI * 2 - Math.PI / 2;
    const breathLen = branchLength * (1 + Math.sin(time * 0.5 + i) * 0.05);
    drawBranch(0, 0, angle, breathLen, depth);
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: BARNSLEY FERN (ref_038c)
// ============================================================================
export const fractalFern: FormulaFn = (_text, params, time) => {
  const { stemLength = 120, frondPairs = 6, depth = 5, angleSpread = 0.45, lengthDecay = 0.72 } = params;
  const segments: LineSegment[] = [];

  // Animation: stem sway + frond breathe
  const sway = Math.sin(time * 0.4) * 0.1;
  const breathe = 1 + Math.sin(time * 0.3) * 0.03;

  const drawFrond = (x: number, y: number, angle: number, len: number, level: number) => {
    if (level <= 0) return;
    const endX = x + Math.cos(angle + sway) * len * breathe;
    const endY = y + Math.sin(angle + sway) * len * breathe;
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
    const stemAngle = -Math.PI / 2 + Math.sin(t * Math.PI) * 0.1 + sway;
    const stemLen = (stemLength / frondPairs) * breathe;
    const nextStemX = stemX + Math.cos(stemAngle) * stemLen;
    const nextStemY = stemY + Math.sin(stemAngle) * stemLen;
    segments.push(seg(stemX, stemY, nextStemX, nextStemY, 0));
    drawFrond(nextStemX, nextStemY, stemAngle - angleSpread - 0.2, stemLen * 0.7, depth - 1);
    drawFrond(nextStemX, nextStemY, stemAngle + angleSpread + 0.2, stemLen * 0.7, depth - 1);
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: L-SYSTEM TREE (ref_013a)
// ============================================================================
export const lSystemTree: FormulaFn = (_text, params, time) => {
  const { angle = 25, stepLength = 6, iterations = 5, startAngle = 90 } = params;

  // Animation: wind sway that shifts branch angles over time
  const wind = Math.sin(time * 0.5) * 0.15;

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

  for (const ch of current) {
    switch (ch) {
      case 'F': {
        const newX = x + Math.cos(dir) * stepLength;
        const newY = y + Math.sin(dir) * stepLength;
        segments.push(seg(x, y, newX, newY, currentDepth));
        x = newX;
        y = newY;
        break;
      }
      case '+': dir += angleRad + wind; break;
      case '-': dir -= angleRad - wind; break;
      case '[': stack.push({ x, y, dir, depth: currentDepth }); currentDepth++; break;
      case ']': {
        const s = stack.pop();
        if (s) { x = s.x; y = s.y; dir = s.dir; currentDepth = s.depth; }
        break;
      }
    }
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: DENDRITIC CRYSTAL (ref_038f)
// ============================================================================
export const dendriticCrystal: FormulaFn = (_text, params, time) => {
  const { seedLength = 120, branches = 6, depth = 6, angleSpread = 0.55, lengthDecay = 0.72, symmetry = 6 } = params;
  const segments: LineSegment[] = [];

  // Animation: sway the entire crystal + pulse seed length
  const sway = Math.sin(time * 0.3) * 0.15;
  const breathe = 1 + Math.sin(time * 0.4) * 0.05;

  // Symmetric crystal growth with controlled branching
  const grow = (sx: number, sy: number, angle: number, len: number, d: number) => {
    if (d <= 0 || len < 5) return;
    const endX = sx + Math.cos(angle + sway) * len * breathe;
    const endY = sy + Math.sin(angle + sway) * len * breathe;
    segments.push(seg(sx, sy, endX, endY, depth - d));

    const nextLen = len * lengthDecay;
    // Main continuation
    grow(endX, endY, angle, nextLen, d - 1);
    // Side branches at symmetric angles
    const sideAngle = angleSpread * (1 + (depth - d) * 0.1);
    grow(endX, endY, angle - sideAngle, nextLen * 0.85, d - 1);
    grow(endX, endY, angle + sideAngle, nextLen * 0.85, d - 1);
  };

  // Grow from center with symmetric seeds
  for (let i = 0; i < symmetry; i++) {
    const angle = (i / symmetry) * Math.PI * 2 - Math.PI / 2;
    grow(0, 0, angle, seedLength * breathe, depth);
  }

  // Additional inner seeds for density
  if (branches > symmetry) {
    for (let i = 0; i < branches - symmetry; i++) {
      const angle = (i / (branches - symmetry)) * Math.PI * 2 - Math.PI / 2 + Math.PI / symmetry;
      grow(0, 0, angle, seedLength * 0.7 * breathe, depth - 1);
    }
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: HEXAGONAL FRACTAL (ref_038e/g)
// ============================================================================
export const hexagonalFractal: FormulaFn = (_text, params, time) => {
  const { iterations = 4, size = 200 } = params;
  const segments: LineSegment[] = [];

  // Animation: rotate the entire fractal + pulse scale
  const rotation = time * 0.2;
  const pulse = 1 + Math.sin(time * 0.5) * 0.05;

  const generateArm = (x: number, y: number, angle: number, len: number, depth: number) => {
    if (depth <= 0) return;
    const endX = x + Math.cos(angle + rotation) * len * pulse;
    const endY = y + Math.sin(angle + rotation) * len * pulse;
    segments.push(seg(x, y, endX, endY, iterations - depth));

    const nextLen = len * 0.5;
    generateArm(endX, endY, angle - Math.PI / 3, nextLen, depth - 1);
    generateArm(endX, endY, angle + Math.PI / 3, nextLen, depth - 1);
    generateArm(endX, endY, angle, nextLen * 0.7, depth - 1);
  };

  for (let i = 0; i < 6; i++) {
    generateArm(0, 0, (i / 6) * Math.PI * 2, size / 3, iterations);
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: GOLDEN SPIRAL (ref_017)
// ============================================================================
export const goldenSpiral: FormulaFn = (_text, params, time) => {
  const { turns = 4, growthRate = 0.1759 } = params;
  const segments: LineSegment[] = [];
  const a = 15;

  // Animation: slow rotation + breathe/pulse
  const rotation = time * 0.3;
  const breathe = 1 + Math.sin(time * 0.5) * 0.05;

  const totalPoints = turns * 100;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * turns * Math.PI * 2 + rotation;
    const theta1 = t1 * turns * Math.PI * 2 + rotation;
    const r0 = a * Math.exp(growthRate * theta0) * breathe;
    const r1 = a * Math.exp(growthRate * theta1) * breathe;
    const depth = Math.floor(t0 * turns); // each turn = deeper level
    segments.push(seg(
      r0 * Math.cos(theta0), r0 * Math.sin(theta0),
      r1 * Math.cos(theta1), r1 * Math.sin(theta1),
      depth
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: TEXT CIRCLE
// ============================================================================
export const textCircle: FormulaFn = (_text, params, time) => {
  const { radius = 200 } = params;
  const segments: LineSegment[] = [];
  const points = 120;

  // Animation: slow rotation over time
  const rotation = time * 0.2;

  for (let i = 0; i < points; i++) {
    const t0 = i / points;
    const t1 = (i + 1) / points;
    const angle0 = t0 * Math.PI * 2 + rotation;
    const angle1 = t1 * Math.PI * 2 + rotation;
    segments.push(seg(
      radius * Math.cos(angle0), radius * Math.sin(angle0),
      radius * Math.cos(angle1), radius * Math.sin(angle1),
      0
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: CYMATIC RING (ref_012)
// ============================================================================
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
        Math.sin(waveFreq * 2 * theta0 - time * 1.3) * waveAmp * 0.3 * (r / ringCount);
      const wave1 = Math.sin(waveFreq * theta1 + time) * waveAmp * (r / ringCount) +
        Math.sin(waveFreq * 2 * theta1 - time * 1.3) * waveAmp * 0.3 * (r / ringCount);

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

// ============================================================================
// GEOMETRIC FORMULAS — Shape Filling
// ============================================================================

// ============================================================================
// FORMULA: SIERPINSKI TRIANGLE (ref_038e)
// ============================================================================
export const sierpinskiTriangle: FormulaFn = (_text, params, time) => {
  const { size = 300, iterations = 4 } = params;
  const h = size * Math.sqrt(3) / 2;
  const top = -h * 2 / 3;
  const bottom = h / 3;
  const segments: LineSegment[] = [];

  // Animation: rotate entire shape + pulse scale
  const rotation = time * 0.15;
  const pulse = 1 + Math.sin(time * 0.4) * 0.05;

  // Generate Sierpinski triangle segments recursively
  const drawTriangle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, depth: number) => {
    if (depth <= 0) {
      // Apply rotation and pulse to each segment
      const rax = ax * Math.cos(rotation) - ay * Math.sin(rotation) * pulse;
      const ray = ax * Math.sin(rotation) + ay * Math.cos(rotation) * pulse;
      const rbx = bx * Math.cos(rotation) - by * Math.sin(rotation) * pulse;
      const rby = bx * Math.sin(rotation) + by * Math.cos(rotation) * pulse;
      const rcx = cx * Math.cos(rotation) - cy * Math.sin(rotation) * pulse;
      const rcy = cx * Math.sin(rotation) + cy * Math.cos(rotation) * pulse;
      segments.push(seg(rax, ray, rbx, rby, iterations - depth));
      segments.push(seg(rbx, rby, rcx, rcy, iterations - depth));
      segments.push(seg(rcx, rcy, rax, ray, iterations - depth));
      return;
    }
    const abx = (ax + bx) / 2, aby = (ay + by) / 2;
    const bcx = (bx + cx) / 2, bcy = (by + cy) / 2;
    const cax = (cx + ax) / 2, cay = (cy + ay) / 2;
    drawTriangle(ax, ay, abx, aby, cax, cay, depth - 1);
    drawTriangle(abx, aby, bx, by, bcx, bcy, depth - 1);
    drawTriangle(cax, cay, bcx, bcy, cx, cy, depth - 1);
  };

  // Main triangle vertices
  const ax = 0, ay = top;
  const bx = -size / 2, by = bottom;
  const cx = size / 2, cy = bottom;
  drawTriangle(ax, ay, bx, by, cx, cy, iterations);

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: SIERPINSKI CARPET (ref_038i)
// ============================================================================
export const sierpinskiCarpet: FormulaFn = (_text, params, time) => {
  const { size = 300, iterations = 4 } = params;
  const half = size / 2;
  const segments: LineSegment[] = [];

  // Animation: rotate entire carpet + pulse scale
  const rotation = time * 0.15;
  const pulse = 1 + Math.sin(time * 0.4) * 0.05;

  // Rotate + scale a point
  const transform = (px: number, py: number) => {
    const rx = px * Math.cos(rotation) - py * Math.sin(rotation) * pulse;
    const ry = px * Math.sin(rotation) + py * Math.cos(rotation) * pulse;
    return { x: rx, y: ry };
  };

  // Draw carpet grid lines recursively
  const drawCarpet = (x: number, y: number, s: number, depth: number) => {
    if (depth <= 0) return;
    const third = s / 3;
    // Draw the 8 sub-square outlines
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (row === 1 && col === 1) continue; // Skip center
        const sx = x + col * third;
        const sy = y + row * third;
        const p1 = transform(sx, sy);
        const p2 = transform(sx + third, sy);
        const p3 = transform(sx + third, sy + third);
        const p4 = transform(sx, sy + third);
        segments.push(seg(p1.x, p1.y, p2.x, p2.y, iterations - depth));
        segments.push(seg(p2.x, p2.y, p3.x, p3.y, iterations - depth));
        segments.push(seg(p3.x, p3.y, p4.x, p4.y, iterations - depth));
        segments.push(seg(p4.x, p4.y, p1.x, p1.y, iterations - depth));
        drawCarpet(sx, sy, third, depth - 1);
      }
    }
  };

  drawCarpet(-half, -half, size, iterations);

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: KOCH SNOWFLAKE (ref_038d)
// ============================================================================
export const fractalSnowflake: FormulaFn = (_text, params, time) => {
  const { size = 280, iterations = 4 } = params;
  const segments: LineSegment[] = [];

  // Animation: rotate entire snowflake + pulse scale
  const rotation = time * 0.15;
  const pulse = 1 + Math.sin(time * 0.4) * 0.05;

  // Rotate + scale a point
  const transform = (px: number, py: number) => {
    const rx = px * Math.cos(rotation) - py * Math.sin(rotation) * pulse;
    const ry = px * Math.sin(rotation) + py * Math.cos(rotation) * pulse;
    return { x: rx, y: ry };
  };

  // Koch curve subdivision
  const koch = (ax: number, ay: number, bx: number, by: number, depth: number) => {
    if (depth <= 0) {
      const p1 = transform(ax, ay);
      const p2 = transform(bx, by);
      segments.push(seg(p1.x, p1.y, p2.x, p2.y, iterations - depth));
      return;
    }
    const dx = bx - ax, dy = by - ay;
    const p1x = ax + dx / 3, p1y = ay + dy / 3;
    const p2x = ax + dx * 2 / 3, p2y = ay + dy * 2 / 3;
    // Peak of the equilateral triangle
    const px = (ax + bx) / 2 - dy * Math.sqrt(3) / 6;
    const py = (ay + by) / 2 + dx * Math.sqrt(3) / 6;
    koch(ax, ay, p1x, p1y, depth - 1);
    koch(p1x, p1y, px, py, depth - 1);
    koch(px, py, p2x, p2y, depth - 1);
    koch(p2x, p2y, bx, by, depth - 1);
  };

  // Three sides of the initial equilateral triangle
  const h = size * Math.sqrt(3) / 2;
  const top = -h * 2 / 3;
  const bottom = h / 3;
  const ax = 0, ay = top;
  const bx = -size / 2, by = bottom;
  const cx = size / 2, cy = bottom;
  koch(ax, ay, bx, by, iterations);
  koch(bx, by, cx, cy, iterations);
  koch(cx, cy, ax, ay, iterations);

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: DNA HELIX
// ============================================================================
export const dnaHelix: FormulaFn = (_text, params, time) => {
  const { turns = 6, radius = 80, height = 400, basePairs = 12 } = params;
  const segments: LineSegment[] = [];
  const rotation = time * 0.5; // Animate rotation over time

  const totalPoints = turns * basePairs * 4;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const y0 = -height / 2 + t0 * height;
    const y1 = -height / 2 + t1 * height;
    const theta0 = t0 * turns * Math.PI * 2 + rotation;
    const theta1 = t1 * turns * Math.PI * 2 + rotation;

    // Strand A
    const ax0 = radius * Math.cos(theta0);
    const ax1 = radius * Math.cos(theta1);
    segments.push(seg(ax0, y0, ax1, y1, 0));

    // Strand B (180 degrees out of phase)
    const bx0 = radius * Math.cos(theta0 + Math.PI);
    const bx1 = radius * Math.cos(theta1 + Math.PI);
    segments.push(seg(bx0, y0, bx1, y1, 0));

    // Rungs (base pairs) at regular intervals — text flows on them too
    if (i % 4 === 0) {
      segments.push(seg(ax0, y0, bx0, y0, 1));
    }
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: SUPERFORMULA (GIELIS CURVE) (ref_xxx)
// ============================================================================
export const superformula: FormulaFn = (_text, params, time) => {
  const {
    m = 5,         // rotational symmetry
    n1 = 1,        // shape exponent 1
    n2 = 1,        // shape exponent 2
    n3 = 1,        // shape exponent 3
    a = 1,         // x-radius scaling
    b = 1,         // y-radius scaling
    amplitude = 100,
    morphSpeed = 0.5,  // animation: morph exponents over time
    rotation = 0,
  } = params;

  const segments: LineSegment[] = [];

  // Animation: morph exponents + rotate
  const currentN1 = n1 + Math.sin(time * morphSpeed) * 0.5;
  const currentN2 = n2 + Math.cos(time * morphSpeed * 0.7) * 0.5;
  const currentN3 = n3 + Math.sin(time * morphSpeed * 0.5) * 0.3;
  const rotAngle = time * 0.15;

  const totalPoints = 300;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * Math.PI * 2 + rotAngle;
    const theta1 = t1 * Math.PI * 2 + rotAngle;

    // Superformula: r(θ) = [|cos(mθ/4)/a|^n2 + |sin(mθ/4)/b|^n3]^(-1/n1)
    const mTheta0 = (m * theta0) / 4;
    const mTheta1 = (m * theta1) / 4;
    const base0 = Math.pow(Math.abs(Math.cos(mTheta0)) / a, currentN2) + Math.pow(Math.abs(Math.sin(mTheta0)) / b, currentN3);
    const base1 = Math.pow(Math.abs(Math.cos(mTheta1)) / a, currentN2) + Math.pow(Math.abs(Math.sin(mTheta1)) / b, currentN3);
    const r0 = Math.pow(base0, -1 / currentN1) * amplitude;
    const r1 = Math.pow(base1, -1 / currentN1) * amplitude;

    segments.push(seg(
      r0 * Math.cos(theta0), r0 * Math.sin(theta0),
      r1 * Math.cos(theta1), r1 * Math.sin(theta1),
      Math.floor(t0 * m) // depth increases with symmetry order
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: ROSE CURVE
// ============================================================================
export const roseCurve: FormulaFn = (_text, params, time) => {
  const {
    amplitude = 100,
    k = 3,           // petals: if k odd, k petals; if even, 2k petals
    rotation = 0,
    pulseSpeed = 0.5, // animation: pulse amplitude
  } = params;

  const segments: LineSegment[] = [];

  // Animation: pulse + rotate (more visible)
  const currentAmp = amplitude * (1 + Math.sin(time * pulseSpeed) * 0.15);
  const rotAngle = time * 0.3;

  const totalPoints = 400;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * Math.PI * 2 + rotAngle;
    const theta1 = t1 * Math.PI * 2 + rotAngle;

    // Rose curve: r(θ) = a * cos(kθ) — swap to sin for phase shift
    const r0 = currentAmp * Math.cos(k * theta0);
    const r1 = currentAmp * Math.cos(k * theta1);

    // Animate petal size oscillation
    const pulse0 = 1 + Math.sin(time * 0.4 + i * 0.01) * 0.08;
    const pulse1 = 1 + Math.sin(time * 0.4 + i * 0.01 + 0.5) * 0.08;

    segments.push(seg(
      r0 * Math.cos(theta0) * pulse0, r0 * Math.sin(theta0) * pulse0,
      r1 * Math.cos(theta1) * pulse1, r1 * Math.sin(theta1) * pulse1,
      Math.floor(t0 * k) // depth follows petal count
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: LISSAJOUS CURVE
// ============================================================================
export const lissajousCurve: FormulaFn = (_text, params, time) => {
  const {
    A = 100,         // x amplitude
    B = 100,         // y amplitude
    a = 3,           // x frequency
    b = 2,           // y frequency
    delta = Math.PI / 2, // phase shift
    rotation = 0,
    phaseSpeed = 0.3,  // animation: shift phase over time
  } = params;

  const segments: LineSegment[] = [];

  // Animation: phase shift + rotate
  const currentDelta = delta + Math.sin(time * phaseSpeed) * 0.5;
  const rotAngle = time * 0.1;

  const totalPoints = 500; // More points for complex Lissajous
  const revolutions = 2; // Trace full pattern
  for (let i = 0; i < totalPoints; i++) {
    const t0 = (i / totalPoints) * Math.PI * 2 * revolutions;
    const t1 = ((i + 1) / totalPoints) * Math.PI * 2 * revolutions;

    // Lissajous: x = A*sin(a*t + δ), y = B*sin(b*t)
    const x0 = A * Math.sin(a * t0 + currentDelta);
    const y0 = B * Math.sin(b * t0);
    const x1 = A * Math.sin(a * t1 + currentDelta);
    const y1 = B * Math.sin(b * t1);

    // Apply rotation
    const cosR = Math.cos(rotAngle), sinR = Math.sin(rotAngle);
    const rx0 = x0 * cosR - y0 * sinR, ry0 = x0 * sinR + y0 * cosR;
    const rx1 = x1 * cosR - y1 * sinR, ry1 = x1 * sinR + y1 * cosR;

    segments.push(seg(rx0, ry0, rx1, ry1, Math.floor((i / totalPoints) * 4)));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: WORD CLOUD (from EnvironmentEngine)
// ============================================================================
export const wordCloud: FormulaFn = (_text, params, time) => {
  const { cloudCount = 5, wordCount = 40, radius = 150, spread = 80 } = params;
  const segments: LineSegment[] = [];

  for (let c = 0; c < cloudCount; c++) {
    const cx = Math.cos((c / cloudCount) * Math.PI * 2) * spread;
    const cy = Math.sin((c / cloudCount) * Math.PI * 2) * spread * 0.6;
    const cloudRadius = radius * (0.6 + Math.sin(c * 2.5) * 0.4);
    const phase = c * 1.5 + time * 0.3;

    // Create elliptical word orbits
    for (let w = 0; w < wordCount; w++) {
      const t0 = w / wordCount;
      const t1 = (w + 1) / wordCount;
      const angle0 = t0 * Math.PI * 2 + phase;
      const angle1 = t1 * Math.PI * 2 + phase;
      const r0 = cloudRadius * (0.7 + Math.sin(t0 * 6 + c) * 0.3);
      const r1 = cloudRadius * (0.7 + Math.sin(t1 * 6 + c) * 0.3);

      const x0 = cx + r0 * Math.cos(angle0);
      const y0 = cy + r0 * Math.sin(angle0) * 0.6; // Flattened ellipse
      const x1 = cx + r1 * Math.cos(angle1);
      const y1 = cy + r1 * Math.sin(angle1) * 0.6;

      segments.push(seg(x0, y0, x1, y1, Math.floor(w / 8)));
    }
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: SUPERFORMULA (GIELIS CURVE) (ref_xxx)
// ============================================================================
export const superformula: FormulaFn = (_text, params, time) => {
  const {
    m = 5,         // rotational symmetry
    n1 = 1,        // shape exponent 1
    n2 = 1,        // shape exponent 2
    n3 = 1,        // shape exponent 3
    a = 1,         // x-radius scaling
    b = 1,         // y-radius scaling
    amplitude = 100,
    morphSpeed = 0.5,  // animation: morph exponents over time
    rotation = 0,
  } = params;

  const segments: LineSegment[] = [];

  // Animation: morph exponents + rotate
  const currentN1 = n1 + Math.sin(time * morphSpeed) * 0.5;
  const currentN2 = n2 + Math.cos(time * morphSpeed * 0.7) * 0.5;
  const currentN3 = n3 + Math.sin(time * morphSpeed * 0.5) * 0.3;
  const rotAngle = time * 0.15;

  const totalPoints = 300;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * Math.PI * 2 + rotAngle;
    const theta1 = t1 * Math.PI * 2 + rotAngle;

    // Superformula: r(θ) = [|cos(mθ/4)/a|^n2 + |sin(mθ/4)/b|^n3]^(-1/n1)
    const mTheta0 = (m * theta0) / 4;
    const mTheta1 = (m * theta1) / 4;
    const base0 = Math.pow(Math.abs(Math.cos(mTheta0)) / a, currentN2) + Math.pow(Math.abs(Math.sin(mTheta0)) / b, currentN3);
    const base1 = Math.pow(Math.abs(Math.cos(mTheta1)) / a, currentN2) + Math.pow(Math.abs(Math.sin(mTheta1)) / b, currentN3);
    const r0 = Math.pow(base0, -1 / currentN1) * amplitude;
    const r1 = Math.pow(base1, -1 / currentN1) * amplitude;

    segments.push(seg(
      r0 * Math.cos(theta0), r0 * Math.sin(theta0),
      r1 * Math.cos(theta1), r1 * Math.sin(theta1),
      Math.floor(t0 * m) // depth increases with symmetry order
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: ROSE CURVE
// ============================================================================
export const roseCurve: FormulaFn = (_text, params, time) => {
  const {
    amplitude = 100,
    k = 3,           // petals: k if odd, 2k if even
    rotation = 0,
    pulseSpeed = 0.5, // animation: pulse amplitude
  } = params;

  const segments: LineSegment[] = [];

  // Animation: pulse + rotate
  const currentAmp = amplitude * (1 + Math.sin(time * pulseSpeed) * 0.05);
  const rotAngle = time * 0.2;

  const totalPoints = 400;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * Math.PI * 2 + rotAngle;
    const theta1 = t1 * Math.PI * 2 + rotAngle;

    // Rose curve: r(θ) = a * cos(kθ)
    const r0 = currentAmp * Math.cos(k * theta0);
    const r1 = currentAmp * Math.cos(k * theta1);

    segments.push(seg(
      r0 * Math.cos(theta0), r0 * Math.sin(theta0),
      r1 * Math.cos(theta1), r1 * Math.sin(theta1),
      Math.floor(t0 * k) // depth follows petal count
    ));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// FORMULA: LISSAJOUS CURVE
// ============================================================================
export const lissajousCurve: FormulaFn = (_text, params, time) => {
  const {
    A = 100,         // x amplitude
    B = 100,         // y amplitude
    a = 3,           // x frequency
    b = 2,           // y frequency
    delta = Math.PI / 2, // phase shift
    rotation = 0,
    phaseSpeed = 0.3,  // animation: shift phase over time
  } = params;

  const segments: LineSegment[] = [];

  // Animation: phase shift + rotate
  const currentDelta = delta + Math.sin(time * phaseSpeed) * 0.5;
  const rotAngle = time * 0.1;

  const totalPoints = 500; // More points for complex Lissajous
  const revolutions = 2; // Trace full pattern
  for (let i = 0; i < totalPoints; i++) {
    const t0 = (i / totalPoints) * Math.PI * 2 * revolutions;
    const t1 = ((i + 1) / totalPoints) * Math.PI * 2 * revolutions;

    // Lissajous: x = A*sin(a*t + δ), y = B*sin(b*t)
    const x0 = A * Math.sin(a * t0 + currentDelta);
    const y0 = B * Math.sin(b * t0);
    const x1 = A * Math.sin(a * t1 + currentDelta);
    const y1 = B * Math.sin(b * t1);

    // Apply rotation
    const cosR = Math.cos(rotAngle), sinR = Math.sin(rotAngle);
    const rx0 = x0 * cosR - y0 * sinR, ry0 = x0 * sinR + y0 * cosR;
    const rx1 = x1 * cosR - y1 * sinR, ry1 = x1 * sinR + y1 * cosR;

    segments.push(seg(rx0, ry0, rx1, ry1, Math.floor((i / totalPoints) * 4)));
  }

  return { type: 'segments', segments };
};

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

export interface Template {
  name: string;
  description: string;
  defaultParams: FormulaParams;
  formula: FormulaFn;
}

export const TEMPLATES: Template[] = [
  {
    name: 'Fractal Tree',
    description: 'Text flows along recursive branches',
    defaultParams: { rootBranches: 5, depth: 6, angleSpread: 52, branchLength: 90, lengthDecay: 0.68 },
    formula: fractalTree,
  },
  {
    name: 'Barnsley Fern',
    description: 'Text flows along fern fronds',
    defaultParams: { stemLength: 120, frondPairs: 6, depth: 5, angleSpread: 0.45, lengthDecay: 0.72 },
    formula: fractalFern,
  },
  {
    name: 'L-System Tree',
    description: 'Text follows L-system turtle graphics',
    defaultParams: { angle: 25, stepLength: 6, iterations: 5, startAngle: 90 },
    formula: lSystemTree,
  },
  {
    name: 'Dendritic Crystal',
    description: 'Text flows along crystal branches',
    defaultParams: { seedLength: 120, branches: 6, depth: 6, angleSpread: 0.55, lengthDecay: 0.72, symmetry: 6 },
    formula: dendriticCrystal,
  },
  {
    name: 'Hexagonal Fractal',
    description: 'Text follows hexagonal branching',
    defaultParams: { iterations: 4, size: 200 },
    formula: hexagonalFractal,
  },
  {
    name: 'Golden Spiral',
    description: 'Text flows along logarithmic spiral',
    defaultParams: { turns: 4, growthRate: 0.1759 },
    formula: goldenSpiral,
  },
  {
    name: 'Text Circle',
    description: 'Text follows circular path',
    defaultParams: { radius: 200 },
    formula: textCircle,
  },
  {
    name: 'Cymatic Ring',
    description: 'Text flows along wobbly concentric rings',
    defaultParams: { ringCount: 8, waveFreq: 5, waveAmp: 25, modeRadial: 3 },
    formula: cymaticRing,
  },
  {
    name: 'Sierpinski Triangle',
    description: 'Text fills triangular interior',
    defaultParams: { size: 300, iterations: 4 },
    formula: sierpinskiTriangle,
  },
  {
    name: 'Sierpinski Carpet',
    description: 'Text fills carpet pattern',
    defaultParams: { size: 300, iterations: 4 },
    formula: sierpinskiCarpet,
  },
  {
    name: 'Koch Snowflake',
    description: 'Text fills snowflake interior',
    defaultParams: { size: 280, iterations: 4 },
    formula: fractalSnowflake,
  },
  {
    name: 'DNA Helix',
    description: 'Text flows along double helix strands',
    defaultParams: { turns: 6, radius: 80, height: 400, basePairs: 12 },
    formula: dnaHelix,
  },
  {
    name: 'Word Cloud',
    description: 'Text drifts in elliptical word clouds',
    defaultParams: { cloudCount: 5, wordCount: 40, radius: 150, spread: 80 },
    formula: wordCloud,
  },
  {
    name: 'Superformula',
    description: 'Text flows along generalized superellipse (Gielis curve)',
    defaultParams: { m: 5, n1: 1, n2: 1, n3: 1, a: 1, b: 1, amplitude: 100, morphSpeed: 0.5 },
    formula: superformula,
  },
  {
    name: 'Rose Curve',
    description: 'Text flows along rose curve with k petals',
    defaultParams: { amplitude: 100, k: 3, pulseSpeed: 0.5 },
    formula: roseCurve,
  },
  {
    name: 'Lissajous Curve',
    description: 'Text flows along Lissajous parametric curve',
    defaultParams: { A: 100, B: 100, a: 3, b: 2, delta: 1.57, phaseSpeed: 0.3 },
    formula: lissajousCurve,
  },
];
