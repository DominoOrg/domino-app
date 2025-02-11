import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Tile, Option } from "./types";

export const useFreeTile = (tile: Option<Tile>, index: number) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({id: index.toString()});
    const style = {
      transform: CSS.Translate.toString(transform),
    }
    const {isDragging} = useDraggable({
      id: index.toString(),
      data: { type: "tile", tile: tile },
    });

    return {
      isDragging,
      style,
      attributes,
      listeners,
      setNodeRef
    };    
};


