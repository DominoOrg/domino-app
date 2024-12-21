import { TileModel } from "@/routes/game";
import Tile from "./tile/tile";

interface RemainingTilesProps {
  remainingTiles: TileModel[],
  n: number
}

const DraggableTiles: React.FC<RemainingTilesProps> = ({
  remainingTiles,
  n
}) => {
  return (
    <div className="flex justify-center items-center w-full h-36 overflow-hidden">
      <div className={
        "flex justify-around h-20 mx-auto " +
        "w-5/6 md:w-3/4 lg:w-1/2"

      }>
        {remainingTiles.map((tile, i) => (
          <Tile
            key={i}
            tile={tile}
            index={i}
            gridTransform={undefined}
            n={n}
            precTile={undefined}
            followingTile={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default DraggableTiles;
