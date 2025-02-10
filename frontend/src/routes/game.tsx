import { createFileRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { HelpCircle } from "lucide-react";
import useTutorial from "@/hooks/tutorial/useTutorial";
import { useReducer } from "react";
import { DndContext, DragEndEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { GameState } from "@/game/game_state";
import { Tile, Option } from "@/game/game_state";
// import { z } from 'zod';

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
  );
  const [ state, updateProgress, closeTutorial, openTutorial ] = useTutorial();
  // const { data, error, isPending } = useGetPuzzle(puzzleId);

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  const data: { id: string, tiles: Array<Option<Tile>>} = {
    id: puzzleId,
    tiles: [
      Tile.from([1,4]),
      Tile.from([4,0]),
      Tile.from([0,3]),
      Tile.from([3,2]),
      null,
      Tile.from([2,0]),
      Tile.from([0,5]),
      Tile.from([5,4]),
      Tile.from([4,2]),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      Tile.from([3,6]),
      null,
      null,
      Tile.from([5,1]),
      Tile.from([1,3]),
      null,
      null,
      null,
      Tile.from([2,6]),
      Tile.from([6,6]),
      Tile.from([6,1])
    ]
  };
  // let n = getN(data?.tiles);

  type Action = 
    { type: "MOVE_TILE", payload: { tile: Tile, at: number } };

  const reducer = (state: GameState, action: Action) => {
    switch (action.type) {
      case "MOVE_TILE":
        state.moveTile(action.payload.tile, action.payload.at);
        return new GameState(state.inBoardTiles, [...state.insertedTiles, [action.payload.tile, action.payload.at]]);
    }
  }

  const [gameState, dispatch] = useReducer(reducer, new GameState(data.tiles, []));

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && active && over.id !== active.id) {
      const tile: Option<Tile> | undefined= gameState.freeTiles.at(Number(active.id));
      if (!tile) return;
      dispatch({
        type: "MOVE_TILE",
        payload: {
          tile,
          at: Number(over.id)
        }
      });
    }
  }

  return (
    <div className="relative w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <Tutorial state={state} updateProgress={updateProgress} closeModal={closeTutorial}/>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Board tiles={gameState.inBoardTiles}/>
        <DraggableTiles tiles={[...gameState.freeTiles]} n={gameState.tileset.n}/>
      </DndContext>
      <div className="w-screen flex justify-end px-6">
        <HelpCircle onClick={openTutorial}/>
      </div>
    </div>
  );
};


export const Route = createFileRoute("/game")({
  component: Game,
});
