import React from "react";
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

