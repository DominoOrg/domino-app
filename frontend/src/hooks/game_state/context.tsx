import React, { ReactNode, useReducer } from "react";
import { Tile, Option, TileSet } from "./types";

export interface GameState {
    inBoardTiles: Array<Option<Tile>>,
    insertedPositions: Array<number>,
    freeTiles: Array<Option<Tile>>,
    tileset: TileSet,
    moveTile: (from: number, to: number) => void,
    rotateTile: (index: number) => void
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
        tileset,
        moveTile: () => {},
        rotateTile: () => {},
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const moveTile = (from: number, to: number) => {
        dispatch({ type: "MOVE_TILE", payload: { from, to } });
    };

    const rotateTile = (index: number) => {
        dispatch({ type: "ROTATE_TILE", payload: { index } });
    };

    const updatedState: GameState = { ...state, moveTile, rotateTile };

    return (
        <GameContext.Provider value={ updatedState }>
            {children}
        </GameContext.Provider>
    );
};

type Action = {
    type: "MOVE_TILE",
    payload: {
        from: number,
        to: number,
    }
} | { type: "ROTATE_TILE", payload: { index: number }};

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
            return newGameState;
        case "ROTATE_TILE":
            let { index }: { index: number } = action.payload;
            const newFreeTiles2 = [...prevState.freeTiles];
            const newInBoardTiles2 = [...prevState.inBoardTiles];
            if (prevState.insertedPositions.includes(index) && index > 0 && index < newFreeTiles2.length && newFreeTiles2[index]) {
                console.log("rotating")
                const newTile = newFreeTiles2[index];
                newInBoardTiles2[index] = newTile.flip();
            } else {
                console.log(prevState.insertedPositions.includes(index), index >= 0, index < newFreeTiles2.length, newFreeTiles2[index])
            }

            const newGameState2 = {
                ...prevState,
                freeTiles: newFreeTiles2,
                inBoardTiles: newInBoardTiles2 
            }
            console.log(newGameState2)
            return newGameState2;

    }
};