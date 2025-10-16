// This file contains the geometric data for full cube faces.
// All faces are defined with a counter-clockwise winding order when viewed from the outside.
// We use a center-based coordinate system, from -0.5 to +0.5.

import type { FaceData } from "../face";

// Positive Y (Top)
export const GEOMETRY_CUBE_POSITIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
    { pos: [-0.5, 0.5, -0.5], uv: [0, 0] },
    { pos: [0.5, 0.5, -0.5], uv: [1, 0] },
  ]
};

// Negative Y (Bottom)
export const GEOMETRY_CUBE_NEGATIVE_Y: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [-0.5, -0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, -0.5, 0.5], uv: [1, 1] },
  ]
};

// Positive Z (North)
export const GEOMETRY_CUBE_POSITIVE_Z: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, 0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
  ]
};

// Negative Z (South)
export const GEOMETRY_CUBE_NEGATIVE_Z: FaceData = {
  corners: [
    { pos: [0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [-0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [0.5, 0.5, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0.5, -0.5], uv: [1, 1] },
  ]
};

// Positive X (East)
export const GEOMETRY_CUBE_POSITIVE_X: FaceData = {
  corners: [
    { pos: [0.5, -0.5, 0.5], uv: [0, 0] },
    { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
    { pos: [0.5, 0.5, 0.5], uv: [0, 1] },
    { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
  ]
};

// Negative X (West)
export const GEOMETRY_CUBE_NEGATIVE_X: FaceData = {
  corners: [
    { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
    { pos: [-0.5, -0.5, 0.5], uv: [1, 0] },
    { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
    { pos: [-0.5, 0.5, 0.5], uv: [1, 1] },
  ]
};