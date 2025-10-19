import type { FaceData } from './face';
import type { BlockDirection } from './blocks/block';

type Point2D = { x: number, y: number };

/**
 * The main culling logic (V3 - Hybrid Algorithm).
 * It uses a fast path for simple cases and a slow path for complex cases.
 */
export function isOccluded(currentFace: FaceData, opposingFaces: FaceData[], direction: BlockDirection): boolean {
  if (opposingFaces.length === 0) {
    return false; // Nothing to occlude it
  }

  // --- Fast Path: Bounding Box Check ---
  // This is fast and handles the most common cases (full face vs full face) perfectly.
  const currentBounds = getFaceBounds(currentFace);
  for (const opposingFace of opposingFaces) {
    const opposingBounds = getFaceBounds(opposingFace);
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
    if (isSubset) return true; // If fully contained in any opposing box, it's definitely occluded.
  }

  // --- Slow Path: 'Survivor' Point-in-Polygon Check ---
  // This is more expensive but correctly handles partial occlusion for complex shapes.
  // We only run this if the fast path couldn't prove occlusion.

  const currentPolygon = projectTo2D(currentFace.corners, direction);
  const opposingPolygons = opposingFaces.map(f => projectTo2D(f.corners, direction));

  // Stage 1: Check if any vertex of the current face is a "survivor".
  for (const vertex of currentPolygon) {
    let isOccludedByAnyOpposing = false;
    for (const opposingPolygon of opposingPolygons) {
      if (isPointInPolygon(vertex, opposingPolygon)) {
        isOccludedByAnyOpposing = true;
        break; // This vertex is occluded, check the next vertex.
      }
    }
    // If we found a vertex that is not occluded by ANY opposing face, it's visible.
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

  // If all checks fail to prove visibility, it implies full occlusion by a complex combination.
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
