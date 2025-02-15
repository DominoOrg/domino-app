import { useDraggable } from "@dnd-kit/core";
import { Tile, Option } from "./types";

export const useFreeTile = (tile: Option<Tile>, index: number) => {
  const {isDragging, attributes, listeners, setNodeRef, transform} = useDraggable({
    id: Number(index),
    data: { tile: tile },
  });
  const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return {
    isDragging,
    style,
    attributes,
    listeners,
    setNodeRef
  };    
};


