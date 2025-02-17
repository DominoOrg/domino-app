import { useGridProperties } from "@/hooks/grid/useGridProperties";
import { Tile } from "./tile";
import { Tile as TileType, Option } from "@/hooks/game_state/types";

// Define the props for the original Tile component
export interface TileProps {
    tile: Option<TileType>;
    spiralSideIndex: number;
    tileIndex: number;
    spiralCenter: { row: number; col: number };
    color: string;
    absoluteIndex: number;
  }
  
  export const InBoardTile = ({ tile, spiralSideIndex, tileIndex, absoluteIndex, spiralCenter, color }: TileProps) => {
    const gridProperties = useGridProperties({spiralCenter, spiralSideIndex, tileIndex});
    const rotation = spiralSideIndex % 4 > 1;

    return (
      <Tile
        tile={tile}
        rotation={rotation}
        spiralSideIndex={spiralSideIndex}
        color={color}
        style={{...gridProperties}}  
        tileIndex={absoluteIndex}
      />
    );
  };