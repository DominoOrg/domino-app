import React, { ReactNode, useReducer } from "react";
import { Tile, Option, TileSet } from "./types";
import { DndGameContext } from "@/hooks/dragdrop/dndGameContext";
import { DragEndEvent } from "@dnd-kit/core";

export interface GameState {
    inBoardTiles: Array<Option<Tile>>,
    insertedPositions: Array<number>,
    freeTiles: Array<Option<Tile>>,
    tileset: TileSet,
}

export const GameContext = React.createContext<GameState | undefined>(undefined);

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
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const moveTile = (from: number, to: number) => {
        dispatch({ type: "MOVE_TILE", payload: { from, to } });
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log(active, over);
        if (over &&
            (state.insertedPositions.includes(Number(over.id)) ||
            !state.inBoardTiles[Number(over.id)])
        ) {
            moveTile(active.id as number, over.id as number);
        }
    }
    
    return (
        <GameContext.Provider value={ state }>
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
};

const reducer = (prevState: GameState, action: Action): GameState => {
    switch (action.type) {
        case "MOVE_TILE":
            let { from, to }: { from: number, to: number } = action.payload;
            if (from >= 100) from -= 100;
            if (to >= 100) to -= 100;
            const { inBoardTiles, freeTiles, insertedPositions }: {
                inBoardTiles: Array<Option<Tile>>,
                freeTiles: Array<Option<Tile>>,
                insertedPositions: Array<number>
            } = prevState;
            const newInBoardTiles: Array<Option<Tile>> = [...inBoardTiles];
            const newFreeTiles: Array<Option<Tile>> = [...freeTiles];
            let newInsertedPositions: Array<number> = [...insertedPositions];
            if (newFreeTiles && newFreeTiles.length > Number(from) && newFreeTiles[Number(from)]!==null) {
                newInsertedPositions.push(Number(to));
            } else {
                const index = newInsertedPositions.indexOf(Number(to));
                if (index > -1) {
                    newInsertedPositions.splice(index, 1);
                }
            }

            const tmp = newFreeTiles[Number(from)];
            newFreeTiles[Number(from)] = newInBoardTiles[Number(to)];
            newInBoardTiles[Number(to)] = tmp;

            const newGameState = {
                ...prevState,
                inBoardTiles: newInBoardTiles,
                freeTiles: newFreeTiles,
                insertedPositions: newInsertedPositions
            };
            console.log(newGameState)
            return newGameState;
    }
};