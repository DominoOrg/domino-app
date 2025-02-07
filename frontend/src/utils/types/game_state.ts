import { InvalidLengthError, UndefinedPuzzleError } from "../errors";
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
  freeTiles: TileSet;
  tileset: TileSet;

  constructor(puzzle: Array<Option<Tile>>) {
    this.inBoardTiles = puzzle;
    const n = this.getN(puzzle);
    this.tileset = new TileSet(n);
    const usedTiles: Tile[] = this.inBoardTiles.filter((el) => el != null);
    const unused: Tile[] = Array.from(this.tileset.iter()).filter((tile) => {
      const flipped_tile: Tile = tile.flip();
      return !usedTiles.includes(tile) && !usedTiles.includes(flipped_tile);
    });
    this.freeTiles = new TileSet(unused);
  }

  moveTile(tile: Tile, at: number) {
    this.inBoardTiles[at] = tile;
    const flipped_tile: Tile = tile.flip();
    if (this.freeTiles.has(tile) || this.freeTiles.has(flipped_tile)) {
      this.freeTiles.delete(tile);
      this.freeTiles.delete(flipped_tile);
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