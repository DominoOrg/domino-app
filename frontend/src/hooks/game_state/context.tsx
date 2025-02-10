import React, { ReactNode, useReducer } from "react";
import { Tile, Option, TileSet, GameState } from "./types";

interface GameContextInteface {
    state: GameState;
    moveTile: (tile: Option<Tile>, at: number) => void;
}

type Action = {
    type: "MOVE_TILE",
    payload: {
        tile: Option<Tile>,
        at: number
    }
};

export const GameContext = React.createContext<GameContextInteface | undefined>(undefined);

export const GameContextProvider = ({ puzzle, children }: { puzzle: Array<Option<Tile>>, children: ReactNode }) => {
    const initialState: GameState = {
        inBoardTiles: puzzle,
        insertedTiles: [],
        freeTiles: [],
        tileset: new TileSet(puzzle) // Ensure TileSet can be initialized with an empty array
    };
    const reducer = (prevState: GameContextInteface, action: Action): GameContextInteface => {
        switch (action.type) {
            case "MOVE_TILE":
                const { tile, at }: { tile: Option<Tile>, at: number } = action.payload;
                const { inBoardTiles, freeTiles, insertedTiles }: { inBoardTiles: Array<Option<Tile>>, freeTiles: Array<Option<Tile>>, insertedTiles: Array<[Option<Tile>, number]> } = prevState.state;
                const newInBoardTiles: Array<Option<Tile>> = [...inBoardTiles];
                const tmp = newInBoardTiles[at];
                newInBoardTiles[at] = tile;
                const newInsertedTiles: Array<[Option<Tile>, number]> = [...insertedTiles, [tile, at]];
                const newFreeTiles: Array<Option<Tile>> = [...freeTiles, tmp];
                const newGameState = { ...prevState.state, inBoardTiles: newInBoardTiles, freeTiles: newFreeTiles,insertedTiles: newInsertedTiles };
                return { state: newGameState, moveTile };
        }
    };

    const moveTile = (tile: Option<Tile>, at: number) => {
        dispatch({ type: "MOVE_TILE", payload: { tile, at } });
    };

    const [state, dispatch] = useReducer(reducer, {state: initialState, moveTile});

    return (
        <GameContext.Provider value={ state }>
            {children}
        </GameContext.Provider>
    );
};

