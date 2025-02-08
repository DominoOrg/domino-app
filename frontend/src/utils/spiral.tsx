import Tile from "@/components/custom/tile/tile";
import { Tile as TileType, Option } from "@/game/game_state";

const computeN = (tiles: Array<Option<TileType>>) => {
  const l = tiles.length;
  const n_p = (-3 + Math.sqrt(1 + 8 * l)) / 2;
  const n_d = Math.sqrt(2 * l) - 1;
  let n = 0;
  if (n_p - Math.floor(n_p) == 0) {
    n = Math.floor(n_p);
  } else {
    n = Math.floor(n_d);
  }
  return n;
};

export const computeSpiral = (
  tiles: Array<Option<TileType>>,
) => {
  let rows = 16;
  let cols = 16;
  switch (tiles.length) {
    case 8:
      rows = 5;
      cols = 5;
      break;
    case 28:
      rows = 9;
      cols = 11;
      break;
    case 50:
      rows = 13;
      cols = 16;
      break;
  }
  const spiral: React.JSX.Element[] = [];
  const n = computeN(tiles);
  let current_increment = 1;
  let current_row = Math.ceil(rows / 2);
  let current_col = 0
  if (n % 2 == 0) {
    current_col = Math.floor(cols / 2);
  } else {
    current_col = Math.ceil(cols / 2);
  }
  let current_side = 0;
  let rotation = false;
  let row_span = rotation ? 2 : 1;
  let col_span = rotation ? 1 : 2;
  let index_in_side = 0;
  let rotation_angle = 90;

  Array.from(tiles).forEach((tile, i) => {
    // Add the tile with his position in the spiral and his predecessor and successor tile in the spiral
    spiral.push(
      <Tile
        n={n}
        key={i}
        precTile={tiles[i - 1] || undefined}
        tile={tile}
        followingTile={tiles[i + 1] || undefined}
        index={spiral.length}
        gridTransform={{
          current_row,
          current_col,
          row_span,
          col_span,
          rotation: rotation_angle,
        }}
      />,
    );

    //Update the start position of the next tile
    //as if we will be on the same side
    if (current_side == 0) {
      current_col += 2;
    } else if (current_side == 1) {
      current_row += 2;
      if (index_in_side == current_increment - 1) {
        current_col -= 1;
      }
    } else if (current_side == 2) {
      current_col -= 2;
      if (index_in_side == current_increment - 1) {
        current_row -= 1;
        current_col += 1;
      }
    } else if (current_side == 3) {
      current_row -= 2;
      if (index_in_side == current_increment - 1) {
        current_row += 1;
      }
    }

    index_in_side = (index_in_side + 1) % current_increment;

    //If we are on the last tile of this side update the start and increment the current_side
    if (index_in_side == 0) {
      if (current_side == 1 || current_side == 3) {
        current_increment += 1;
      }
      rotation = !rotation;
      row_span = rotation ? 2 : 1;
      col_span = rotation ? 1 : 2;
      rotation_angle = (rotation_angle + 90) % 360;
      current_side = (current_side + 1) % 4;
    }
  });

  return [n, rows, cols, spiral];
};
