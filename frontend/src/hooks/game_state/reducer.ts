import { GameState } from "./context";
import { Tile, Option } from "./types";

type Action = {
    type: "MOVE_TILE",
    payload: {
        from: number,
        to: number,
    }
} | { type: "ROTATE_TILE", payload: { index: number }};

export const reducer = (prevState: GameState, action: Action): GameState => {
    switch (action.type) {
        case "MOVE_TILE":
            return moveTile(prevState, action.payload);
        case "ROTATE_TILE":
            return updateTileArray(prevState, action.payload.index);
        default:
            return prevState; // Handle unknown action types by returning the previous state
    }
};

// Helper functions
const isFree = (position: number) => position >= 100;
const normalizePosition = (position: number) => isFree(position) ? position - 100 : position;
const getArray = (isFree: boolean, newInBoardTiles: Array<Option<Tile>>, newFreeTiles: Array<Option<Tile>>) => 
    isFree ? newFreeTiles : newInBoardTiles;

const updateTileArray = (state: GameState, index: number): GameState => {
    const { freeTiles, inBoardTiles, insertedPositions } = state;
    const newFreeTiles = [...freeTiles];
    const newInBoardTiles = [...inBoardTiles];
    const isBoard = !isFree(index);
    const normalizedIndex = isBoard ? index : normalizePosition(index);

    if (isBoard && !insertedPositions.includes(index)) {
        return state;
    }

    const targetArray = isBoard ? newInBoardTiles : newFreeTiles;
    let tile = targetArray[normalizedIndex];
    if (tile) {
        tile = tile.flip(); // Assuming flip is a method on Tile
        targetArray[normalizedIndex] = tile; // reassignment might be redundant if flip mutates in-place
    }

    return { ...state, freeTiles: newFreeTiles, inBoardTiles: newInBoardTiles };
};

const moveTile = (state: GameState, { from, to }: {from: number, to: number}): GameState => {
    const { inBoardTiles, freeTiles, insertedPositions } = state;
    const newInBoardTiles = [...inBoardTiles];
    const newFreeTiles = [...freeTiles];
    let newInsertedPositions = [...insertedPositions];

    const fromFree = isFree(from);
    const toFree = isFree(to);
    const normalizedFrom = normalizePosition(from);
    const normalizedTo = normalizePosition(to);

    if (!fromFree && !insertedPositions.includes(from)) {
        return state;
    }

    // Swap logic
    const fromArray = getArray(fromFree, newInBoardTiles, newFreeTiles);
    const toArray = getArray(toFree, newInBoardTiles, newFreeTiles);
    const temp = fromArray[normalizedFrom];
    fromArray[normalizedFrom] = toArray[normalizedTo];
    toArray[normalizedTo] = temp;

    // Update inserted positions
    if (fromFree && !toFree) {
        newInsertedPositions.push(to);
    } else if (!fromFree && toFree) {
        newInsertedPositions = newInsertedPositions.filter(position => position !== from);
    } else if (!fromFree && !toFree) {
        newInsertedPositions = newInsertedPositions.filter(position => position !== from);
        newInsertedPositions.push(to);
    }

    return { ...state, inBoardTiles: newInBoardTiles, freeTiles: newFreeTiles, insertedPositions: newInsertedPositions };
};