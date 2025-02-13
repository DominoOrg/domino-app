import { createFileRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { GameContextProvider } from "@/hooks/game_state/context";
import { usePuzzle } from "@/hooks/api/usePuzzle";

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

  const { data, error, isPending } = usePuzzle(puzzleId);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="relative w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header/>
      <GameContextProvider puzzle={data.tiles}>
        <Board/>
        <DraggableTiles/>
      </GameContextProvider>            
      <Tutorial/>
    </div>
  );
};


export const Route = createFileRoute("/game")({
  component: Game,
});
