interface GridProps {
    spiralCenter: {
        row: number,
        col: number
    },
    spiralSideIndex: number,
    tileIndex: number
}

export const useGridProperties = ({spiralCenter, spiralSideIndex, tileIndex}: GridProps) => {
    const coordinates = computeGridCoordinates(spiralCenter, spiralSideIndex, tileIndex);
  
    return {
      // gridTemplateRows: `repeat(${coordinates.rowSpan}, 1fr)`,
      // gridTemplateColumns: `repeat(${coordinates.colSpan}, 1fr)`,
      gridRowStart: coordinates.rowStart,
      gridRowEnd: coordinates.rowStart + coordinates.rowSpan,
      gridColumnStart: coordinates.colStart,
      gridColumnEnd: coordinates.colStart + coordinates.colSpan
    };
  };

  function computeGridCoordinates(
    spiralCenter: { row: number, col: number },
    spiralSideIndex: number,
    tileIndex: number
  ): {
    rowStart: number,
    colStart: number,
    rowSpan: number,
    colSpan: number
  } {
    const ring = Math.floor(spiralSideIndex / 4);
    const offset = spiralSideIndex % 4;
    let rowStart = 0;
    let colStart = 0;
    let rowSpan = 0;
    let colSpan = 0;
    switch (offset) {
      case 0:
        rowStart = spiralCenter.row - ring * 2;
        colStart = spiralCenter.col - ring * 2 + tileIndex * 2;
        rowSpan = 1;
        colSpan = 2;
        break;
      case 1:
        rowStart = spiralCenter.row - ring * 2 + tileIndex * 2;
        colStart = spiralCenter.col + ring * 2 + 2;
        rowSpan = 2;
        colSpan = 1;
        break;
      case 2:
        rowStart = spiralCenter.row + ring * 2 + 2;
        colStart = spiralCenter.col + ring * 2 - tileIndex * 2 + 1;
        rowSpan = 1;
        colSpan = 2;
        break;
      case 3:
        rowStart = spiralCenter.row + ring * 2 - tileIndex * 2 + 1;
        colStart = spiralCenter.col - ring * 2 - 2;
        rowSpan = 2;
        colSpan = 1;
        break;
    }
    return {
      rowStart,
      colStart,
      rowSpan,
      colSpan
    }
  }