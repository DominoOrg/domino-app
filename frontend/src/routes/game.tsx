import { createFileRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { Tile, Option } from "@/hooks/game_state/types";
import { GameContextProvider } from "@/hooks/game_state/context";

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

  // const { data, error, isPending } = usePuzzle(puzzleId);

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
