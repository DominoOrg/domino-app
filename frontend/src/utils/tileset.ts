import { InvalidLengthError, UndefinedPuzzleError } from "./errors";

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



export const getN = (puzzle: ([number, number] | null)[] | undefined): number | never => {
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

/**
 * 
pub fn get_n(puzzle: &Puzzle) -> Result<i32, DominoError> {
    if puzzle.len() == 0 {
        return Err(DominoError::InvalidLength);
    }
    let mut tmp: f32 = (-3.0 + (1.0 as f32 + 8.0 as f32 * puzzle.len() as f32).sqrt()) / 2.0;
    if tmp - tmp.floor() == 0.0 {
        return Ok(tmp as i32);
    }
    tmp = -1.0 + (2.0 as f32 * puzzle.len() as f32).sqrt();
    if tmp - tmp.floor() == 0.0 {
        return Ok(tmp as i32);
    }
    tmp = (-1.0 + (1.0 as f32 + 4.0 * puzzle.len() as f32).sqrt()) / 2.0;
    if tmp - tmp.floor() == 0.0 {
        return Ok(tmp as i32);
    }
    tmp = (puzzle.len() as f32).sqrt();
    if tmp - tmp.floor() == 0.0 {
        return Ok(tmp as i32);
    }
    Err(DominoError::InvalidLength)
}
 */