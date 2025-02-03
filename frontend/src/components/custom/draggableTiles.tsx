import { computeTileset, filterTiles } from "@/utils/tileset";
import Tile from "./tile/tile";
import { Puzzle } from "@/hooks/api/useSelectPuzzle";

interface RemainingTilesProps {
  puzzle: Puzzle,
  n: string
}

const DraggableTiles: React.FC<RemainingTilesProps> = ({
  puzzle: { tiles },
  n
}) => {
  let remainingTiles = filterTiles(computeTileset(n), tiles);
  
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
