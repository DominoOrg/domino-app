import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, pointerWithin } from "@dnd-kit/core";
import { GameContext } from "../game_state/context";
import { useContext } from "react";

interface PropsWithDragEndEvent {
    children: React.ReactNode
}


export const DndGameContext: React.FC<PropsWithDragEndEvent> = ({ children }) => {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
    );
    const context = useContext(GameContext);
    
    if (context === undefined) {
        throw new Error("useTile must be used within a GameProvider");
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over &&
            (context.insertedPositions.includes(Number(over.id)) ||
            !context.inBoardTiles[Number(over.id)])) {
            context.moveTile(active.id as number, over.id as number);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
        >
            {children}
        </DndContext>
    );

}