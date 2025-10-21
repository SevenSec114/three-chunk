import * as THREE from 'three';
import { getBlock } from './blocks/registry';
import { Block } from './blocks/block';
import type { BlockDirection } from './blocks/block';
import { isOccluded } from './culling';
import { DebugMeshGenerator } from './debug-mesh';
import { World } from './world';

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;
export const CHUNK_DEPTH = 16;

interface BlockData {
  id: number;
  options?: Record<string, any>;
}

// Helper function to compute an index into the 1D blocks array
function computeIndex(x: number, y: number, z: number) {
  return y * CHUNK_WIDTH * CHUNK_DEPTH + x * CHUNK_DEPTH + z;
}

export class Chunk {
  private readonly position: THREE.Vector3;
  private scene: THREE.Scene;
  private world: World;
  private blocks: (BlockData | null)[] = new Array(CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH).fill(null);
  private mesh: THREE.Mesh | null = null;
  private wireframeMesh: THREE.LineSegments | null = null;
  private debugMeshGenerator: DebugMeshGenerator;
  private debugMesh: THREE.Mesh | null = null;
  private chunkBoundingBox: THREE.LineSegments | null = null; // 添加chunk边界框

  constructor(world: World, scene: THREE.Scene, position: THREE.Vector3) {
    this.world = world;
    this.position = position;
    this.scene = scene
    this.debugMeshGenerator = new DebugMeshGenerator();
  }

  public setBlock(x: number, y: number, z: number, id: number, options?: Record<string, any>) {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      return; // Out of bounds
    }
    this.blocks[computeIndex(x, y, z)] = { id, options };
  }

  public getBlock(x: number, y: number, z: number): { block: Block | null, options?: Record<string, any> } {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      const worldX = this.position.x * CHUNK_WIDTH + x;
      const worldY = this.position.y * CHUNK_HEIGHT + y;
      const worldZ = this.position.z * CHUNK_DEPTH + z;
      return this.world.getBlock(worldX, worldY, worldZ);
    }
    const blockData = this.blocks[computeIndex(x, y, z)];
    if (!blockData) return { block: null };

    return {
      block: getBlock(blockData.id),
      options: blockData.options
    };
  }

  public generateMesh() {
    // Dispose old geometry if it exists
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    if (this.wireframeMesh) {
      this.scene.remove(this.wireframeMesh);
      this.wireframeMesh.geometry.dispose();
    }
    if (this.debugMesh) {
      this.scene.remove(this.debugMesh);
      this.debugMesh.geometry.dispose();
    }

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let vertexCount = 0;

    const directions: BlockDirection[] = ['PositiveX', 'NegativeX', 'PositiveY', 'NegativeY', 'PositiveZ', 'NegativeZ'];
    const directionVectors = {
      PositiveX: [1, 0, 0], NegativeX: [-1, 0, 0],
      PositiveY: [0, 1, 0], NegativeY: [0, -1, 0],
      PositiveZ: [0, 0, 1], NegativeZ: [0, 0, -1],
    };

    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      for (let x = 0; x < CHUNK_WIDTH; x++) {
        for (let z = 0; z < CHUNK_DEPTH; z++) {
          const { block: currentBlock, options: currentOptions = {} } = this.getBlock(x, y, z);
          if (!currentBlock) continue;

          // Get and add neighbors into options
          const neighbors = {
            'PositiveX': this.getBlock(x + 1, y, z).block,
            'NegativeX': this.getBlock(x - 1, y, z).block,
            'PositiveZ': this.getBlock(x, y, z + 1).block,
            'NegativeZ': this.getBlock(x, y, z - 1).block,
          };
          currentOptions.neighbors = neighbors;

          for (const direction of directions) {
            const currentFaces = currentBlock.getFaceData(direction, currentOptions);
            if (currentFaces.length === 0) continue;

            const neighborPos = [x + directionVectors[direction][0], y + directionVectors[direction][1], z + directionVectors[direction][2]];
            const { block: neighborBlock, options: neighborOptions } = this.getBlock(neighborPos[0], neighborPos[1], neighborPos[2]);

            const opposingFaces = (neighborBlock && neighborBlock.isOpaque)
              ? neighborBlock.getFaceData(direction.includes('Positive') ? direction.replace('Positive', 'Negative') as BlockDirection : direction.replace('Negative', 'Positive') as BlockDirection, neighborOptions)
              : [];

            // Check if face is visible and add indices into current chunk
            for (const faceData of currentFaces) {
              const faceIsVisible = !isOccluded(faceData, opposingFaces, direction);

              if (faceIsVisible) {
                for (const corner of faceData.corners) {
                  positions.push(corner.pos[0] + x, corner.pos[1] + y, corner.pos[2] + z);
                  uvs.push(corner.uv[0], corner.uv[1]);
                  normals.push(directionVectors[direction][0], directionVectors[direction][1], directionVectors[direction][2]);
                }

                indices.push(
                  vertexCount + 0, vertexCount + 1, vertexCount + 2,
                  vertexCount + 2, vertexCount + 1, vertexCount + 3
                );
                vertexCount += 4;
              } else {
                // Invisible faces' vertices will be a debug plane
                this.debugMeshGenerator.addCulledFace(faceData, x, y, z, direction);
              }
            }
          }
        }
      }
    }

    // Build main mesh
    if (vertexCount > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);

      const material = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.copy(this.position).multiplyScalar(CHUNK_WIDTH);
      this.scene.add(this.mesh);

      // Wireframe Mesh
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      this.wireframeMesh = new THREE.LineSegments(edges, lineMaterial);
      this.wireframeMesh.position.copy(this.position).multiplyScalar(CHUNK_WIDTH);
      this.wireframeMesh.visible = false;
      this.scene.add(this.wireframeMesh);
    }
  }

  //#region Debug Utils

  public toggleWireframe(value: boolean) {
    if (this.mesh && this.wireframeMesh) {
      this.mesh.visible = !value;
      this.wireframeMesh.visible = value;
    }

    // Build debug mesh
    if (value) {
      this.debugMesh = this.debugMeshGenerator.buildMesh(this.scene, this.position);
    } else {
      if (this.debugMesh) {
        this.scene.remove(this.debugMesh);
        this.debugMesh.geometry.dispose();
      }
    }
  }

  /**
   * Toggle chunk bounds visibility
   * 
   * @param value Whether to show wireframe
   */
  public toggleChunkBounds(value: boolean) {
    if (value && !this.chunkBoundingBox) {
      const boxGeometry = new THREE.BoxGeometry(CHUNK_WIDTH, CHUNK_HEIGHT, CHUNK_DEPTH);
      const boxMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
      this.chunkBoundingBox = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeometry),
        boxMaterial
      );

      // Set position
      const offset = new THREE.Vector3(CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2, CHUNK_DEPTH / 2);
      this.chunkBoundingBox.position.copy(this.position).multiplyScalar(CHUNK_WIDTH).add(offset);

      this.scene.add(this.chunkBoundingBox);
    } else if (!value && this.chunkBoundingBox) {
      this.scene.remove(this.chunkBoundingBox);
      this.chunkBoundingBox.geometry.dispose();
      this.chunkBoundingBox = null;
    }
  }

  //#endregion
}