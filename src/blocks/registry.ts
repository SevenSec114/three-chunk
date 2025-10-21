import { Block } from './block';
import { Cube } from './cube';
import { Slab } from './slab';
import { StairBlock } from './stair';
import { FenceBlock } from './fence';

// --- CONCRETE BLOCK CLASSES ---

/**
 * A concrete class for a Stone block.
 * It extends Cube, so it automatically gets a cubic shape.
 * Its only job is to set a unique ID.
 */
class Stone extends Cube {
  readonly id = 1;
}

class StoneSlab extends Slab {
  readonly id = 2;
}

class StoneStair extends StairBlock {
  readonly id = 3;
}

class StoneFence extends FenceBlock {
  readonly id = 4;
}

// --- BLOCK REGISTRY ---

const blockInstances: { [id: number]: Block } = {
  1: new Stone(),
  2: new StoneSlab(),
  3: new StoneStair(),
  4: new StoneFence(),
};

/**
 * Retrieves the singleton instance of a block class from its ID.
 * @param id The numerical ID of the block.
 * @returns The Block instance, or null if not found.
 */
export function getBlock(id: number): Block | null {
  return blockInstances[id] || null;
}
