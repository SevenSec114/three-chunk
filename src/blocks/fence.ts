import { Block } from "./block";
import type { BlockDirection } from "./block";
import type { FaceData } from "../face";
import { fenceGeometries } from "../geometries/fence";

export class FenceBlock extends Block {
  id = 4;
  isOpaque = false;

  getFaceData(direction: BlockDirection, options?: Record<string, string>, neighbors?: Record<string, Block | null>): FaceData[] {
    let faces = fenceGeometries.post[direction] || [];

    if (neighbors?.['PositiveX'] instanceof FenceBlock || neighbors?.['PositiveX']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_east[direction] || []);
    }
    if (neighbors?.['NegativeX'] instanceof FenceBlock || neighbors?.['NegativeX']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_west[direction] || []);
    }
    if (neighbors?.['PositiveZ'] instanceof FenceBlock || neighbors?.['PositiveZ']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_south[direction] || []);
    }
    if (neighbors?.['NegativeZ'] instanceof FenceBlock || neighbors?.['NegativeZ']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_north[direction] || []);
    }

    return faces;
  }
}
