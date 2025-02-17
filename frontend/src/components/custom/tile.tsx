import { CSSProperties } from "react";
import { TileHalve } from "./tileHalve";
import { Tile as TileType, Option } from "@/hooks/game_state/types";
import { useDraggable } from "@dnd-kit/core";

export interface TileProps {
    tile: Option<TileType>,
    rotation: boolean,
    spiralSideIndex: number,
    color: string,
    style: CSSProperties
    tileIndex: number
}

export const Tile = ({ tile, rotation, spiralSideIndex, color, style, tileIndex }: TileProps) => {
    const layout = spiralSideIndex % 2 === 0? '': 'flex-col';
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: tileIndex });
    const dragStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    return (
        <>
            {tile && <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={`flex ${layout} justify-around border-2 rounded overflow-hidden`}
                style={{...style, ...dragStyle}}
                >
                <TileHalve value={rotation ? tile.right : tile.left} sideIndex={spiralSideIndex}  color={color}/>
                <TileHalve value={rotation ? tile.left : tile.right} sideIndex={spiralSideIndex}  color={color}/>
            </div>}
            {!tile && <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className="border-dashed border-2 rounded overflow-hidden"
                style={{...style, ...dragStyle}}
                ></div>}
        </>
    );
};