import { useContext } from "react";
import { GameState, Option, Tile } from "./types";
import { GameContext } from "./context";

export function useGame(): [GameState, (tile: Option<Tile>, at: number) => void] {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameContextProvider");

    return [context.state, context.moveTile];
}