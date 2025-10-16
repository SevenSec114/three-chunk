import { Block } from './block';
import type { BlockDirection } from './block';
import type { FaceData } from '../face';
import {
  GEOMETRY_CUBE_POSITIVE_Y,
  GEOMETRY_CUBE_NEGATIVE_Y,
  GEOMETRY_CUBE_POSITIVE_Z,
  GEOMETRY_CUBE_NEGATIVE_Z,
  GEOMETRY_CUBE_POSITIVE_X,
  GEOMETRY_CUBE_NEGATIVE_X
} from '../geometries/cube';

/**
 * The abstract class for all full, cubic block types.
 * It implements getFaceData to return the geometry for a standard cube.
 */
export abstract class Cube extends Block {
  getFaceData(direction: BlockDirection): FaceData {
    switch (direction) {
      case 'PositiveX': return GEOMETRY_CUBE_POSITIVE_X;
      case 'NegativeX': return GEOMETRY_CUBE_NEGATIVE_X;
      case 'PositiveY': return GEOMETRY_CUBE_POSITIVE_Y;
      case 'NegativeY': return GEOMETRY_CUBE_NEGATIVE_Y;
      case 'PositiveZ': return GEOMETRY_CUBE_POSITIVE_Z;
      case 'NegativeZ': return GEOMETRY_CUBE_NEGATIVE_Z;
    }
  }
}