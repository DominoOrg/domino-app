import { useEffect, useRef, useState } from 'react';
import { DragItem, useDragDrop } from './DragDropContext.tsx';

interface UseDroppableProps {
  acceptTypes: string[];
  onDrop: (draggedData: DragItem, dropZoneElement: HTMLElement | null) => void;
}

export function useDroppable({ acceptTypes, onDrop }: UseDroppableProps) {
  const { draggedItem } = useDragDrop();
  const [isOver, setIsOver] = useState(false);
  const elementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (draggedItem && acceptTypes.includes(draggedItem.type)) {
        e.dataTransfer!.dropEffect = 'move';
        if (!isOver) setIsOver(true);
      }
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (draggedItem && acceptTypes.includes(draggedItem.type)) {
        setIsOver(true);
      }
    };

    const handleDragLeave = () => {
      setIsOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      if (draggedItem && acceptTypes.includes(draggedItem.type)) {
        onDrop(draggedItem, element);
      }
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [draggedItem, acceptTypes, onDrop, isOver]);

  return { elementRef, isOver };
}