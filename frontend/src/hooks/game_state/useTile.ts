import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useGame } from "./useGame";

export function useTile(tileId: number) {
    const { rotateTile } = useGame(); 
    const { attributes, listeners, transform, ...draggableProps } = useDraggable({ id: tileId });
    const { setNodeRef } = useDroppable({ id: tileId });
    const dragStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return {
        rotateTile,
        draggableProps,
        attributes,
        listeners,
        setNodeRef,
        dragStyle
    }
}