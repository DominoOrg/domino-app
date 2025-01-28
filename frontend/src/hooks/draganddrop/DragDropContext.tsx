// dragDropContext.ts
import { createContext, useContext, useState, ReactNode } from "react";

// Define the interface for a drag item
export type DragItem = {
  id: string;
  type: string;
  data: any;
}

// Define the context type
interface DragDropContextType {
  draggedItem: DragItem | null;
  setDraggedItem: (item: DragItem | null) => void;
}

// Create the context
const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

// Create the provider component
export function DragDropProvider({ children }: { children: ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  return (
    <DragDropContext.Provider value={{ draggedItem, setDraggedItem }}>
      {children}
    </DragDropContext.Provider>
  );
}

// Hook to use the DragDrop context
export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
}