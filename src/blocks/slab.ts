import { Block } from './block';
import type { BlockDirection } from './block';
import type { FaceData } from '../face';
import {
  GEOMETRY_SLAB_TOP_POSITIVE_X,
  GEOMETRY_SLAB_TOP_NEGATIVE_X,
  GEOMETRY_SLAB_TOP_POSITIVE_Y,
  GEOMETRY_SLAB_TOP_NEGATIVE_Y,
  GEOMETRY_SLAB_TOP_POSITIVE_Z,
  GEOMETRY_SLAB_TOP_NEGATIVE_Z,
  GEOMETRY_SLAB_BOTTOM_POSITIVE_X,
  GEOMETRY_SLAB_BOTTOM_NEGATIVE_X,
  GEOMETRY_SLAB_BOTTOM_POSITIVE_Y,
  GEOMETRY_SLAB_BOTTOM_NEGATIVE_Y,
  GEOMETRY_SLAB_BOTTOM_POSITIVE_Z,
  GEOMETRY_SLAB_BOTTOM_NEGATIVE_Z,
} from '../geometries/slab';

/**
 * The abstract class for all slab block types.
 * It implements getFaceData to return the geometry for either top or bottom slabs.
 */
export abstract class Slab extends Block {
  getFaceData(direction: BlockDirection, options?: Record<string, string>): FaceData[] {
    if (options?.position === 'top') {
      switch (direction) {
        case 'PositiveX': return [GEOMETRY_SLAB_TOP_POSITIVE_X];
        case 'NegativeX': return [GEOMETRY_SLAB_TOP_NEGATIVE_X];
        case 'PositiveY': return [GEOMETRY_SLAB_TOP_POSITIVE_Y];
        case 'NegativeY': return [GEOMETRY_SLAB_TOP_NEGATIVE_Y];
        case 'PositiveZ': return [GEOMETRY_SLAB_TOP_POSITIVE_Z];
        case 'NegativeZ': return [GEOMETRY_SLAB_TOP_NEGATIVE_Z];
      }
    } else {
      switch (direction) {
        case 'PositiveX': return [GEOMETRY_SLAB_BOTTOM_POSITIVE_X];
        case 'NegativeX': return [GEOMETRY_SLAB_BOTTOM_NEGATIVE_X];
        case 'PositiveY': return [GEOMETRY_SLAB_BOTTOM_POSITIVE_Y];
        case 'NegativeY': return [GEOMETRY_SLAB_BOTTOM_NEGATIVE_Y];
        case 'PositiveZ': return [GEOMETRY_SLAB_BOTTOM_POSITIVE_Z];
        case 'NegativeZ': return [GEOMETRY_SLAB_BOTTOM_NEGATIVE_Z];
      }
    }
    return [];
  }
}