import { useGame } from "@/hooks/game_state/useGame";
import { Option, Tile as TileType } from "@/hooks/game_state/types";
import { Tile } from "./tile";

export const Controls = () => {
  const {freeTiles} = useGame();
  
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className={
        "w-3/4 flex justify-around mx-auto"
      }>
        {freeTiles.map((tile: Option<TileType>, i: number) => (
          <Tile
            key={i}
            tile={tile}
            rotation={false} 
            color={"bg-[#00284B]"}
            tileIndex={i+100}/>
        ))}
      </div>
      
    </div>
  );
};