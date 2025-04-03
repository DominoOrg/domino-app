import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { GameContextProvider } from "@/hooks/game_state/provider";
import { usePuzzle } from "@/hooks/api/usePuzzle";
import { Spiral } from "@/components/custom/spiral";
import { Controls } from "@/components/custom/controls";
import { DndGameContext } from "@/hooks/dragdrop/dndGameContext";

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

//  const { data, error, isPending } = usePuzzle(puzzleId);

  const data = usePuzzle(puzzleId);
/**
 *   if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

 */

  return (
    <div className="relative w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header/>
      <GameContextProvider puzzle={data.tiles}>
        <DndGameContext>
          <Spiral/>
          <Controls/>
        </DndGameContext>
      </GameContextProvider>
    <Tutorial/>
  </div>
  );
};


export const Route = createFileRoute("/game")({
  component: Game,
});
