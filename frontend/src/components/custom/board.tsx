import clsx from "clsx";
import { computeSpiral } from "../../utils/spiral";

interface PuzzleJson {
  id: string,
  tiles: ([number, number] | null)[];
}

interface BoardProps {
  // loading: boolean,
  puzzle: PuzzleJson | null;
}

const Board: React.FC<BoardProps> = ({ puzzle }) => {
  const tiles = puzzle?.tiles;
  const [n, rows, cols, spiral] = computeSpiral(tiles!);
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
