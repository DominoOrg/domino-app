import { Tile as TileType } from "@/utils/types/game_state";
import Tile from "./tile/tile";

interface RemainingTilesProps {
  tiles: TileType[]
  n: number
}

const DraggableTiles: React.FC<RemainingTilesProps> = ({
  tiles,
  n
}) => {
  
  return (
    <div className="flex justify-center items-center w-full h-36 overflow-hidden">
      <div className={
        "flex justify-around h-20 mx-auto " +
        "w-5/6 md:w-3/4 lg:w-1/2"

      }>
        {tiles.map((tile, i) => (
          <Tile
            key={i}
            tile={tile}
            index={i}
            gridTransform={undefined}
            n={Number(n)}
            precTile={undefined}
            followingTile={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default DraggableTiles;
