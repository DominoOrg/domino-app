import { createRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import { formSchema } from "@/components/custom/homeForm";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { DragDropProvider } from "@/draganddrop/DragDropContext";
import { usePuzzle } from "@/api/mod";
import { rootRoute } from "./__root";

const Game = () => {
  const { n, difficulty }: {
    n: string,
    difficulty: string
  } = GameRoute.useSearch();
  const { data, error, isPending } = usePuzzle(n, difficulty);
  
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <DragDropProvider>
        <Board puzzle={data}/>
        <DraggableTiles puzzle={data} n={n}/>
      </DragDropProvider>
    </div>
  );
};

export const GameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: Game,
  validateSearch: formSchema,
});