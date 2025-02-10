import clsx from "clsx";
import { computeSpiral } from "../../utils/spiral";
import { useGame } from "@/hooks/game_state/hook";

const Board: React.FC = () => {
  const [state, _] = useGame();
  const [n, rows, cols, spiral] = computeSpiral(state.inBoardTiles);  

  return (
      <div className={clsx(
          n==3?"h-1/3":"",
          n==6?"h-1/3 md:h-2/3 lg:h-2/3":"",
          n==9?"h-1/3 md:h-2/3 lg:h-2/3":"",
          "grid",
          `grid-rows-${rows}`,
          `grid-cols-${cols}`,
          "aspect-square",
        )}>
        {spiral}
      </div>
  );
};

export default Board;
