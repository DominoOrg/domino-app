import { useEffect, useRef } from 'react';
import { useDragDrop } from './DragDropContext.tsx';

interface UseDraggableProps {
  id: string;
  type: string;
  data: any;
}

export function useDraggable({ id, type, data }: UseDraggableProps) {
  const { setDraggedItem } = useDragDrop();
  const elementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem({ id, type, data });
      }
    };

    const handleDragEnd = () => {
      setDraggedItem(null);
    };

    element.draggable = true;
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
    };
  }, [id, type, data, setDraggedItem]);

  return elementRef;
}