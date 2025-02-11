import React, { ReactNode, useReducer } from "react";
import { Tile, Option, TileSet } from "./types";
import { DndGameContext } from "@/hooks/dragdrop/dndGameContext";
import { DragEndEvent } from "@dnd-kit/core";

export interface GameState {
    inBoardTiles: Array<Option<Tile>>,
    insertedPositions: Array<number>,
    freeTiles: Array<Option<Tile>>,
    tileset: TileSet,
    isDragging: Option<{
        tile: Option<Tile>,
        id: number
    }>
}

export interface GameContextInteface {
    state: GameState;
    moveTile?: (from: number, to: number) => void;
}

export const GameContext = React.createContext<GameContextInteface | undefined>(undefined);

export const GameContextProvider = ({ puzzle, children }: { puzzle: Array<Option<Tile>>, children: ReactNode }) => {
    const tileset = new TileSet(puzzle);
    const freeTiles = tileset.iter()
        .filter(tile =>
            !puzzle.some(t => t && t.is_equal(tile))
        );
    const initialState: GameState = {
        inBoardTiles: puzzle,
        insertedPositions: [],
        freeTiles,
        tileset,  // Ensure TileSet can be initialized with an empty array
        isDragging: null
    };

    const [{state}, dispatch] = useReducer(reducer, {state: initialState, moveTile: undefined});

    const moveTile = (from: number, to: number) => {
        dispatch({ type: "MOVE_TILE", payload: { from, to } });
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id && over && over.id ) {
            moveTile(active.id as number, over.id as number);
        }
    }
    
    return (
        <GameContext.Provider value={ {state, moveTile} }>
            <DndGameContext onDragEnd={handleDragEnd}>
                {children}
            </DndGameContext>
        </GameContext.Provider>
    );
};

type Action = {
    type: "MOVE_TILE",
    payload: {
        from: number,
        to: number,
    }
} | {
    type: "UPDATE_DRAGGING",
    payload: Option<{
        tile: Option<Tile>,
        id: number
    }>
};

const reducer = (prevState: GameContextInteface, action: Action): GameContextInteface => {
    switch (action.type) {
        case "UPDATE_DRAGGING":
            let newState = { ...prevState };
            newState.state.isDragging = action.payload;
            return newState;
        case "MOVE_TILE":
            const { from, to }: { from: number, to: number } = action.payload;
            const { inBoardTiles, freeTiles, insertedPositions }: {
                inBoardTiles: Array<Option<Tile>>,
                freeTiles: Array<Option<Tile>>,
                insertedPositions: Array<number>
            } = prevState.state;
            const newInBoardTiles: Array<Option<Tile>> = [...inBoardTiles];
            const tmp = newInBoardTiles[to];
            newInBoardTiles[to] = freeTiles[from];
            const newInsertedPositions: Array<number> = [...insertedPositions, to];
            const newFreeTiles: Array<Option<Tile>> = [...freeTiles, tmp];
            const newGameState = {
                ...prevState.state,
                inBoardTiles: newInBoardTiles,
                freeTiles: newFreeTiles,
                insertedPositions: newInsertedPositions
            };
            return { state: newGameState };
    }
};