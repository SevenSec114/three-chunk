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

interface BlockData {
  id: number;
  options?: Record<string, string>;
}

export class Chunk {
  private readonly position: THREE.Vector3;
  private blocks: (BlockData | null)[] = new Array(CHUNK_WIDTH * CHUNK_HEIGHT * CHUNK_DEPTH).fill(null);
  private mesh: THREE.Mesh | null = null;
  private wireframeMesh: THREE.LineSegments | null = null;
  private debugMesh: THREE.Mesh | null = null; // added debug mesh

  constructor(position: THREE.Vector3) {
    this.position = position;
  }

  public setBlock(x: number, y: number, z: number, id: number, options?: Record<string, string>) {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      return; // Out of bounds
    }
    this.blocks[computeIndex(x, y, z)] = { id, options };
  }

  public toggleWireframe(value: boolean) {
    if (this.mesh && this.wireframeMesh) {
      this.mesh.visible = !value;
      this.wireframeMesh.visible = value;
    }
  }

  private getBlock(x: number, y: number, z: number): {block: Block | null, options?: Record<string, string>} {
    if (x < 0 || x >= CHUNK_WIDTH || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_DEPTH) {
      return {block: null}; // For now, treat out-of-bounds as air
    }
    const blockData = this.blocks[computeIndex(x, y, z)];
    if (!blockData) return {block: null};
    
    return {
      block: getBlock(blockData.id),
      options: blockData.options
    };
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
    if (this.debugMesh) {
      scene.remove(this.debugMesh);
      this.debugMesh.geometry.dispose();
    }

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let vertexCount = 0;

    // Debug (culled) face buffers
    const debugPositions: number[] = [];
    const debugNormals: number[] = [];
    const debugUvs: number[] = [];
    const debugIndices: number[] = [];
    let debugVertexCount = 0;
    const debugOffset = 0.01; // small offset so the red plane is visible

    const directions: BlockDirection[] = ['PositiveX', 'NegativeX', 'PositiveY', 'NegativeY', 'PositiveZ', 'NegativeZ'];
    const directionVectors = {
      PositiveX: [1, 0, 0], NegativeX: [-1, 0, 0],
      PositiveY: [0, 1, 0], NegativeY: [0, -1, 0],
      PositiveZ: [0, 0, 1], NegativeZ: [0, 0, -1],
    };

    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      for (let x = 0; x < CHUNK_WIDTH; x++) {
        for (let z = 0; z < CHUNK_DEPTH; z++) {
          const {block: currentBlock, options: currentOptions} = this.getBlock(x, y, z);
          if (!currentBlock) continue;

          for (const direction of directions) {
            const neighborPos = [x + directionVectors[direction][0], y + directionVectors[direction][1], z + directionVectors[direction][2]];
            const {block: neighborBlock, options: neighborOptions} = this.getBlock(neighborPos[0], neighborPos[1], neighborPos[2]);

            const faceData = currentBlock.getFaceData(direction, currentOptions);
            if (!faceData) continue;

            let faceIsVisible = false;
            if (!neighborBlock) {
              faceIsVisible = true;
            } else if (!neighborBlock.isOpaque) {
              faceIsVisible = true;
            } else {
              const oppositeDirection: BlockDirection = direction.includes('Positive') ? direction.replace('Positive', 'Negative') as BlockDirection : direction.replace('Negative', 'Positive') as BlockDirection;
              const opposingFace = neighborBlock.getFaceData(oppositeDirection, neighborOptions);

              const currentFaceIsBoundary = isFaceCoveringBoundary(faceData, direction);
              const opposingFaceIsBoundary = opposingFace && isFaceCoveringBoundary(opposingFace, oppositeDirection);

              if (!(currentFaceIsBoundary && opposingFaceIsBoundary)) {
                faceIsVisible = true;
              }
            }

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
              // Culled face: add a small red debug plane slightly offset along the face normal
              const faceData = currentBlock.getFaceData(direction, currentOptions);
              if (!faceData) continue;

              const nx = directionVectors[direction][0];
              const ny = directionVectors[direction][1];
              const nz = directionVectors[direction][2];

              for (const corner of faceData.corners) {
                debugPositions.push(
                  corner.pos[0] + x + nx * debugOffset,
                  corner.pos[1] + y + ny * debugOffset,
                  corner.pos[2] + z + nz * debugOffset
                );
                debugUvs.push(corner.uv[0], corner.uv[1]);
                debugNormals.push(nx, ny, nz);
              }

              debugIndices.push(
                debugVertexCount + 0, debugVertexCount + 1, debugVertexCount + 2,
                debugVertexCount + 2, debugVertexCount + 1, debugVertexCount + 3
              );
              debugVertexCount += 4;
            }
          }
        }
      }
    }

    if (vertexCount === 0 && debugVertexCount === 0) return;

    // Visible geometry (if any)
    if (vertexCount > 0) {
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

    // Debug mesh for culled faces
    if (debugVertexCount > 0) {
      const debugGeometry = new THREE.BufferGeometry();
      debugGeometry.setAttribute('position', new THREE.Float32BufferAttribute(debugPositions, 3));
      debugGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(debugNormals, 3));
      debugGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(debugUvs, 2));
      debugGeometry.setIndex(debugIndices);

      const debugMaterial = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
      this.debugMesh = new THREE.Mesh(debugGeometry, debugMaterial);
      this.debugMesh.position.copy(this.position).multiplyScalar(CHUNK_WIDTH);
      scene.add(this.debugMesh);
    }
  }
}