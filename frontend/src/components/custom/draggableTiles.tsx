import FreeTile from "./tile/freeTile";
import { useGame } from "@/hooks/game_state/useGame";

const DraggableTiles = () => {
  const {state} = useGame();
  
  return (
    <div className="flex justify-center items-center w-full h-36">
      <div className={
        "flex justify-around h-20 mx-auto " +
        "w-5/6 md:w-3/4 lg:w-1/2"
      }>
        {state.freeTiles.map((tile, i) => (
          <FreeTile
            key={i}
            tile={tile}
            index={i}
            imgClasses={"overflow-hidden "}
            n={state.tileset.n}
          />
        ))}
      </div>
    </div>
  );
};

export default DraggableTiles;
