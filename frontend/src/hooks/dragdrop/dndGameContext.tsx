import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

export const DndGameContext: React.FC<PropsWithChildren> = ({ children }) => {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
    );
    

    const handleDragEnd = (event: DragEndEvent) => {
        console.log(event);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
        >
            {children}
        </DndContext>
    );

}