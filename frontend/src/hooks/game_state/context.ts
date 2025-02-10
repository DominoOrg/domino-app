import { createContext, useState } from "react";
import { Tile, Option, TileSet, GameState } from "./types";
// import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, pointerWithin } from "@dnd-kit/core";

interface GameContextInteface {
    state: GameState;
    moveTile: (tile: Option<Tile>, at: number) => void;
}

const GameContext = createContext<GameContextInteface | undefined>(undefined);

export const GameContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>({
        inBoardTiles: [],
        insertedTiles: [],
        freeTiles: [],
        tileset: new TileSet([]) // Ensure TileSet can be initialized with an empty array
    });

    // const moveTile = (tile: Option<Tile>, at: number) => {
    //     // Implement moveTile function here
    //     console.log("Move tile", tile, at);
    // };

    // const sensors = useSensors(
    //     useSensor(MouseSensor),
    //     useSensor(TouchSensor)
    // );

    // const handleDragEnd = (event: any) => {
    //     // Implement drag end logic here
    //     console.log("Drag ended", event);
    // };

    return (
        <GameContext.Provider value={{ state, moveTile }}>
            // <DndContext
            //     sensors={sensors}
            //     collisionDetection={pointerWithin}
            //     onDragEnd={handleDragEnd}>
            //     {children}
            // </DndContext>
            {children}
        </GameContext.Provider>
    );
};

