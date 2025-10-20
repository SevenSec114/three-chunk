import type { FaceData } from '../face';
import type { BlockDirection } from '../blocks/block';

const allFaces: Record<BlockDirection, FaceData[]> = {
  PositiveX: [{
    corners: [
      { pos: [0.5, -0.5, 0.5], uv: [0, 0] },
      { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
      { pos: [0.5, 0.5, 0.5], uv: [0, 1] },
      { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
    ]
  }],
  NegativeX: [{
    corners: [
      { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
      { pos: [-0.5, -0.5, 0.5], uv: [1, 0] },
      { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
      { pos: [-0.5, 0.5, 0.5], uv: [1, 1] },
    ]
  }],
  PositiveY: [{
    corners: [
      { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
      { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
      { pos: [-0.5, 0.5, -0.5], uv: [0, 0] },
      { pos: [0.5, 0.5, -0.5], uv: [1, 0] },
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
      { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
      { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
    ]
  }],
  NegativeZ: [{
    corners: [
      { pos: [0.5, -0.5, -0.5], uv: [0, 0] },
      { pos: [-0.5, -0.5, -0.5], uv: [1, 0] },
      { pos: [0.5, 0.5, -0.5], uv: [0, 1] },
      { pos: [-0.5, 0.5, -0.5], uv: [1, 1] },
    ]
  }],
};

export const cubeGeometries = {
  all: allFaces,
};
