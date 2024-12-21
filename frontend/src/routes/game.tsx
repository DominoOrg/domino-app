import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import { formSchema } from "@/components/custom/homeForm";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { DragDropProvider } from "@/draganddrop/DragDropContext";

export type TileModel = [number, number];

export interface PuzzleJson {
  id?: string;
  tiles?: (TileModel | null)[];
}

type Puzzle = {
  puzzleState?: PuzzleJson;
  draggableTiles: TileModel[];
};

const Game = () => {

  const params: {
    n: string;
    difficulty: string;
  } = Route.useSearch();
  const { n, difficulty } = params;
  let combinationSize: number = Math.pow(Number(n) + 1, 2);
  const tileset: [number, number][] = new Array(combinationSize)
    .fill(0)
    .map((_el, i) => {
      let col = i % (Number(n) + 1);
      let row = Math.floor(i / (Number(n) + 1));
      let tile: [number, number] = [row, col];
      if (col >= row) {
        if (
          Number(n) % 2 != 0 &&
          row < Math.floor((Number(n) + 1) / 2) &&
          col == Math.floor((Number(n) + 1) / 2) + row
        ) {
          return undefined;
        }
        return tile;
      } else {
        return undefined;
      }
    })
    .filter((el) => el != undefined);
  const [puzzle, setPuzzle] = useState<Puzzle>({
    puzzleState: undefined,
    draggableTiles: tileset,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData(
      puzzle,
      n,
      difficulty,
      setPuzzle,
      setLoading,
      setError,
    );
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <DragDropProvider>
        <Board puzzle={puzzle.puzzleState!}/>
        <DraggableTiles remainingTiles={puzzle.draggableTiles} n={Number(n)}/>
      </DragDropProvider>
    </div>
  );
};

export const Route = createFileRoute("/game")({
  component: Game,
  validateSearch: formSchema,
});


const fetchData = async (
  puzzle: Puzzle,
  n: string,
  difficulty: string,
  setPuzzle: React.Dispatch<React.SetStateAction<Puzzle>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await fetch(
      "http://dominoonline.it/select_puzzle?n=" +
        n +
        "&difficulty=" +
        difficulty,
    );
    if (!response.ok) {
      throw new Error("Network response was:" + response.status);
    }
    const result: PuzzleJson = await response.json();
    const remaining = puzzle.draggableTiles.filter((tile) => {
      for (const includedTile of result.tiles!.filter(
        (tile) => tile != null,
      )) {
        if (
          (includedTile[0] == tile[0] && includedTile[1] == tile[1]) ||
          (includedTile[0] == tile[1] && includedTile[1] == tile[0])
        ) {
          return false;
        }
      }
      return true;
    });
    setPuzzle({
      puzzleState: result,
      draggableTiles: remaining,
    });
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    }
  } finally {
    setLoading(false);
  }
};