import { Block } from "./block";
import type { BlockDirection } from "./block";
import type { FaceData } from "../face";
import { fenceGeometries } from "../geometries/fence";

export class FenceBlock extends Block {
  id = 4;
  isOpaque = false;

  getFaceData(direction: BlockDirection, options?: Record<string, any>): FaceData[] {
    let faces = fenceGeometries.post[direction] || [];

    if (options?.neighbors?.['PositiveX'] instanceof FenceBlock || options?.neighbors?.['PositiveX']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_east[direction] || []);
    }
    if (options?.neighbors?.['NegativeX'] instanceof FenceBlock || options?.neighbors?.['NegativeX']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_west[direction] || []);
    }
    if (options?.neighbors?.['PositiveZ'] instanceof FenceBlock || options?.neighbors?.['PositiveZ']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_south[direction] || []);
    }
    if (options?.neighbors?.['NegativeZ'] instanceof FenceBlock || options?.neighbors?.['NegativeZ']?.isOpaque) {
      faces = faces.concat(fenceGeometries.arm_north[direction] || []);
    }

    return faces;
  }
}
