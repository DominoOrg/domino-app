import { Tile as TileType, Option } from "@/hooks/game_state/types";
import { InBoardTile } from "./inBoardTile";
import { useGame } from "@/hooks/game_state/useGame";

export const Spiral = () => {
  const tiles = useGame().inBoardTiles;
  const nSides = 2 * Math.floor(Math.sqrt(tiles.length));
  const rows = 1 + nSides;
  const cols = 2 + nSides;
  const center: { row: number, col: number } = {
    col: Math.floor(cols / 2),
    row: Math.floor(cols / 2),
  };
  let gridSize = "";
  const n: number = get_n(tiles)!;
  switch (n) {
    case 3:
      gridSize = "w-2/5 md:w-1/5 lg:w-1/6";
      break;
    case 6:
      gridSize = "w-5/6 md:w-2/3 lg:w-1/3";
      break;
    case 9:
      gridSize = "w-5/6 md:w-2/3 lg:w-5/12";
      break;
    default:
      break;
  }
  return (
  <div
    className={`${gridSize} aspect-square`}
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridGap: '4px'
    }}
    >
    {new Array(nSides + 1).fill(0).map((_, i) => {
      return (
        <SpiralSide
          key={i}
          index={i}
          tiles={tiles}
          spiralCenter={center}/>
      )
    })}
  </div>
  );
}

const SpiralSide = ({index, tiles, spiralCenter}: {
  index: number,
  tiles: Array<Option<TileType>>,
  spiralCenter: { row: number, col: number}
}) => {
  const sideBaseIndex = Math.floor((index + 1)/2) * Math.ceil((index + 1)/2);
  const nTiles = Math.floor(index/2) + 1;
  return (
    <>
      {tiles.slice(sideBaseIndex, sideBaseIndex + nTiles).map((tile, j) => {
          return (
            <InBoardTile
              key={j}
              tile={tile}
              spiralCenter={spiralCenter}
              spiralSideIndex={index}
              tileIndex={j}
              color={"bg-primary"}
              absoluteIndex={sideBaseIndex + j}
              />
          )
      })}
    </>
  )
}



function get_n(puzzle: Option<TileType>[]): number | null {
  if (puzzle.length === 0) {
      return null;
  }

  let tmp = (-3 + Math.sqrt(1 + 8 * puzzle.length)) / 2;
  if (tmp - Math.floor(tmp) === 0) {
      return tmp;
  }

  tmp = -1 + Math.sqrt(2 * puzzle.length);
  if (tmp - Math.floor(tmp) === 0) {
      return tmp;
  }

  tmp = (-1 + Math.sqrt(1 + 4 * puzzle.length)) / 2;
  if (tmp - Math.floor(tmp) === 0) {
      return tmp;
  }

  tmp = Math.sqrt(puzzle.length);
  if (tmp - Math.floor(tmp) === 0) {
      return tmp;
  }

  return null;
}
