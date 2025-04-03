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
  return (
  <div
    className={`w-5/6 md:w-1/2 lg:w-1/3 aspect-square`}
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
