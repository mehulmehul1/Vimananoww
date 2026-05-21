import type { Node } from 'three/webgpu';
import type { Texture } from 'three/webgpu';
import {
	Fn, vec2, vec4, float, sin, cos, pow, length, sqrt, select, lessThan,
	clamp, min, abs, fract, texture, step, smoothstep,
} from 'three/tsl';

/**
 * Cymatic interference pattern for Phase 0 (The Void).
 * Sums five wave sources to create standing wave patterns
 * on a 2D surface, producing the visual effect of cymatic resonance.
 *
 * Wave sources:
 *   Source 0: amplitude=1.0, frequency=2.0, phase=0.0
 *   Source 1: amplitude=0.8, frequency=3.0, phase=1.0
 *   Source 2: amplitude=0.6, frequency=5.0, phase=2.0
 *   Source 3: amplitude=0.4, frequency=7.0, phase=3.0
 *   Source 4: amplitude=0.3, frequency=11.0, phase=4.0
 *
 * @param pos - 3D position node (xy used for radial distance)
 * @param t  - Time in seconds (float node)
 * @returns Displacement float node
 */
export const cymaticDisplacement5 = Fn( ( [ pos, t ]: [ Node<'vec3'>, Node<'float'> ] ) => {

	const dist = length( pos.xy );
	const wave0 = float( 1.0 ).mul( sin( float( 2.0 ).mul( t ).add( dist.mul( float( 0.08 ) ) ) ) );
	const wave1 = float( 0.8 ).mul( sin( float( 3.0 ).mul( t ).add( float( 1.0 ) ).add( dist.mul( float( 0.06 ) ) ) ) );
	const wave2 = float( 0.6 ).mul( sin( float( 5.0 ).mul( t ).add( float( 2.0 ) ).add( dist.mul( float( 0.04 ) ) ) ) );
	const wave3 = float( 0.4 ).mul( sin( float( 7.0 ).mul( t ).add( float( 3.0 ) ).add( dist.mul( float( 0.03 ) ) ) ) );
	const wave4 = float( 0.3 ).mul( sin( float( 11.0 ).mul( t ).add( float( 4.0 ) ).add( dist.mul( float( 0.02 ) ) ) ) );
	return wave0.add( wave1 ).add( wave2 ).add( wave3 ).add( wave4 ).div( float( 3.1 ) );

} );

/**
 * Golden ratio logarithmic spiral for Phase 1 (Growth Filament).
 * Maps a parameter t ∈ [0, 1] to a 2D point on a golden spiral,
 * producing the organic growth pattern seen in nautilus shells and sunflower seeds.
 * NOW WITH MUCH LARGER SCALE to fill the screen.
 *
 * @param t        - Parameter along the spiral [0, 1] (float node)
 * @param centerX  - X center of the spiral (float node)
 * @param centerY  - Y center of the spiral (float node)
 * @param scaleVal - Overall scale multiplier (float node)
 * @param turns    - Number of spiral turns (float node)
 * @returns vec2 position node on the spiral
 */
export const goldenSpiralPointLarge = Fn( ( [ t, centerX, centerY, scaleVal, turns ]: [ Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {

	const phi = float( 1.618033988749895 );
	const theta = t.mul( float( 2 * Math.PI ).mul( turns ) );
	const r = scaleVal.mul( pow( phi, theta.div( float( 2 * Math.PI ) ) ) ).mul( float( 0.08 ) );
	return vec2(
		centerX.add( r.mul( cos( theta ) ) ),
		centerY.add( r.mul( sin( theta ) ) )
	);

} );

/**
 * Bessel function of the first kind, order 0 (J₀).
 * Used for circular membrane vibration in Phase 3 (Ring).
 *
 * @param x - Input value (float node)
 * @returns J₀(x) approximation (float node)
 */
export const besselJ0 = Fn( ( [ x ]: [ Node<'float'> ] ) => {

	const x2 = x.mul( x );
	const x4 = x2.mul( x2 );
	const x6 = x4.mul( x2 );
	const small = float( 1 ).sub( x2.div( float( 4 ) ) )
		.add( x4.div( float( 64 ) ) )
		.sub( x6.div( float( 2304 ) ) );
	const large = float( 0.39894228 ).div( sqrt( x ) ).mul(
		cos( x.sub( float( 0.78539816 ) ) )
	);
	return select( lessThan( x, float( 3 ) ), small, large );

} );

/**
 * Chromatic aberration RGB channel split.
 * Samples R and B channels at offset positions from the center,
 * creating a lens-distortion holographic effect.
 *
 * @param atlasTexture - The font atlas texture
 * @param atlasUV      - Base UV coordinates (vec2 node)
 * @param strength     - Aberration strength (float node)
 * @returns vec4 color with split channels
 */
export const chromaticAberration = Fn( ( [ atlasTexture, atlasUV, strength ]: [ Texture, Node<'vec2'>, Node<'float'> ] ) => {

	const centerDir = atlasUV.sub( vec2( 0.5 ) );
	const offset = centerDir.mul( strength ).mul( float( 0.025 ) );
	const rUV = atlasUV.add( offset );
	const bUV = atlasUV.sub( offset.mul( float( 0.7 ) ) );
	const rSample = texture( atlasTexture, rUV );
	const gSample = texture( atlasTexture, atlasUV );
	const bSample = texture( atlasTexture, bUV );
	return vec4( rSample.r, gSample.g, bSample.b, gSample.a );

} );

/**
 * Vignette edge darkening effect.
 * Darkens the edges of the image based on distance from center.
 *
 * @param color      - Base color (vec4 node)
 * @param uvCoord    - UV coordinates (vec2 node)
 * @param intensity  - Vignette intensity 0-1 (float node)
 * @returns vec4 darkened color
 */
export const vignetteDarken = Fn( ( [ color, uvCoord, intensity ]: [ Node<'vec4'>, Node<'vec2'>, Node<'float'> ] ) => {

	const dist = length( uvCoord.sub( vec2( 0.5 ) ) );
	const mask = clamp( float( 1 ).sub( dist.mul( float( 2.5 ) ).pow( float( 2.0 ) ) ), float( 0 ), float( 1 ) );
	const darken = float( 1 ).sub( intensity ).add( mask.mul( intensity ) );
	return color.mul( darken );

} );

/**
 * Energy pulse glow effect.
 * Multiplies color by a sinusoidal pulse for living light feel.
 *
 * @param color     - Base color (vec4 node)
 * @param t         - Time (float node)
 * @param speed     - Pulse speed (float node)
 * @param intensity - Pulse intensity (float node)
 * @returns vec4 pulsed color
 */
export const energyPulse = Fn( ( [ color, t, speed, intensity ]: [ Node<'vec4'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {

	const pulse = float( 1 ).add( sin( t.mul( speed ) ).mul( float( 0.35 ) ).mul( intensity ) );
	return color.mul( pulse );

} );

/**
 * Procedural film grain for atmospheric texture.
 * Creates ±2% luminance noise using a classic hash-based
 * pseudo-random pattern, giving the void an analog feel.
 *
 * @param uvCoord - UV coordinates (vec2 node)
 * @param t       - Time in seconds for animation (float node)
 * @returns Grain float node in range [−0.02, +0.02]
 */
export const proceduralGrain = Fn( ( [ uvCoord, t ]: [ Node<'vec2'>, Node<'float'> ] ) => {

	const grain = sin(
		uvCoord.x.mul( float( 12.9898 ) )
			.add( uvCoord.y.mul( float( 78.233 ) ) )
			.add( t.mul( float( 2.0 ) ) )
	).mul( float( 43758.5453 ) ).fract();
	return grain.sub( float( 0.5 ) ).mul( float( 0.04 ) );

} );

/**
 * Hex grid pattern for holographic background feel.
 * Returns a hexagonal grid mask value.
 *
 * @param uvCoord - UV coordinates (vec2 node)
 * @param scale   - Grid scale (float node)
 * @returns Float node with hex pattern 0-1
 */
export const hexGridPattern = Fn( ( [ uvCoord, scale ]: [ Node<'vec2'>, Node<'float'> ] ) => {

	const st = uvCoord.mul( scale );
	const q = float( 0.577350269 ).mul( st.x ).add( st.y );
	const r = float( 0.577350269 ).mul( st.x ).sub( st.y );
	const h = float( -0.577350269 ).mul( st.x ).mul( float( 2.0 ) );
	const qf = fract( q );
	const rf = fract( r );
	const hf = fract( h );
	const dist = min( min( abs( qf.sub( 0.5 ) ), abs( rf.sub( 0.5 ) ) ), abs( hf.sub( 0.5 ) ) );
	return float( 1 ).sub( smoothstep( float( 0.0 ), float( 0.15 ), dist ) );

} );

/**
 * Glitch offset for digital artifact effect.
 * Randomly offsets UV coordinates horizontally.
 *
 * @param uvCoord   - UV coordinates (vec2 node)
 * @param t         - Time (float node)
 * @param intensity - Glitch intensity (float node)
 * @returns vec2 offset UV
 */
export const glitchOffset = Fn( ( [ uvCoord, t, intensity ]: [ Node<'vec2'>, Node<'float'>, Node<'float'> ] ) => {

	const noise = sin( uvCoord.y.mul( float( 80.0 ) ).add( t.mul( float( 40.0 ) ) ) ).mul( float( 43758.5453 ) ).fract();
	const trigger = step( float( 0.85 ), noise );
	const offset = trigger.mul( sin( t.mul( float( 150.0 ) ) ).mul( float( 0.04 ) ).mul( intensity ) );
	return vec2( uvCoord.x.add( offset ), uvCoord.y );

} );

/**
 * Slow breathing pulse for Phase 0 cymatic node.
 * Produces a sinusoidal amplitude modifier with a 10-second cycle (0.1 Hz).
 *
 * @param t       - Time in seconds (float node)
 * @param baseAmp - Amplitude of the breathing modulation (float node)
 * @returns Float node oscillating around 1.0
 */
export const breathingPulse = Fn( ( [ t, baseAmp ]: [ Node<'float'>, Node<'float'> ] ) => {

	return float( 1 ).add( baseAmp.mul( sin( t.mul( float( 0.6283 ) ) ) ) );

} );

/**
 * Aurora-like flowing curtain effect for ethereal backgrounds.
 * Uses layered sine waves with vertical stretching.
 *
 * @param pos     - Position (vec2 node)
 * @param t       - Time (float node)
 * @param intensity - Effect intensity (float node)
 * @returns Float node 0-1
 */
export const auroraFlow = Fn( ( [ pos, t, intensity ]: [ Node<'vec2'>, Node<'float'>, Node<'float'> ] ) => {

	const wave1 = sin( pos.x.mul( float( 0.02 ) ).add( t.mul( float( 0.5 ) ) ) );
	const wave2 = sin( pos.y.mul( float( 0.03 ) ).add( t.mul( float( 0.3 ) ) ).add( float( 1.0 ) ) );
	const wave3 = sin( pos.x.mul( float( 0.01 ) ).add( pos.y.mul( float( 0.01 ) ) ).add( t.mul( float( 0.2 ) ) ) );
	return wave1.mul( float( 0.5 ) ).add( wave2.mul( float( 0.3 ) ) ).add( wave3.mul( float( 0.2 ) ) ).mul( intensity ).add( float( 0.5 ) );

} );

/**
 * Azimuthal standing wave displacement for Phase 2 (Lobed Cymatic Pattern).
 * Maps a base ring radius to a lobed pattern with N-fold symmetry,
 * modulated by a Bessel J₀ envelope for physical realism.
 * Includes a secondary harmonic at 2× lobe frequency for organic feel.
 *
 * @param theta     - Angle around the ring (float node)
 * @param baseR     - Base ring radius (float node)
 * @param lobeCount - Number of lobes (float node, animated 2→8)
 * @param amplitude - Lobe amplitude in pixels (float node)
 * @param t         - Time for animation (float node)
 * @returns Displaced radius (float node)
 */
export const lobedDisplacement = Fn( ( [ theta, baseR, lobeCount, amplitude, t ]: [ Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {

	const besselMod = besselJ0( baseR.div( float( 160 ) ).mul( float( 2.4 ) ) );
	const primaryLobe = amplitude.mul( cos( lobeCount.mul( theta ).add( t.mul( float( 0.5 ) ) ) ) ).mul( besselMod );
	const secondaryLobe = amplitude.mul( float( 0.15 ) ).mul( cos( lobeCount.mul( float( 2 ) ).mul( theta ).add( t.mul( float( 0.8 ) ) ) ) );
	return baseR.add( primaryLobe ).add( secondaryLobe );

} );

/**
 * Fragment cluster position for Phase 3 (Cellular Division).
 * Computes position of a character within its fragment's local orbit,
 * placing it at (localOrbitR * cos(localTheta), localOrbitR * sin(localTheta))
 * relative to the fragment center.
 *
 * @param fragmentCenterX - Fragment center X (float node)
 * @param fragmentCenterY - Fragment center Y (float node)
 * @param localOrbitR     - Local orbit radius (float node)
 * @param localTheta      - Local angle (float node)
 * @returns vec2 position within fragment
 */
export const fragmentOrbit = Fn( ( [ fragmentCenterX, fragmentCenterY, localOrbitR, localTheta ]: [ Node<'float'>, Node<'float'>, Node<'float'>, Node<'float'> ] ) => {

	return vec2(
		fragmentCenterX.add( localOrbitR.mul( cos( localTheta ) ) ),
		fragmentCenterY.add( localOrbitR.mul( sin( localTheta ) ) )
	);

} );

/**
 * Concentric ring disk placement for Phase 0 (The Seed).
 * Maps a character index to a position on a Fibonacci-phased concentric ring.
 * Ring 0 is at center; each subsequent ring is spaced by ringSpacing.
 * Golden angle phasing gives organic, non-aligned ring distribution.
 *
 * @param ringIndex   - Which ring (0 = center) (float node)
 * @param angleInRing - Angle within the ring (float node)
 * @param ringSpacing - Distance between rings (float node)
 * @returns vec2 position on disk
 */
export const concentricRingPosition = Fn( ( [ ringIndex, angleInRing, ringSpacing ]: [ Node<'float'>, Node<'float'>, Node<'float'> ] ) => {

	const goldenAngle = float( 2.399963 );
	const angleOffset = ringIndex.mul( goldenAngle );
	const r = ringIndex.mul( ringSpacing );
	const theta = angleInRing.add( angleOffset );
	return vec2(
		r.mul( cos( theta ) ),
		r.mul( sin( theta ) )
	);

} );
