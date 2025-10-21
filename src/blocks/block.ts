import type { FaceData } from "../face";

export type BlockDirection = 'PositiveY' | 'NegativeY' | 'PositiveX' | 'NegativeX' | 'PositiveZ' | 'NegativeZ';

/**
 * The abstract base class for all block types.
 * It defines the essential properties and methods that every block must have.
 */
export abstract class Block {
  /**
   * The unique numerical ID for this block type.
   */
  abstract readonly id: number;

  /**
   * Whether this block is opaque. Opaque blocks cull faces behind them.
   * Transparent blocks (like glass) do not.
   */
  public readonly isOpaque: boolean = true;

  /**
   * Retrieves the geometric data for a specific face of the block.
   * A block can have multiple geometric faces on one block face.
   * This is the core method used by the mesher to build the world.
   * @param direction The face to retrieve data for.
   * @returns An array of FaceData for the given face. Can be an empty array.
   */
  abstract getFaceData(direction: BlockDirection, options?: Record<string, any>): FaceData[];
}
