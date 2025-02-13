import { createFileRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { GameContextProvider } from "@/hooks/game_state/context";
import { usePuzzle } from "@/hooks/api/usePuzzle";
import { Tile, Option } from "@/hooks/game_state/types";
const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

  // const { data, error, isPending } = usePuzzle(puzzleId);

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  const data: {
    id: string,
    tiles: Array<Option<Tile>>
  } = {
    id: "1",
    tiles: [
      null,
      Tile.from([2,2]),
      null,
      Tile.from([4,0]),
      null,
      Tile.from([2,1]),
      null,
      null,
      Tile.from([0,5]),
      null,
      Tile.from([3,4]),
      null,
      null,
      Tile.from([6,0]),
      Tile.from([0,3]),
      null,
      Tile.from([2,6]),
      Tile.from([6,3]),
      null,
      Tile.from([3,1]),
      Tile.from([1,6]),
      null,
      Tile.from([5,5]),
      null,
      Tile.from([1,1]),
      Tile.from([1,4]),
      null,
      null,
    ]
  }

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
