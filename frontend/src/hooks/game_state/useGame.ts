import { useContext } from "react";
import { GameContext, GameContextInteface } from "./context";

export const useGame = (): GameContextInteface => {
    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return gameContext;
}