import InBoardTile from "./inboardTile";
import FreeTile from "./freeTile";
import { Tile as TileType, Option } from "@/hooks/game_state/types";

export type GridTransform = {
  current_row: number;
  current_col: number;
  row_span: number;
  col_span: number;
  rotation: number;
};

const Tile: React.FC<{
  tile: Option<TileType>;
  index: number;
  gridTransform?: GridTransform;
  n: number;
  precTile?: TileType;
  followingTile?: TileType;
}> = ({
  tile,
  index,
  gridTransform,
  n,
  precTile,
  followingTile,
}) => {
  const isInBoard = gridTransform != null;
  const isFree = gridTransform == null && tile;
  // Initialize base classes for the div parent a.k.a. tile classes
  const tileClasses = "overflow-hidden flex justify-center items-center ";
  // Initialize base classes for the img contained in the div
  const imgClasses = "overflow-hidden ";
  let element = <></>;
  if (isInBoard) {
    element = (
      <InBoardTile
        tile={tile}
        index={index}
        gridTransform={gridTransform}
        tileClasses={tileClasses}
        imgClasses={imgClasses}
        n={n}
        preceidingTile={precTile}
        followingTile={followingTile}
      />
    );
  } else if (isFree) {
    element = (
      <FreeTile
        tile={tile!}
        index={index}
        imgClasses={imgClasses}
        n={n}
      />
    );
  }

  return element;
};

export default Tile;
