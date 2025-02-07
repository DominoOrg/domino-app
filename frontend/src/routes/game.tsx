import { createRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { rootRoute } from "./__root";
import Tutorial from "@/components/custom/tutorial";
import { HelpCircle } from "lucide-react";
import useTutorial from "@/hooks/tutorial/useTutorial";
import { getN } from "@/utils/tileset";
// import { z } from 'zod';

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = GameRoute.useSearch();
  const [ state, updateProgress, closeTutorial, openTutorial ] = useTutorial();
  // const { data, error, isPending } = useGetPuzzle(puzzleId);

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  let data: { id: string, tiles: Array<[number, number] | null>} = {
    id: puzzleId,
    tiles: [
      [1,4],
      [4,0],
      [0,3],
      [3,2],
      null,
      [2,0],
      [0,5],
      [5,4],
      [4,2],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [3,6],
      null,
      null,
      [5,1],
      [1,3],
      null,
      null,
      null,
      [2,6],
      [6,6],
      [6,1]
    ]
  };
  const n = getN(data.tiles);
  // let n = getN(data?.tiles);
  
  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <Tutorial state={state} updateProgress={updateProgress} closeModal={closeTutorial}/>
      <Board puzzle={data}/>
      <DraggableTiles puzzle={data} n={String(n)}/>
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
