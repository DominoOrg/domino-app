type Tile = [number, number];

export function filterTiles(tiles: Tile[], remainingTiles: (Tile | null)[]): Tile[] {
  function areTilesEqualOrRotated(tile1: Tile, tile2: Tile): boolean {
      // Check if tiles are equal
      if (tile1[0] === tile2[0] && tile1[1] === tile2[1]) {
          return true;
      }
      // Check if tiles are rotated (swapped positions)
      return tile1[0] === tile2[1] && tile1[1] === tile2[0];
  }

  return tiles.filter(tile => 
      !remainingTiles.filter((remainingTile) => {return remainingTile != null}).some(remainingTile => 
          areTilesEqualOrRotated(tile, remainingTile)
      )
  );
}


export const computeTileset = (n: string): [number, number][] => {
    let combinationSize: number = Math.pow(Number(n) + 1, 2);
    const tileset: [number, number][] = new Array(combinationSize)
      .fill(0)
      .map((_el, i) => {
        let col = i % (Number(n) + 1);
        let row = Math.floor(i / (Number(n) + 1));
        let tile: [number, number] = [row, col];
        if (col >= row) {
          if (
            Number(n) % 2 != 0 &&
            row < Math.floor((Number(n) + 1) / 2) &&
            col == Math.floor((Number(n) + 1) / 2) + row
          ) {
            return undefined;
          }
          return tile;
        } else {
          return undefined;
        }
      })
      .filter((el) => el != undefined);
      return tileset;
  }