import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/custom/header";
import { GameContextProvider } from "@/hooks/game_state/provider";
import { usePuzzle } from "@/hooks/api/usePuzzle";
import { Spiral } from "@/components/custom/spiral";
import { FreeTiles } from "@/components/custom/freeTiles";
import { DndGameContext } from "@/hooks/dragdrop/dndGameContext";
import { TimerProvider } from "@/hooks/timer/context";
import { Controls } from "@/components/custom/controls";
import Tutorial from "@/components/custom/tutorial";


const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

  // const { data, error, isPending } = usePuzzle(puzzleId);

  const data = usePuzzle(puzzleId);
  console.log(data)

  //if (isPending) return <div>Loading...</div>;
  //if (error) return <div>Error: {error.message}</div>;


  return (
    <div className="relative w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <TimerProvider>
        <GameContextProvider puzzle={data.tiles}>
          <DndGameContext>
            <Header/>
            <Spiral/>
            <FreeTiles/>
            <Controls/>
            <Tutorial/>
          </DndGameContext>
        </GameContextProvider>
      </TimerProvider>
    </div>
  );
};




export const Route = createFileRoute("/game")({
  component: Game,
});
