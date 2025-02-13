import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, rectIntersection, pointerWithin } from "@dnd-kit/core";

interface PropsWithDragEndEvent {
    onDragEnd: (event: DragEndEvent) => void,
    children: React.ReactNode
}


export const DndGameContext: React.FC<PropsWithDragEndEvent> = ({ children, onDragEnd }) => {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={onDragEnd}
        >
            {children}
        </DndContext>
    );

}