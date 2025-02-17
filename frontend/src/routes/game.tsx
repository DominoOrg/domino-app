import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/custom/header";
import Tutorial from "@/components/custom/tutorial";
import { GameContextProvider } from "@/hooks/game_state/context";
import { usePuzzle } from "@/hooks/api/usePuzzle";
import { Spiral } from "@/components/custom/spiral";
import { Tile, Option } from "@/hooks/game_state/types";
import Controls from "@/components/custom/Controls";

const Game = () => {
  const { puzzleId }: {
    puzzleId: string
  } = Route.useSearch();

  // const { data, error, isPending } = usePuzzle(puzzleId);

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  const data: { tiles: Array<Option<Tile>>} = {
    tiles: [
      // Tile.from([7,1]),
      // Tile.from([1,2]),
      // Tile.from([2,0]),
      // Tile.from([0,3]),
      // Tile.from([3,2]),
      // Tile.from([2,2]),
      // Tile.from([2,6]),
      // Tile.from([6,4]),
      // Tile.from([4,0]),
      // Tile.from([0,8]),
      // Tile.from([8,7]),
      // Tile.from([7,6]),
      // Tile.from([6,3]),
      // Tile.from([3,5]),
      // Tile.from([5,4]),
      // Tile.from([4,4]),
      // Tile.from([4,1]),
      // Tile.from([1,9]),
      // Tile.from([9,2]),
      // Tile.from([2,4]),
      // Tile.from([4,7]),
      // Tile.from([7,0]),
      // Tile.from([0,9]),
      // Tile.from([9,5]),
      // Tile.from([5,5]),
      // Tile.from([5,7]),
      // Tile.from([7,9]),
      // Tile.from([9,6]),
      // Tile.from([6,0]),
      // Tile.from([0,0]),
      // Tile.from([0,1]),
      // Tile.from([1,8]),
      // Tile.from([8,5]),
      // Tile.from([5,6]),
      // Tile.from([6,6]),
      // Tile.from([6,8]),
      // Tile.from([8,4]),
      // Tile.from([4,3]),
      // Tile.from([3,3]),
      // Tile.from([3,1]),
      // Tile.from([1,5]),
      // Tile.from([5,2]),
      // Tile.from([2,8]),
      // Tile.from([8,8]),
      // Tile.from([8,9]),
      // Tile.from([9,9]),
      // Tile.from([9,3]),
      // Tile.from([3,7]),
      // null,
      // Tile.from([7,7]),
      null,
      Tile.from([4,6]),
      Tile.from([6,5]),
      Tile.from([5,0]),
      null,
      Tile.from([0,3]),
      Tile.from([3,3]),
      Tile.from([3,2]),
      null,
      Tile.from([4,3]),
      Tile.from([3,6]),
      Tile.from([6,6]),
      Tile.from([6,1]),
      Tile.from([1,5]),
      null,
      Tile.from([4,4]),
      Tile.from([4,1]),
      null,
      Tile.from([3,5]),
      Tile.from([5,5]),
      null,
      Tile.from([2,1]),
      Tile.from([1,1]),
      null,
      Tile.from([0,2]),
      Tile.from([2,2]),
      null,
      Tile.from([6,0])
    ]
  }

  return (
    <div className="relative w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header/>
      <GameContextProvider puzzle={data.tiles}>
        <Spiral tiles={data.tiles} />
        <Controls/>
      </GameContextProvider>            
      <Tutorial/>
    </div>
  );
};


export const Route = createFileRoute("/game")({
  component: Game,
});
