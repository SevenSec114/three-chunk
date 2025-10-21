import { Block } from './block';
import type { BlockDirection } from './block';
import type { FaceData } from '../face';
import { slabGeometries } from '../geometries/slab';

/**
 * The abstract class for all slab block types.
 * It implements getFaceData to return the geometry for either top or bottom slabs.
 */
export abstract class Slab extends Block {
  getFaceData(direction: BlockDirection, options?: Record<string, any>): FaceData[] {
    if (options?.position === 'top') {
      return slabGeometries.top[direction];
    } else {
      return slabGeometries.bottom[direction];
    }
  }
}