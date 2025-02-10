export interface GameState {
  inBoardTiles: Array<Option<Tile>>,
  insertedTiles: Array<[Tile, number]>,
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
  
    constructor(tiles: Array<Tile> | number) {
      this.tiles = [];
      this.n = 0;
  
      if (typeof tiles == "number") {
        // Constructor for tileset in which we know only n
        this.n = tiles;
        const combinationSize: number = Math.pow(Number(this.n) + 1, 2);
        const tileset: Tile[] = new Array(combinationSize)
          .fill(0)
          .map((_el, i) => {
            const col = i % (Number(this.n) + 1);
            const row = Math.floor(i / (Number(this.n) + 1));
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
          return new TileSet(tileset);
      } else {
        // Constructor for tileset in which we know only tiles
        this.n = 0;
        tiles.forEach((tile) => {
          const index = this.add(tile);
          if (index != -1) {
            const tmp = Math.max(tile.left, tile.right);
            this.n = Math.max(this.n, tmp);
          }
        })
      }
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
  