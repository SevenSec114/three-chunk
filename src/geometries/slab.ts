import type { FaceData } from '../face';
import type { BlockDirection } from '../blocks/block';

const top: Record<BlockDirection, FaceData[]> = {
  PositiveX: [{
    corners: [
      { pos: [0.5, 0, 0.5], uv: [0, 0] },
      { pos: [0.5, 0, -0.5], uv: [1, 0] },
      { pos: [0.5, 0.5, 0.5], uv: [0, 0.5] },
      { pos: [0.5, 0.5, -0.5], uv: [1, 0.5] },
    ]
  }],
  NegativeX: [{
    corners: [
      { pos: [-0.5, 0, -0.5], uv: [0, 0] },
      { pos: [-0.5, 0, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0.5, -0.5], uv: [0, 0.5] },
      { pos: [-0.5, 0.5, 0.5], uv: [1, 0.5] },
    ]
  }],
  PositiveY: [{
    corners: [
      { pos: [-0.5, 0.5, 0.5], uv: [0, 0] },
      { pos: [0.5, 0.5, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
      { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
    ]
  }],
  NegativeY: [{
    corners: [
      { pos: [-0.5, 0, -0.5], uv: [0, 0] },
      { pos: [0.5, 0, -0.5], uv: [1, 0] },
      { pos: [-0.5, 0, 0.5], uv: [0, 1] },
      { pos: [0.5, 0, 0.5], uv: [1, 1] },
    ]
  }],
  PositiveZ: [{
    corners: [
      { pos: [-0.5, 0, 0.5], uv: [0, 0] },
      { pos: [0.5, 0, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0.5, 0.5], uv: [0, 0.5] },
      { pos: [0.5, 0.5, 0.5], uv: [1, 0.5] },
    ]
  }],
  NegativeZ: [{
    corners: [
      { pos: [0.5, 0, -0.5], uv: [0, 0] },
      { pos: [-0.5, 0, -0.5], uv: [1, 0] },
      { pos: [0.5, 0.5, -0.5], uv: [0, 0.5] },
      { pos: [-0.5, 0.5, -0.5], uv: [1, 0.5] },
    ]
  }],
};

const bottom: Record<BlockDirection, FaceData[]> = {
  PositiveX: [{
    corners: [
      { pos: [0.5, -0.5, 0.5], uv: [0, 0] },
      { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
      { pos: [0.5, 0, 0.5], uv: [0, 0.5] },
      { pos: [0.5, 0, -0.5], uv: [1, 0.5] },
    ]
  }],
  NegativeX: [{
    corners: [
      { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
      { pos: [-0.5, -0.5, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0, -0.5], uv: [0, 0.5] },
      { pos: [-0.5, 0, 0.5], uv: [1, 0.5] },
    ]
  }],
  PositiveY: [{
    corners: [
      { pos: [-0.5, 0, 0.5], uv: [0, 0] },
      { pos: [0.5, 0, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0, -0.5], uv: [0, 1] },
      { pos: [0.5, 0, -0.5], uv: [1, 1] },
    ]
  }],
  NegativeY: [{
    corners: [
      { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
      { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
      { pos: [-0.5, -0.5, 0.5], uv: [0, 1] },
      { pos: [0.5, -0.5, 0.5], uv: [1, 1] },
    ]
  }],
  PositiveZ: [{
    corners: [
      { pos: [-0.5, -0.5, 0.5], uv: [0, 0] },
      { pos: [0.5, -0.5, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0, 0.5], uv: [0, 0.5] },
      { pos: [0.5, 0, 0.5], uv: [1, 0.5] },
    ]
  }],
  NegativeZ: [{
    corners: [
      { pos: [0.5, -0.5, -0.5], uv: [0, 0] },
      { pos: [-0.5, -0.5, -0.5], uv: [1, 0] },
      { pos: [0.5, 0, -0.5], uv: [0, 0.5] },
      { pos: [-0.5, 0, -0.5], uv: [1, 0.5] },
    ]
  }],
};

export const slabGeometries = {
  top,
  bottom,
};