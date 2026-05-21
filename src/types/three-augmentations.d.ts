import type { Node } from 'three/webgpu';

declare module 'three/tsl' {
  export function attribute(name: string, nodeType: 'vec2'): Node<'vec2'>;
  export function attribute(name: string, nodeType: 'vec3'): Node<'vec3'>;
  export function attribute(name: string, nodeType: 'vec4'): Node<'vec4'>;
  export function attribute(name: string, nodeType: 'float'): Node<'float'>;
}

