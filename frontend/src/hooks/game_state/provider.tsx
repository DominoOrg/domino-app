import { reducer } from "./reducer";
import { ReactNode, useReducer } from "react";
import { TileSet, Option, Tile } from "./types";
import { GameContext, GameState } from "./context";

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
