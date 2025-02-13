import FreeTile from "./tile/freeTile";
import { useGame } from "@/hooks/game_state/useGame";
import { Option, Tile } from "@/hooks/game_state/types";

const DraggableTiles = () => {
  const {freeTiles, tileset} = useGame();
  
  return (
    <div className="flex justify-center items-center w-full h-36">
      <div className={
        "flex justify-around h-20 mx-auto " +
        "w-5/6 md:w-3/4 lg:w-3/4"
      }>
        {freeTiles.map((tile: Option<Tile>, i: number) => (
          <FreeTile
            key={i}
            tile={tile}
            index={i}
            imgClasses={"overflow-hidden "}
            n={tileset.n}
          />
        ))}
      </div>
    </div>
  );
};

export default DraggableTiles;
