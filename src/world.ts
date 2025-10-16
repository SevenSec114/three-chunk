import * as THREE from 'three';
import { Chunk } from './chunk';

export class World {
  private scene: THREE.Scene;
  private chunks = new Map<string, Chunk>();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.generate();
  }

  public toggleWireframe(value: boolean) {
    for (const chunk of this.chunks.values()) {
      chunk.toggleWireframe(value);
    }
  }

  private generate() {
    // For now, let's just generate a single chunk at the origin
    const chunk = new Chunk(new THREE.Vector3(0, 0, 0));
    
    // Tell the chunk to generate its mesh and add it to the scene
    chunk.generateMesh(this.scene);

    this.chunks.set('0,0,0', chunk);
  }
}
