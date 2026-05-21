Act 1: The Primordial Vibration (MUSIC)
Theme: Immaterial → Material
The Arc: The Void → The First Word → The Elemental Forces.
- Implementation: Scroll-driven + time-based fallback ('b' key). Sticky viewport, scenes advance on scroll or keypress. Tone system transitions background from dark void to light based on bloom value.
- Layout Variants: Two toggleable layouts — "Shell" (default: cinematic 4-sided borders, cyan formula strokes) and "Alt" (no borders, brand palette colors on formulas, editorial overlay with phase watermark + cinematic subtitles).
- The Flow (5 scenes, 26s total):
    1. **Singularity / Phase 00** (3s): A single white dot pulsing in absolute black void. `singularity` formula. Body: "Before light. Before thought. There was frequency."
    2. **The First Ring / Phase 01** (4s): `textCircle` — the word VIMANA repeats around an expanding ring (125→220px radius). Sound becomes wave. Body: "Not a sound. The potential of all sound."
    3. **The Word / Phase 02** (5s): `textCircle` — the ring multiplies into 5 concentric rings, each with VIMANA text at decreasing font sizes (24→13px). The hum names itself. Body: "The hum names itself. VIMANA repeats until the point becomes a ring."
    4. **The Field / Phase 03** (8s): `cymaticRing` → 8 morphing concentric rings with elliptical tilt + 8 orbital dots at different speeds. Rings ripple, bodies orbit. Body: "The circle becomes a field. Rings ripple, bodies orbit."
    5. **The Tree / Phase 04** (6s): `fractalTree` — from cosmic order, life branches outward. Staggered param animation: branches 4→8, spread 50→80, depth 1→6, length 80→110. Body: "From order, branching. From branching, memory."
- Crossfade: Scene 3→4 has a fade-out transition (0.5s) where the morphing ring fades as the fractal tree enters.
- Canvas rendering: All formulas rendered on HTML canvas via `requestAnimationFrame` loop. Field marks (concentric circles + cross marks) rendered behind formulas. Ornamental border with VIMANA✦ symbols on right+bottom edges.
- Alt layout colors: Brand palette (#3f48ef blue, #f93823 red, #c7c0fc purple, #b9eaba green) applied to formula text fill, ring strokes, fractal tree strokes, and orbital dots. Each ring cycles through palette by index.
- Theatre.js integration: Animation parameters controlled via Theatre.js objects (Singularity, Text Circle, Cymatic Ring, Fractal Tree) with `onValuesChange` reactive subscriptions.
- Ending: The fractal tree reaches full depth, then transitions to Act 2 (Weather scene — EnvironmentEngine — not yet implemented in Act1Scene).

Act 2: Biological Manifestation (NATURE)
Theme: Frequency → Form
The Arc: The Pool → The Cell → The Organism → The Biosphere.
- Implementation: Same Act1Scene pattern — Canvas 2D, Theatre.js objects, staggered param animations, scroll/time mode. Skip weather scene. The fractal tree branches dissolve directly into the DNA helix.

- The Flow (proposed):

     1. **THE BLUEPRINT** (~6s): `dnaHelix`
        The fractal tree branches coalesce into a double helix. Text spirals up both strands — the genetic code reading out. `visualOnly` rungs give the classic helix appearance without cluttering text.
        Staggered: turns 2→8, radius 60→120, height 200→500. Text starts at bottom, reads upward.
        Theatre object: DNA Helix (x, y, scale, opacity, turns, radius, height, basePairs, progress)

     2. **THE SOUP** (~5s): `slimycreature`
        The helix unwinds into warm organic chaos. Undulating cell-like paths pulse and divide. The "primordial soup" — proto-life in motion. Burnt amber + ochre palette (depart from Act 1's cyan/black).
        Staggered: pathCount 1→8, amplitude 3→0.5 (wild→settled), yRange increases to fill canvas.
        Theatre object: Cellular Soup (x, y, scale, opacity, pathCount, amplitude, frequency, complexity, progress)
        Note: `sortSegments: false` — paths are continuous, not sorted by position.

     3. **THE GARDEN** (~7s): `fractalFern` + `goldenSpiral`
        Ferns unfurl from the soup. Golden spirals echo nautilus shells, fibonacci patterns. The first stable forms of life. Two formulas rendered together — ferns growing from bottom, spiral orbiting like a mathematical undercurrent.
        Staggered (fern): frondPairs 2→8, stemLength 60→160, depth 2→6
        Staggered (spiral): turns 1→5, growthRate 0.1→0.25 (spiral tightens as it grows)
        Theatre objects: Fern (x, y, scale, opacity, frondPairs, stemLength, depth, angleSpread, lengthDecay) + Golden Spiral (turns, growthRate)

     4. **THE HIVE** (~6s): `hexagonalFractal` + `dendriticCrystal`
        Two layers — above ground: hexagonal organization (honeycomb, cellular lattices, light tones). Below ground: dendritic root systems, mycelium networks (dark, branching). Organization emerges from chaos. The garden becomes a structure.
        Staggered (hex): iterations 2→5, size 100→300
        Staggered (crystal): branches 3→10, depth 3→7, symmetry 3→8
        Theatre objects: Hive (x, y, scale, opacity, iterations, size) + Roots (seedLength, branches, depth, symmetry, lengthDecay)

     5. **THE SWARM** (~7s): `butterflys` + `symmetryWave`
        Living creatures. Not plants — movement. Butterfly chaotic attractors trace flight paths. Symmetry waves ripple like flocking birds, schooling fish. Each formula produces continuous unsorted paths, perfect for organic motion.
        Staggered (butterfly): concentricRings 1→5, ringSpacing 4→12, animationSpeed 5→25
        Staggered (wave): animationSpeed 10→60, ringOffset 8→24
        Theatre objects: Swarm (concentricRings, ringSpacing, animationSpeed) + Flock (animationSpeed, ringOffset)
        Note: Both use `sortSegments: false`.

     6. **THE NETWORK** (~6s): `lSystemTree`
        The biosphere becomes one organism. L-system branches reach, connect at tips. Text flows along every branch — cross-pollinates where branches meet. The network starts pulsing. One flash — birth of awareness. Bridge to Act 3.
        Staggered: iterations 2→6, angle 15→35, stepLength 3→10
        Theatre object: Network (x, y, scale, opacity, angle, stepLength, iterations, startAngle, progress)
- Ending: The network pulses once. The branches flicker with neural firing patterns. This is the bridge — the biosphere becoming a brain.
Act 3: The Bridge of Consciousness (THE OBSERVER)
Theme: Form $\rightarrow$ Awareness
The Arc: Biological Intelligence $\rightarrow$ Neural Networks $\rightarrow$ The Conscious Mind.
- The Visuals:
    - The Biological Neural: We start with dendriticCrystal and branching patterns that look like neurons firing.
    - The Convergence: The "Left Brain / Right Brain Meeting." 
        - One side is Geometric/Logical (Sierpinski patterns).
        - One side is Organic/Fluid (Golden Spiral / Fractal patterns).
    - The Spark: Where these two meet, a "flash" of awareness happens. The text stops just "flowing" and starts "meaning."
- Ending: The mind is now awake. It realizes it can create its own frequencies.
Act 4: Cultural Synthesis (ART & TECH)
Theme: Awareness $\rightarrow$ Creation
The Arc: Conscious Thought $\rightarrow$ Art/Music/Tech $\rightarrow$ The Vimana (The Vessel).
- The Synthesis: We don't treat Art, Music, and Tech as separate things, but as different frequencies of the same consciousness.
    - The Art Frequency: Sacred geometry and "parallel culture" aesthetics.
    - The Music Frequency: High-order harmonic patterns (Advanced Cymatics).
    - The Tech Frequency: "Post-human design." Machines that look like biology (Mycelium-inspired hardware).
- The Finale: All these frequencies converge to form the Vimana—the ancient/future spaceship. 
- The Closing: The Vimana doesn't just sit there, it flies
---
Summary of the "Bridge" (Act 3)
To answer your question: Yes, we should start with biological intelligence.
We show the "hardware" (neurons/dendrites) first, and then we show the "software" (the meeting of logic and intuition). This makes the transition to "Human Art and Tech" feel earned. It's not just "magic"—it's the result of a billion years of frequency evolution.
Does this "Elemental $\rightarrow$ Biological $\rightarrow$ Neural $\rightarrow$ Cultural" flow feel like the right pace for the story?