import { CSSProperties } from "react";
import { TileHalve } from "./tileHalve";
import { Tile as TileType, Option } from "@/hooks/game_state/types";
import { useTile } from "@/hooks/game_state/useTile";
import { useDroppable } from "@dnd-kit/core";

export interface TileProps {
    tile: Option<TileType>,
    rotation: boolean,
    spiralSideIndex?: number,
    color: string,
    style?: CSSProperties
    tileIndex: number
}

export const Tile = ({ tile, rotation, spiralSideIndex = 1, color, style = {}, tileIndex }: TileProps) => {
    const { active } = useDroppable({id: tileIndex});
    const layout = spiralSideIndex % 2 === 0? '': 'flex-col';
    let size = ``;
    if (tileIndex >= 100) {
        size = `w-6 h-12 md:w-8 md:h-16`;
    }
    let isDragging = ``;
    if (active) {
        isDragging = `border-[#006DB940]`;
    }
    const { rotateTile, draggableProps, listeners, attributes, setNodeRef, dragStyle} = useTile(tileIndex);
    return (
        <>
            {tile && <div
                ref={draggableProps.setNodeRef}
                {...listeners}
                {...attributes}
                className={`${size} flex ${layout} justify-around border-2 rounded overflow-hidden shadow-md`}
                style={{...style, ...dragStyle}}
                onPointerDown={()=>rotateTile(tileIndex)}
                >
                <TileHalve value={rotation ? tile.right : tile.left} sideIndex={spiralSideIndex}  color={color}/>
                <TileHalve value={rotation ? tile.left : tile.right} sideIndex={spiralSideIndex}  color={color}/>
            </div>}
            {!tile && <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={`${size} border-dashed border-2 rounded overflow-hidden ${isDragging}`}
                style={{...style, ...dragStyle}}
                ></div>}
        </>
    );
};
