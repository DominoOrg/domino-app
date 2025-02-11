import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import FreeTile from "./tile/freeTile";
import { Tile, Option } from "@/hooks/game_state/types";

type DndOutletProps = {
    isDragging: Option<{
        tile: Option<Tile>,
        id: number
    }>,
    n: number,
    children: React.ReactNode
}

export const DndOutlet: React.FC<DndOutletProps> = ({ isDragging, n, children }) => {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );
    
    const handleDragStart = (event: DragStartEvent) => {
        console.log(event);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        console.log(event);
    };

    return (
        <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
            {children}
            <DragOverlay>
                {
                    isDragging?
                    <FreeTile
                        tile={isDragging.tile}
                        index={isDragging.id}
                        imgClasses="h-24"
                        n={n}
                    />
                    : null
                }
            </DragOverlay>
        </DndContext>
    );

}