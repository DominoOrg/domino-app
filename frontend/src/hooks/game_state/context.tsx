import React, { ReactNode, useReducer } from "react";
import { Tile, Option, TileSet } from "./types";
import { DndGameContext } from "@/hooks/dragdrop/dndGameContext";
import { DragEndEvent } from "@dnd-kit/core";

export interface GameState {
    inBoardTiles: Array<Option<Tile>>,
    insertedTiles: Array<[Option<Tile>, number]>,
    freeTiles: Array<Option<Tile>>,
    tileset: TileSet,
    isDragging: Option<{
        tile: Option<Tile>,
        id: number
    }>
}

export interface GameContextInteface {
    state: GameState;
    moveTile?: (tile: Option<Tile>, at: number) => void;
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
        insertedTiles: [],
        freeTiles,
        tileset,  // Ensure TileSet can be initialized with an empty array
        isDragging: null
    };

    const [{state}, dispatch] = useReducer(reducer, {state: initialState, moveTile: undefined});

    const moveTile = (tile: Option<Tile>, at: number) => {
        dispatch({ type: "MOVE_TILE", payload: { tile, at } });
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id && over && over.id ) {
            moveTile(state.freeTiles[active.id as number], over.id as number);
            moveTile(null, active.id as number);
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
        tile: Option<Tile>,
        at: number,
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
            const { tile, at }: { tile: Option<Tile>, at: number } = action.payload;
            const { inBoardTiles, freeTiles, insertedTiles }: {
                inBoardTiles: Array<Option<Tile>>,
                freeTiles: Array<Option<Tile>>,
                insertedTiles: Array<[Option<Tile>, number]>
            } = prevState.state;
            const newInBoardTiles: Array<Option<Tile>> = [...inBoardTiles];
            const tmp = newInBoardTiles[at];
            newInBoardTiles[at] = tile;
            const newInsertedTiles: Array<[Option<Tile>, number]> = [...insertedTiles, [tile, at]];
            const newFreeTiles: Array<Option<Tile>> = [...freeTiles, tmp];
            const newGameState = {
                ...prevState.state,
                inBoardTiles: newInBoardTiles,
                freeTiles: newFreeTiles,
                insertedTiles: newInsertedTiles
            };
            return { state: newGameState };
    }
};