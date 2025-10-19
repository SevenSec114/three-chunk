import * as THREE from 'three';
import type { FaceData } from './face';
import type { BlockDirection } from './blocks/block';

const directionVectors = {
  PositiveX: [1, 0, 0], NegativeX: [-1, 0, 0],
  PositiveY: [0, 1, 0], NegativeY: [0, -1, 0],
  PositiveZ: [0, 0, 1], NegativeZ: [0, 0, -1],
};

/**
 * A class responsible for generating and managing debug visualizations,
 * starting with the visualization of culled faces.
 */
export class DebugMeshGenerator {
  private positions: number[] = [];
  private normals: number[] = [];
  private uvs: number[] = [];
  private indices: number[] = [];
  private vertexCount = 0;
  private readonly offset = 0.01;

  /**
   * Adds the geometry for a single culled face to the buffer.
   * @param faceData The geometric data of the face.
   * @param x The x-coordinate of the block in the chunk.
   * @param y The y-coordinate of the block in the chunk.
   * @param z The z-coordinate of the block in the chunk.
   * @param direction The direction the face is pointing.
   */
  public addCulledFace(faceData: FaceData, x: number, y: number, z: number, direction: BlockDirection) {
    const [nx, ny, nz] = directionVectors[direction];

    for (const corner of faceData.corners) {
      this.positions.push(
        corner.pos[0] + x + nx * this.offset,
        corner.pos[1] + y + ny * this.offset,
        corner.pos[2] + z + nz * this.offset
      );
      this.uvs.push(corner.uv[0], corner.uv[1]);
      this.normals.push(nx, ny, nz);
    }

    this.indices.push(
      this.vertexCount + 0, this.vertexCount + 1, this.vertexCount + 2,
      this.vertexCount + 2, this.vertexCount + 1, this.vertexCount + 3
    );
    this.vertexCount += 4;
  }

  /**
   * Builds the final THREE.Mesh for the debug geometry and adds it to the scene.
   * @param scene The THREE.Scene to add the mesh to.
   * @param chunkPosition The position of the parent chunk.
   * @returns The created THREE.Mesh, or null if there was no debug geometry.
   */
  public buildMesh(scene: THREE.Scene, chunkPosition: THREE.Vector3): THREE.Mesh | null {
    if (this.vertexCount === 0) {
      return null;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2));
    geometry.setIndex(this.indices);

    const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(chunkPosition).multiplyScalar(16); // CHUNK_WIDTH
    scene.add(mesh);
    
    return mesh;
  }
}
