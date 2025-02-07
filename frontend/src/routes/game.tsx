import { createRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { rootRoute } from "./__root";
import Tutorial from "@/components/custom/tutorial";
import { HelpCircle } from "lucide-react";
import useTutorial from "@/hooks/tutorial/useTutorial";
import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { GameState } from "@/utils/types/game_state";
import { Tile, Option } from "@/utils/types/game_state";
// import { z } from 'zod';

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = GameRoute.useSearch();
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

  const [gameState, setGameState] = useState(new GameState(data.tiles));

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && over.id !== active.id) {
      setGameState((currentState: GameState) => {
        // currentState.moveTile(active.id, over.id);
        return new GameState(currentState.inBoardTiles);
      })
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <Tutorial state={state} updateProgress={updateProgress} closeModal={closeTutorial}/>
      <DndContext onDragEnd={handleDragEnd}>
        <Board tiles={gameState.inBoardTiles}/>
        <DraggableTiles tiles={gameState.freeTiles.iter()} n={gameState.tileset.n}/>
      </DndContext>
      <div className="w-screen flex justify-end px-6">
        <HelpCircle onClick={openTutorial}/>
      </div>
    </div>
  );
};


// const gameSearchSchema = z.object({
//   puzzleId: z.string(),
// });

export const GameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: Game,
  // validateSearch: (search) => true
});
