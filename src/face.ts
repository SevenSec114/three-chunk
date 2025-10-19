// This file contains the pure geometric data interface for face shapes.
// We use a center-based coordinate system, from -0.5 to +0.5.

export interface FaceData {
  /** The corner vertices of this face, relative to the block's center. */
  corners: {
    pos: [number, number, number];
    uv: [number, number];
  }[];
}
