import clsx from "clsx";
import { GridTransform } from "./tile";
import { useDroppable } from "@/hooks/draganddrop/useDroppable";
import { DragItem } from "@/hooks/draganddrop/DragDropContext";

type InBoardProps = {
  tile: [number, number] | null;
  index: number;
  tileClasses: string;
  imgClasses: string;
  isMissing: boolean;
  gridTransform: GridTransform;
  n: number;
  preceidingTile?: [number, number];
  followingTile?: [number, number];
};

const InBoardTile: React.FC<InBoardProps> = (props) => {
  const imgClasses = setupClasses({
    tile: props.tile,
    imgClasses: props.imgClasses,
    gridTransform: props.gridTransform,
    n: props.n
  });
  const { tile, index, isMissing } = props;
  const handleDrop = (draggedData: DragItem, dropZoneElement: HTMLElement | null) => {
    if (dropZoneElement) {
      let draggedElement = document.getElementById(draggedData.id);
      if (draggedElement) {
        const tmp = (draggedElement as HTMLImageElement).src;
        (draggedElement as HTMLImageElement).src = (dropZoneElement as HTMLImageElement).src;
        (dropZoneElement as HTMLImageElement).src = tmp;
      }
    }
  }

  const rotateTile = (e: any) => {
    e.preventDefault();
    let className = e.target.className;
    let indexStart = className.indexOf("rotate-");
    let actualRotation = className.substring(indexStart + 7, className.indexOf(" ", indexStart));
    let newRotation = (parseInt(actualRotation) + 180) % 360;
    e.target.className = (e.target as HTMLImageElement).className.replace("rotate-" + actualRotation, "rotate-" + newRotation);
  }

  const { elementRef } = useDroppable({
    acceptTypes: ["freeTile"],
    onDrop: handleDrop
  });

  return (
    <>
      {!isMissing && (
          <img
            id={tile![0]+""+tile![1]}
            key={index}
            src={
              "tile" +
              (tile![0] > tile![1]
                ? tile![0] + "" + tile![1]
                : tile![1] + "" + tile![0]) +
              ".png"
            }
            className={imgClasses}
          />
      )}
      {isMissing && (
        // Only if the tile is missing mark it with the drop ref
          <img
            ref={elementRef}
            key={index}
            src="missing_tile.png"
            className={imgClasses}
            onClick={rotateTile}
          />
      )}
    </>
  );
};

export default InBoardTile;

function setupClasses(props: {
  tile: [number, number] | null,
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
      ((rotation == 90 || rotation == 180) && tile && tile[0] > tile[1]) ||
      ((rotation == 270 || rotation == 0) && tile && tile[0] > tile[1])
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

  


  return imgCls
}