export interface GameState {
  inBoardTiles: Array<Option<Tile>>,
  insertedTiles: Array<[Option<Tile>, number]>,
  freeTiles: Array<Option<Tile>>,
  tileset: TileSet
}

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


export class TileSet {
    tiles: Array<Tile>;
    n: number;
  
    constructor(tiles: Array<Option<Tile>> = [], n: number = 0) {
      this.tiles = [];
      this.n = n;
  
      if (n == 0) {
        // Constructor for tileset in which we know only the number of tiles
        const n = get_n(tiles);
        if (n == 0) {
          throw new Error("Invalid number of tiles");
        }
        this.n = n;
      }

      const combinationSize: number = 
        this.n % 2 == 0 ?
        (this.n + 1) * (this.n + 2) :
        Math.pow(this.n + 1, 2);
      const tileset: Tile[] = new Array(combinationSize)
        .fill(0)
        .map((_el, i) => {
          const row = Math.floor(i / (Number(this.n) + 1));
          const col = i % (Number(this.n) + 1);
          const tile: Tile = new Tile(row, col);
          if (col >= row) {
            if (
              Number(this.n) % 2 != 0 &&
              row < Math.floor((Number(this.n) + 1) / 2) &&
              col == Math.floor((Number(this.n) + 1) / 2) + row
            ) {
              return undefined;
            }
            return tile;
          } else {
            return undefined;
          }
        })
        .filter((el) => el != undefined);
      this.tiles = tileset;
    }
  
    at(position: number): Tile {
      return this.tiles[position];
    }

    add(tile: Tile): number {
      for (const t of this.tiles) {
        if (t.is_equal(tile)) {
          return -1;
        }
      }
      this.tiles.push(tile);
      return this.tiles.length - 1;
    }
  
    has(tile: Tile) {
      for (const t of this.tiles) {
        if (t.is_equal(tile)) {
          return true;
        }
      }
      return false;
    }
  
    delete(tile: Tile) {
      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].is_equal(tile)) {
          this.tiles.splice(i, 1);
          break;
        }
      }
    }
  
    iter(): Array<Tile> {
      return new Array(...this.tiles);
    }
  }
  

function get_n(puzzle: Array<Option<Tile>>): number {
  let n = 0;
  let tmp = (-3.0 + Math.sqrt(1.0 + 8.0 * puzzle.length)) / 2.0;
  if (tmp - Math.floor(tmp) == 0) {
    n = tmp;
  }
  tmp = (-1.0 + Math.sqrt(2.0 * puzzle.length));
  if (tmp - Math.floor(tmp) == 0) {
    n = tmp;
  }
  tmp = (-1.0 + Math.sqrt(1.0 + 4.0 * puzzle.length)) / 2.0;
  if (tmp - Math.floor(tmp) == 0) {
    n = tmp;
  }
  tmp = Math.sqrt(puzzle.length);
  if (tmp - Math.floor(tmp) == 0) {
    n = tmp;
  }
  return n;
}