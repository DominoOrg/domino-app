import clsx from "clsx";
import { Tile, Option } from "@/hooks/game_state/types";
import { useInBoardTile } from "@/hooks/game_state/useInBoardTile";
import { useGame } from "@/hooks/game_state/useGame";

export type GridTransform = {
  current_row: number;
  current_col: number;
  row_span: number;
  col_span: number;
  rotation: number;
};

type InBoardProps = {
  tile: Option<Tile>;
  index: number;
  tileClasses: string;
  imgClasses: string;
  gridTransform: GridTransform;
  n: number;
  preceidingTile: Option<Tile>;
  followingTile: Option<Tile>;
};

const InBoardTile: React.FC<InBoardProps> = (props) => {
  const { tile, index, gridTransform, n } = props;
  const {imgCls, tileCls} = n===9? setupClasses9({
    tile,
    imgClasses: props.imgClasses,
    gridTransform,
    n
  }) : setupClasses({
    tile,
    imgClasses: props.imgClasses,
    gridTransform,
    n
  });
  const {insertedPositions}: {insertedPositions: Array<number>} = useGame();
  const rotateTile = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!e.target || !insertedPositions.includes(index)) return;
    const img = e.target as HTMLImageElement;
    const className = img.className;
    const indexStart = className.indexOf("rotate-");
    const actualRotation = className.substring(indexStart + 7, className.indexOf(" ", indexStart));
    const newRotation = (parseInt(actualRotation) + 180) % 360;
    img.className = img.className.replace("rotate-" + actualRotation, "rotate-" + newRotation);
  }
  const {setNodeRef} = useInBoardTile(index);
  return (
    <>
      {n !== 9 && <div
        ref={setNodeRef}
        key={index}
        className={tileCls}
      >
        {tile && (
            <img
              src={
                "tile" +
                (tile.left > tile.right
                  ? tile.left + "" + tile.right
                  : tile.right + "" + tile.left) +
                ".png"
              }
              className={imgCls}
              onPointerDown={rotateTile}
            />
        )}
        {!tile && (
          // Only if the tile is missing mark it with the drop ref
            <img
              src="missing_tile.png"
              className={imgCls}
            />
        )}
      </div>}
      {n === 9 && tile && (
          <img
            ref={setNodeRef}
            key={index}
            src={
              "tile" +
              (tile.left > tile.right
                ? tile.left + "" + tile.right
                : tile.right + "" + tile.left) +
              ".png"
            }
            className={imgCls}
            onPointerDown={rotateTile}
          />
      )}
    {n === 9 && !tile && (
      // Only if the tile is missing mark it with the drop ref
        <img
          ref={setNodeRef}
          key={index}
          src="missing_tile.png"
          className={imgCls}
        />
    )}
    </>
  );
};

export default InBoardTile;

function setupClasses(props: {
  tile: Option<Tile>,
  imgClasses: string,
  gridTransform?: GridTransform,
  n: number
}) {
  const { tile, imgClasses, gridTransform } = props;
  let imgCls = imgClasses;
  let tileCls = "";
  if (gridTransform) {
    const { current_row, current_col, row_span, col_span } = gridTransform;
    let { rotation } = gridTransform;
    // If the tile is displayed withing the grid add more classes on the position and rotation of the tile
    tileCls += clsx(
      `row-start-${current_row}`,
      `col-start-${current_col}`,
      `row-end-${current_row + row_span}`,
      `col-end-${current_col + col_span}`,
    );
    // Since images are loaded all with the upside number greater than the downside one
    // if the tile in the sequence appears to be vertical and with the first number lower
    // than the second flip it
    if (
      ((rotation == 90 || rotation == 180) && tile && tile.left > tile.right) ||
      ((rotation == 270 || rotation == 0) && tile && tile.left > tile.right)
    ) {
      rotation = (rotation + 180) % 360;
    }
    imgCls += " " + clsx(`rotate-${rotation}`) + " ";    
  
    if (rotation % 180 > 0) {
      imgCls += clsx(
        "translate-x-1/2 -translate-y-1/4",
        props.n==3?"h-24 md:h-30 lg:h-30":"",
        props.n==6?"h-18 md:h-30 lg:h-30":"",
      );
    } else {
      imgCls += clsx(
        props.n==3?"h-24 md:h-30 lg:h-30":"",
        props.n==6?"h-18 md:h-30 lg:h-30":"",
      );
    }

  }

  return {imgCls, tileCls};
}

function setupClasses9(props: {
  tile: Option<Tile>,
  imgClasses: string,
  gridTransform?: GridTransform,
  n: number
}) {
  const { tile, imgClasses, gridTransform } = props;
  let imgCls = imgClasses;
  if (gridTransform) {
    const { current_row, current_col, row_span, col_span } = gridTransform;
    let { rotation } = gridTransform;
    // If the tile is displayed withing the grid add more classes on the position and rotation of the tile
    imgCls += clsx(
      `row-start-${current_row}`,
      `col-start-${current_col}`,
      `row-end-${current_row + row_span}`,
      `col-end-${current_col + col_span}`,
    );
    // Since images are loaded all with the upside number greater than the downside one
    // if the tile in the sequence appears to be vertical and with the first number lower
    // than the second flip it
    if (
      ((rotation == 90 || rotation == 180) && tile && tile.left > tile.right) ||
      ((rotation == 270 || rotation == 0) && tile && tile.left > tile.right)
    ) {
      rotation = (rotation + 180) % 360;
    }
    imgCls += " " + clsx(`rotate-${rotation}`) + " ";    
  
    if (rotation % 180 > 0) {
      imgCls += clsx(
        "translate-x-1/2 -translate-y-1/4",
        props.n==3?"h-24 md:h-30 lg:h-30":"",
        props.n==6?"h-18 md:h-30 lg:h-30":"",
        props.n==9?"h-18 md:h-30 lg:h-30":"",
      );
    } else {
      imgCls += clsx(
        props.n==3?"h-24 md:h-30 lg:h-30":"",
        props.n==6?"h-18 md:h-30 lg:h-30":"",
        props.n==9?"h-18 md:h-30 lg:h-30":""
      );
    }

  }

  return {tileCls: " ", imgCls};
}