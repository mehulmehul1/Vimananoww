import type {
  FormulaFn,
  LineSegment,
} from '../types';

import { seg } from '../helpers';

function noise(
  x: number,
  y: number
) {
  return (
    Math.sin(x * 1.4) *
    Math.cos(y * 0.7)
  );
}

export const brushStroke: FormulaFn = (
  _text,
  params,
  time
) => {
  const segments: LineSegment[] = [];

  const bands =
    Math.floor(
      params.streamCount ?? 24
    );

  const amp =
    params.waveAmplitude ?? 140;

  const width =
    params.streamWidth ?? 280;

  const RES = 340;

  // =========================================
  // MULTIPLE FLOW SYSTEMS
  // =========================================

  const systems = [
    {
      ox: -120,
      oy: -260,
      scale: 1,
      strength: 1,
    },
    {
      ox: 140,
      oy: 40,
      scale: 0.9,
      strength: 0.7,
    },
    {
      ox: -40,
      oy: 340,
      scale: 1.2,
      strength: 0.8,
    },
  ];

  for (const sys of systems) {
    for (let b = 0; b < bands; b++) {
      const bn =
        b / (bands - 1);

      const centered =
        bn - 0.5;

      // every band gets independent lifespan
      const start =
        Math.random() * 0.2;

      const end =
        0.65 +
        Math.random() * 0.35;

      let prevX: number | null = null;
      let prevY: number | null = null;

      for (let i = 0; i < RES; i++) {
        const t = i / RES;

        if (t < start || t > end)
          continue;

        // =================================
        // FIELD FLOW
        // =================================

        const flow =
          Math.sin(
            t * Math.PI * 2.2 +
              centered * 0.7
          ) *
          amp *
          sys.scale;

        const drift =
          Math.sin(
            t * 8 +
              centered * 4
          ) *
          80;

        const turbulence =
          noise(
            t * 8,
            centered * 10
          ) * 20;

        // local compression zones
        const compression =
          1 -
          Math.pow(
            Math.abs(
              Math.sin(
                t * Math.PI * 3
              )
            ),
            3
          ) *
            0.85;

        // non-uniform spacing
        const spacing =
          centered *
          width *
          compression;

        // contour distortion
        const contour =
          Math.sin(
            t * 16 +
              centered * 12
          ) *
          6;

        const y =
          -900 +
          t * 1800 +
          sys.oy;

        const x =
          flow +
          drift +
          turbulence +
          spacing +
          contour +
          sys.ox;

        // =================================
        // BREAK CURVES CONSTANTLY
        // =================================

        const breakField =
          Math.sin(
            t * 42 +
              centered * 7
          );

        const shouldBreak =
          breakField > 0.82;

        if (
          prevX !== null &&
          !shouldBreak
        ) {
          segments.push(
            seg(
              prevX,
              prevY!,
              x,
              y,
              Math.abs(centered)
            )
          );
        }

        // =================================
        // CREST MICRO HOOKS
        // =================================

        const crest =
          Math.abs(
            Math.sin(
              t * Math.PI * 6
            )
          );

        if (
          crest > 0.95 &&
          b % 2 === 0
        ) {
          let lx = x;
          let ly = y;

          const loops = 7;

          for (
            let c = 0;
            c < loops;
            c++
          ) {
            const ct =
              c / loops;

            const a =
              ct *
              Math.PI *
              1.4;

            const r =
              (1 - ct) *
              (8 +
                (1 -
                  Math.abs(
                    centered
                  )) *
                  18);

            const nx =
              x +
              Math.cos(a) * r;

            const ny =
              y -
              Math.sin(a) * r;

            segments.push(
              seg(
                lx,
                ly,
                nx,
                ny,
                0
              )
            );

            lx = nx;
            ly = ny;
          }
        }

        prevX = x;
        prevY = y;
      }
    }
  }

  return {
    type: 'segments',
    segments,
  };
};
