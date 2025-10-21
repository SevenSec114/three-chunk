import { Visibility } from './face';
import type { FaceData } from './face';
import type { BlockDirection } from './blocks/block';

const EPSILON = 0.0001;

type Point2D = { x: number, y: number };

/**
 * The main culling logic (V4 - Hybrid Algorithm with Planarity Check).
 * It uses a fast path for simple cases and a slow path for complex cases.
 */
export function isOccluded(currentFace: FaceData, opposingFaces: FaceData[], direction: BlockDirection): boolean {
  if (currentFace.visibility === Visibility.Always) {
    return false;
  }

  if (opposingFaces.length === 0) {
    return false; // Nothing to occlude it
  }

  // --- Fast Path: Bounding Box Check ---
  const currentBounds = getFaceBounds(currentFace);
  for (const opposingFace of opposingFaces) {
    const opposingBounds = getFaceBounds(opposingFace);

    // 1. Co-planarity and contact check
    let areTouching = false;
    switch (direction) {
      case 'PositiveY': areTouching = Math.abs(currentBounds.max.y - 0.5) < EPSILON && Math.abs(opposingBounds.min.y + 0.5) < EPSILON; break;
      case 'NegativeY': areTouching = Math.abs(currentBounds.min.y + 0.5) < EPSILON && Math.abs(opposingBounds.max.y - 0.5) < EPSILON; break;
      case 'PositiveX': areTouching = Math.abs(currentBounds.max.x - 0.5) < EPSILON && Math.abs(opposingBounds.min.x + 0.5) < EPSILON; break;
      case 'NegativeX': areTouching = Math.abs(currentBounds.min.x + 0.5) < EPSILON && Math.abs(opposingBounds.max.x - 0.5) < EPSILON; break;
      case 'PositiveZ': areTouching = Math.abs(currentBounds.max.z - 0.5) < EPSILON && Math.abs(opposingBounds.min.z + 0.5) < EPSILON; break;
      case 'NegativeZ': areTouching = Math.abs(currentBounds.min.z + 0.5) < EPSILON && Math.abs(opposingBounds.max.z - 0.5) < EPSILON; break;
    }

    if (!areTouching) continue; // If they aren't touching, they can't occlude in the fast path.

    // 2. 2D Projection check (only if they are touching)
    let isSubset = false;
    if (direction.includes('X')) {
        isSubset = currentBounds.min.y >= opposingBounds.min.y && currentBounds.max.y <= opposingBounds.max.y &&
                   currentBounds.min.z >= opposingBounds.min.z && currentBounds.max.z <= opposingBounds.max.z;
    } else if (direction.includes('Y')) {
        isSubset = currentBounds.min.x >= opposingBounds.min.x && currentBounds.max.x <= opposingBounds.max.x &&
                   currentBounds.min.z >= opposingBounds.min.z && currentBounds.max.z <= opposingBounds.max.z;
    } else { // Z
        isSubset = currentBounds.min.x >= opposingBounds.min.x && currentBounds.max.x <= opposingBounds.max.x &&
                   currentBounds.min.y >= opposingBounds.min.y && currentBounds.max.y <= opposingBounds.max.y;
    }
    if (isSubset) return true; // If touching and fully contained, it's occluded.
  }

  // --- Slow Path: 'Survivor' Point-in-Polygon Check ---
  const currentPolygon = projectTo2D(currentFace.corners, direction);
  const opposingPolygons = opposingFaces.map(f => projectTo2D(f.corners, direction));

  // Stage 1: Check if any vertex of the current face is a "survivor".
  for (const vertex of currentPolygon) {
    let isOccludedByAnyOpposing = false;
    for (const opposingPolygon of opposingPolygons) {
      if (isPointInPolygon(vertex, opposingPolygon)) {
        isOccludedByAnyOpposing = true;
        break;
      }
    }
    if (!isOccludedByAnyOpposing) {
      return false; // Short-circuit: Found a visible part.
    }
  }

  // Stage 2: Check if any vertex of an opposing face lies within the current face.
  for (let i = 0; i < opposingPolygons.length; i++) {
    const opposingPolygon = opposingPolygons[i];
    for (const vertex of opposingPolygon) {
      if (isPointInPolygon(vertex, currentPolygon)) {
        let isOccludedByOthers = false;
        for (let j = 0; j < opposingPolygons.length; j++) {
          if (i === j) continue;
          if (isPointInPolygon(vertex, opposingPolygons[j])) {
            isOccludedByOthers = true;
            break;
          }
        }
        if (!isOccludedByOthers) {
          return false; // Short-circuit: Found a visible intersection part.
        }
      }
    }
  }

  return true;
}


// --- Helper Functions ---

function getFaceBounds(faceData: FaceData) {
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const corner of faceData.corners) {
    min.x = Math.min(min.x, corner.pos[0]);
    max.x = Math.max(max.x, corner.pos[0]);
    min.y = Math.min(min.y, corner.pos[1]);
    max.y = Math.max(max.y, corner.pos[1]);
    min.z = Math.min(min.z, corner.pos[2]);
    max.z = Math.max(max.z, corner.pos[2]);
  }
  return { min, max };
}

function projectTo2D(corners: { pos: [number, number, number] }[], direction: BlockDirection): Point2D[] {
  if (direction.includes('X')) {
    return corners.map(c => ({ x: c.pos[1], y: c.pos[2] }));
  } else if (direction.includes('Y')) {
    return corners.map(c => ({ x: c.pos[0], y: c.pos[2] }));
  } else { // Z
    return corners.map(c => ({ x: c.pos[0], y: c.pos[1] }));
  }
}

function isPointInPolygon(point: Point2D, polygon: Point2D[]): boolean {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}
