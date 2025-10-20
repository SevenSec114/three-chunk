import { Block } from "./block";
import type { BlockDirection } from "./block";
import type { FaceData } from "../face";
import { stairGeometries } from "../geometries/stair";

export class StairBlock extends Block {
  id = 3; // Placeholder ID
  isOpaque = false; // Stairs are not fully opaque

  getFaceData(direction: BlockDirection, options?: Record<string, string>): FaceData[] {
    const facing = options?.['facing'] || 'north';

    switch (facing) {
      case 'north':
        return stairGeometries.north[direction] || [];
      case 'south':
        return stairGeometries.south[direction] || [];
      case 'east':
        return stairGeometries.east[direction] || [];
      case 'west':
        return stairGeometries.west[direction] || [];
      default:
        return [];
    }
  }
}
