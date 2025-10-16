// This file contains the geometric data for slab faces.
// Slabs are half-height blocks, occupying either the top or bottom half of a full block.
// We use a center-based coordinate system, from -0.5 to +0.5.

import type { FaceData } from "../face";

// Top half slab (occupying the top half of a block: y = 0 to y = 0.5)
export const GEOMETRY_SLAB_TOP_POSITIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
    { pos: [-0.5, 0.5, -0.5], uv: [0, 0] },
    { pos: [0.5, 0.5, -0.5], uv: [1, 0] },
  ]
};

export const GEOMETRY_SLAB_TOP_NEGATIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, 0, 0.5], uv: [0, 0] },
    { pos: [0.5, 0, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0, -0.5], uv: [0, 1] },
    { pos: [0.5, 0, -0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_TOP_POSITIVE_Z: FaceData = {
  corners: [
    { pos: [-0.5, 0, 0.5], uv: [0, 0] },
    { pos: [0.5, 0, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_TOP_NEGATIVE_Z: FaceData = {
  corners: [
    { pos: [0.5, 0, -0.5], uv: [0, 0] },
    { pos: [-0.5, 0, -0.5], uv: [1, 0] },
    { pos: [0.5, 0.5, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0.5, -0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_TOP_POSITIVE_X: FaceData = {
  corners: [
    { pos: [0.5, 0, 0.5], uv: [0, 0] },
    { pos: [0.5, 0, -0.5], uv: [1, 0] },
    { pos: [0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_TOP_NEGATIVE_X: FaceData = {
  corners: [
    { pos: [-0.5, 0, -0.5], uv: [0, 0] },
    { pos: [-0.5, 0, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0.5, 0.5], uv: [1, 1] },
  ]
};

// Bottom half slab (occupying the bottom half of a block: y = -0.5 to y = 0)
export const GEOMETRY_SLAB_BOTTOM_POSITIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, 0, 0.5], uv: [0, 1] },
    { pos: [0.5, 0, 0.5], uv: [1, 1] },
    { pos: [-0.5, 0, -0.5], uv: [0, 0] },
    { pos: [0.5, 0, -0.5], uv: [1, 0] },
  ]
};

export const GEOMETRY_SLAB_BOTTOM_NEGATIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [-0.5, -0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, -0.5, 0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_BOTTOM_POSITIVE_Z: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, 0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0, 0.5], uv: [0, 1] },
    { pos: [0.5, 0, 0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_BOTTOM_NEGATIVE_Z: FaceData = {
  corners: [
    { pos: [0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [-0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [0.5, 0, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0, -0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_BOTTOM_POSITIVE_X: FaceData = {
  corners: [
    { pos: [0.5, -0.5, 0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [0.5, 0, 0.5], uv: [0, 1] },
    { pos: [0.5, 0, -0.5], uv: [1, 1] },
  ]
};

export const GEOMETRY_SLAB_BOTTOM_NEGATIVE_X: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [-0.5, -0.5, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0, 0.5], uv: [1, 1] },
  ]
};