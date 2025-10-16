import * as THREE from 'three';
import { getBlock } from './blocks/registry';
import { Block } from './blocks/block';
import type { BlockDirection } from './blocks/block';
import type { FaceData } from './face';

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;
export const CHUNK_DEPTH = 16;

// Helper function to compute an index into the 1D blocks array
function computeIndex(x: number, y: number, z: number) {
  return y * CHUNK_WIDTH * CHUNK_DEPTH + x * CHUNK_DEPTH + z;
}

// The analyser function we designed
function isFaceCoveringBoundary(faceData: FaceData, direction: BlockDirection): boolean {
  const { corners } = faceData;
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const corner of corners) {
    min.x = Math.min(min.x, corner.pos[0]);
    max.x = Math.max(max.x, corner.pos[0]);
    min.y = Math.min(min.y, corner.pos[1]);
    max.y = Math.max(max.y, corner.pos[1]);
    min.z = Math.min(min.z, corner.pos[2]);
    max.z = Math.max(max.z, corner.pos[2]);
  }

  switch (direction) {
    case 'PositiveY': return min.y === 0.5 && max.y === 0.5 && min.x === -0.5 && max.x === 0.5 && min.z === -0.5 && max.z === 0.5;
    case 'NegativeY': return min.y === -0.5 && max.y === -0.5 && min.x === -0.5 && max.x === 0.5 && min.z === -0.5 && max.z === 0.5;
    case 'PositiveZ': return min.z === 0.5 && max.z === 0.5 && min.x === -0.5 && max.x === 0.5 && min.y === -0.5 && max.y === 0.5;
    case 'NegativeZ': return min.z === -0.5 && max.z === -0.5 && min.x === -0.5 && max.x === 0.5 && min.y === -0.5 && max.y === 0.5;
    case 'PositiveX': return min.x === 0.5 && max.x === 0.5 && min.y === -0.5 && max.y === 0.5 && min.z === -0.5 && max.z === 0.5;
    case 'NegativeX': return min.x === -0.5 && max.x === -0.5 && min.y === -0.5 && max.y === 0.5 && min.z === -0.5 && max.z === 0.5;
  }
}

export class Chunk {
  private readonly position: THREE.Vector3;
  private blocks = new Uint8Array(CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH);
  private mesh: THREE.Mesh | null = null;
  private wireframeMesh: THREE.LineSegments | null = null;

  constructor(position: THREE.Vector3) {
    this.position = position;
  }

  public setBlock(x: number, y: number, z: number, id: number) {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      return; // Out of bounds
    }
    this.blocks[computeIndex(x, y, z)] = id;
  }

  public toggleWireframe(value: boolean) {
    if (this.mesh && this.wireframeMesh) {
      this.mesh.visible = !value;
      this.wireframeMesh.visible = value;
    }
  }

  private getBlock(x: number, y: number, z: number): Block | null {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      return null; // For now, treat out-of-bounds as air
    }
    const blockId = this.blocks[computeIndex(x, y, z)];
    return getBlock(blockId);
  }

  public generateMesh(scene: THREE.Scene) {
    // Dispose old geometry if it exists
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    if (this.wireframeMesh) {
      scene.remove(this.wireframeMesh);
      this.wireframeMesh.geometry.dispose();
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
          const currentBlock = this.getBlock(x, y, z);
          if (!currentBlock) continue;

          for (const direction of directions) {
            const neighborPos = [x + directionVectors[direction][0], y + directionVectors[direction][1], z + directionVectors[direction][2]];
            const neighborBlock = this.getBlock(neighborPos[0], neighborPos[1], neighborPos[2]);

            let faceIsVisible = false;
            if (!neighborBlock) {
              faceIsVisible = true;
            } else if (!neighborBlock.isOpaque) {
              faceIsVisible = true;
            } else {
              const oppositeDirection: BlockDirection = direction.includes('Positive') ? direction.replace('Positive', 'Negative') as BlockDirection : direction.replace('Negative', 'Positive') as BlockDirection;
              const opposingFace = neighborBlock.getFaceData(oppositeDirection);
              if (!opposingFace || !isFaceCoveringBoundary(opposingFace, oppositeDirection)) {
                faceIsVisible = true;
              }
            }

            if (faceIsVisible) {
              const faceData = currentBlock.getFaceData(direction);
              if (!faceData) continue;

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
            }
          }
        }
      }
    }

    if (vertexCount === 0) return;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    const material = new THREE.MeshLambertMaterial({ color: 'gray' });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position).multiplyScalar(CHUNK_WIDTH);
    scene.add(this.mesh);

    // Wireframe Mesh
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black wireframe
    this.wireframeMesh = new THREE.LineSegments(edges, lineMaterial);
    this.wireframeMesh.position.copy(this.position).multiplyScalar(CHUNK_WIDTH);
    this.wireframeMesh.visible = false; // Initially hidden
    scene.add(this.wireframeMesh);
  }
}