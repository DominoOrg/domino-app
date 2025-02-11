import { useContext } from "react";
import { GameContext, GameState } from "./context";

export const useGame = (): GameState => {
    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return gameContext;
}