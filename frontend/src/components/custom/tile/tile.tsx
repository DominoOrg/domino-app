import InBoardTile from "./inboardTile";
import FreeTile from "./freeTile";

export type GridTransform = {
  current_row: number;
  current_col: number;
  row_span: number;
  col_span: number;
  rotation: number;
};

const Tile: React.FC<{
  tile: [number, number] | null;
  index: number;
  gridTransform?: GridTransform;
  n: number;
  precTile?: [number, number];
  followingTile?: [number, number];
}> = ({
  tile,
  index,
  gridTransform,
  n,
  precTile,
  followingTile,
}) => {
  const isInBoard = gridTransform != null;
  const isMissing = !tile;
  const isFree = gridTransform == null && tile;
  // Initialize base classes for the div parent a.k.a. tile classes
  let tileClasses = "overflow-hidden flex justify-center items-center ";
  // Initialize base classes for the img contained in the div
  let imgClasses = "overflow-hidden ";
  let element = <></>;
  if (isInBoard) {
    element = (
      <InBoardTile
        tile={tile!}
        index={index}
        gridTransform={gridTransform}
        tileClasses={tileClasses}
        imgClasses={imgClasses}
        isMissing={isMissing}
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
