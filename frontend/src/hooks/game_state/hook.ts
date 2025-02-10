import { useContext } from "react";
import { GameState, Option, Tile } from "./types";
import { GameStateContext } from "./context";

interface Puzzle { id: string, tiles: Array<Option<Tile>>};

export function useGame(puzzle: Puzzle): [GameState, (tile: Option<Tile>, at: number) => void] {
    const context = useContext(GameStateContext);
    if (!context) throw new Error("useGame must be used within a GameStateContextProvider");

    return [context.state, context.moveTile];
}