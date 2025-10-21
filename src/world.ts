import * as THREE from 'three';
import { Chunk, CHUNK_WIDTH, CHUNK_HEIGHT, CHUNK_DEPTH } from './chunk';
import { Block } from './blocks/block';

export class World {
  private scene: THREE.Scene;
  private chunks = new Map<string, Chunk>();
  private showChunkBounds = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Get block at world position
   * 
   * @param worldX 
   * @param worldY 
   * @param worldZ 
   * @returns 
   */
  public getBlock(worldX: number, worldY: number, worldZ: number): { block: Block | null, options?: Record<string, any> } {
    const chunkX = Math.floor(worldX / CHUNK_WIDTH);
    const chunkY = Math.floor(worldY / CHUNK_HEIGHT);
    const chunkZ = Math.floor(worldZ / CHUNK_DEPTH);

    const chunk = this.chunks.get(`${chunkX}, ${chunkY}, ${chunkZ}`);
    if (!chunk) {
      return { block: null };
    }

    const localX = ((worldX % CHUNK_WIDTH) + CHUNK_WIDTH) % CHUNK_WIDTH;
    const localY = ((worldY % CHUNK_HEIGHT) + CHUNK_HEIGHT) % CHUNK_HEIGHT;
    const localZ = ((worldZ % CHUNK_DEPTH) + CHUNK_DEPTH) % CHUNK_DEPTH;

    return chunk.getBlock(localX, localY, localZ);
  }

  public setBlock(worldX: number, worldY: number, worldZ: number, blockId: number, options?: Record<string, any>) {
    const chunkX = Math.floor(worldX / CHUNK_WIDTH);
    const chunkY = Math.floor(worldY / CHUNK_HEIGHT);
    const chunkZ = Math.floor(worldZ / CHUNK_DEPTH);

    // Create chunk if it doesn't exist
    let chunk = this.chunks.get(`${chunkX}, ${chunkY}, ${chunkZ}`);
    if (!chunk) {
      chunk = new Chunk(this, this.scene, new THREE.Vector3(chunkX, chunkY, chunkZ));
      this.chunks.set(`${chunkX}, ${chunkY}, ${chunkZ}`, chunk);
    }

    // Modulo calculation for local coordinates
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

  //#region Debug Utils

  public toggleWireframe(value: boolean) {
    for (const chunk of this.chunks.values()) {
      chunk.toggleWireframe(value);
    }
  }

  public toggleChunkBounds(value: boolean) {
    this.showChunkBounds = value;
    if (!value) {
      for (const chunk of this.chunks.values()) {
        chunk.toggleChunkBounds(false);
      }
    }
  }

  /**
   * Update chunk bounds for camera
   * 
   * @param cameraPosition
   */
  public updateChunkBoundsForCamera(cameraPosition: THREE.Vector3) {
    if (!this.showChunkBounds) return;

    // Calculate camera chunk position
    const camChunkX = Math.floor(cameraPosition.x / CHUNK_WIDTH);
    const camChunkY = Math.floor(cameraPosition.y / CHUNK_HEIGHT);
    const camChunkZ = Math.floor(cameraPosition.z / CHUNK_DEPTH);

    // Show chunks around camera
    for (let x = camChunkX - 1; x <= camChunkX + 1; x++) {
      for (let y = camChunkY - 1; y <= camChunkY + 1; y++) {
        for (let z = camChunkZ - 1; z <= camChunkZ + 1; z++) {
          let chunk = this.chunks.get(`${x}, ${y}, ${z}`);
          if (!chunk) {
            chunk = new Chunk(this, this.scene, new THREE.Vector3(x, y, z));
            this.chunks.set(`${x}, ${y}, ${z}`, chunk);
          }

          chunk.toggleChunkBounds(true);
        }
      }
    }

    // Hide other chunks' bound
    for (const [key, chunk] of this.chunks) {
      const coords = key.split(',').map(coord => parseInt(coord.trim()));
      const chunkX = coords[0];
      const chunkY = coords[1];
      const chunkZ = coords[2];

      // Check if chunk is within range
      const inRange =
        chunkX >= camChunkX - 1 && chunkX <= camChunkX + 1 &&
        chunkY >= camChunkY - 1 && chunkY <= camChunkY + 1 &&
        chunkZ >= camChunkZ - 1 && chunkZ <= camChunkZ + 1;

      if (!inRange) {
        chunk.toggleChunkBounds(false);
      }
    }
  }

  //#endregion
}