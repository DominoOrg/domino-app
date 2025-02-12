import { useDroppable } from "@dnd-kit/core";

export const useInBoardTile = (index: number) => {
  const { setNodeRef } = useDroppable({ id: index });
  
  return { setNodeRef };
};