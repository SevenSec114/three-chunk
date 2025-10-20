import { Block } from './block';
import type { BlockDirection } from './block';
import type { FaceData } from '../face';
import { cubeGeometries } from '../geometries/cube';

/**
 * The abstract class for all full, cubic block types.
 * It implements getFaceData to return the geometry for a standard cube.
 */
export abstract class Cube extends Block {
  getFaceData(direction: BlockDirection): FaceData[] {
    return cubeGeometries.all[direction];
  }
}