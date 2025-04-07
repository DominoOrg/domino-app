import React from "react";
import { Tile, Option, TileSet } from "./types";

export interface GameState {
    inBoardTiles: Array<Option<Tile>>,
    insertedPositions: Array<number>,
    freeTiles: Array<Option<Tile>>,
    tileset: TileSet,
    solution: Array<Tile>,
    n: number,
    c: number,
    moveTile: (from: number, to: number) => void,
    rotateTile: (index: number) => void,
    solvePuzzle: () => void
}


export const GameContext = React.createContext<GameState | undefined>(undefined);

