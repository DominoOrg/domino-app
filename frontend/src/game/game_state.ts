import { InvalidLengthError, UndefinedPuzzleError } from "../utils/errors";
import { TileSet } from "./tileset";

export type Option<T> = T | null;

export class Tile {
  left: number;
  right: number;

  constructor(left: number, right: number) {
    this.left = left;
    this.right = right;
  }

  static from(tile: [number, number]) {
    return new Tile(tile[0], tile[1]);
  }

  into(): [number, number] {
    return [this.left, this.right];
  }
  flip() {
    return new Tile(this.right, this.left);
  }

  is_equal(tile: Tile) {
    return (this.left == tile.left && this.right == tile.right) ||
      (this.left == tile.right && this.right == tile.left);
  }
}

export class GameState {
  inBoardTiles: Array<Option<Tile>>;
  insertedTiles: Array<[Tile, number]>;
  freeTiles: Array<Option<Tile>>;
  tileset: TileSet;

  constructor(puzzle: Array<Option<Tile>>, insertedTiles: Array<[Tile, number]>) 
  {
    const n = this.getN(puzzle);
    this.tileset = new TileSet(n);
    this.insertedTiles = insertedTiles;
    this.inBoardTiles = puzzle;
    this.insertedTiles.forEach((inserted: [Tile, number]) => {
      const [tile, index] = inserted;
      this.moveTile(tile, index);
    });
    console.log(this);
    const usedTiles: Tile[] = this.inBoardTiles.filter((el) => el != null);
    this.freeTiles = Array.from(this.tileset.iter()).filter((tile) => {
      const flipped_tile: Tile = tile.flip();
      return usedTiles.every((el) => !el.is_equal(tile) && !el.is_equal(flipped_tile));
    });
  }

  moveTile(tile: Tile, at: number) {
    console.log(tile, at);
    this.inBoardTiles[at] = tile;
    const flipped_tile: Tile = tile.flip();
    const tile_index = this.freeTiles.indexOf(tile);
    const flipped_tile_index = this.freeTiles.indexOf(flipped_tile);
    if (tile_index != -1) {
      this.freeTiles.splice(tile_index, 1, null);
    }
    if (flipped_tile_index != -1) {
      this.freeTiles.splice(flipped_tile_index, 1, null);
    }
  }

  getN(puzzle: Array<Option<Tile>> | undefined): number | never {
    let n = 0;
    if (!puzzle) {
      throw new UndefinedPuzzleError("The puzzle is not defined");
    }
    n = (-3.0 + Math.sqrt(1.0 + 8.0 * puzzle.length)) / 2.0;
    if (n - Math.floor(n) == 0.0) {
      return n;
    }
    n = (-1.0 + Math.sqrt(2.0 * puzzle.length));
    if (n - Math.floor(n) == 0.0) {
      return n;
    }
    n = (-1.0 + Math.sqrt(1.0 + 4.0 * puzzle.length)) / 2.0;
    if (n - Math.floor(n) == 0.0) {
      return n;
    }
    n = Math.sqrt(puzzle.length);
    if (n - Math.floor(n) == 0.0) {
      return n;
    }
    throw new InvalidLengthError("The puzzle has invalid length");
  }
    
}