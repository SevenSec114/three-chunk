import * as THREE from 'three';
import { Chunk, CHUNK_WIDTH, CHUNK_HEIGHT, CHUNK_DEPTH } from './chunk';

export class World {
  private scene: THREE.Scene;
  private chunks = new Map<string, Chunk>();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    // Don't generate mesh on initial creation, wait for explicit call
    const chunk = new Chunk(this.scene, new THREE.Vector3(0, 0, 0));
    this.chunks.set('0, 0, 0', chunk);
  }

  public setBlock(worldX: number, worldY: number, worldZ: number, blockId: number, options?: Record<string, string>) {
    const chunkX = Math.floor(worldX / CHUNK_WIDTH);
    const chunkY = Math.floor(worldY / CHUNK_HEIGHT);
    const chunkZ = Math.floor(worldZ / CHUNK_DEPTH);

    const chunk = this.chunks.get(`${chunkX}, ${chunkY}, ${chunkZ}`);
    if (!chunk) {
      return; // Chunk not found
    }

    // Robust modulo calculation for local coordinates
    const localX = ((worldX % CHUNK_WIDTH) + CHUNK_WIDTH) % CHUNK_WIDTH;
    const localY = ((worldY % CHUNK_HEIGHT) + CHUNK_HEIGHT) % CHUNK_HEIGHT;
    const localZ = ((worldZ % CHUNK_DEPTH) + CHUNK_DEPTH) % CHUNK_DEPTH;

    chunk.setBlock(localX, localY, localZ, blockId, options);
  }

  public regenerate() {
    for (const chunk of this.chunks.values()) {
      chunk.generateMesh();
    }
  }

  public toggleWireframe(value: boolean) {
    for (const chunk of this.chunks.values()) {
      chunk.toggleWireframe(value);
    }
  }

  // This method is no longer needed as we will call regenerate() from main
  // private generate() {}
}
