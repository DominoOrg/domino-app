import { reducer } from "./reducer";
import { ReactNode, useReducer } from "react";
import { TileSet } from "./types";
import { GameContext, GameState } from "./context";
import { usePuzzle } from "../api/usePuzzle";

export const GameContextProvider = ({ id, children }: { id: string, children: ReactNode }) => {
    const { tiles, solution, n, c } = usePuzzle(id).data!;
    const tileset = new TileSet(tiles);
    const freeTiles = tileset.iter()
        .filter(tile =>
            !tiles.some(t => t && t.is_equal(tile))
        );

    const initialState: GameState = {
        inBoardTiles: tiles,
        insertedPositions: [],
        freeTiles,
        tileset,
        solution,
        n,
        c,
        moveTile: () => {},
        rotateTile: () => {},
        solvePuzzle: () => {},
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const moveTile = (from: number, to: number) => {
        dispatch({ type: "MOVE_TILE", payload: { from, to } });
    };

    const rotateTile = (index: number) => {
        dispatch({ type: "ROTATE_TILE", payload: { index } });
    };

    const solvePuzzle = () => {
        dispatch({ type: "SOLVE_PUZZLE" });
    };

    const updatedState: GameState = { ...state, moveTile, rotateTile, solvePuzzle };

    return (
        <GameContext.Provider value={ updatedState }>
            {children}
        </GameContext.Provider>
    );
};
