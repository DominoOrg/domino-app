import { createRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import { formSchema } from "@/components/custom/homeForm";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { DragDropProvider } from "@/hooks/draganddrop/DragDropContext";
import { usePuzzle } from "@/hooks/api/usePuzzle";
import { rootRoute } from "./__root";
import Tutorial from "@/components/custom/tutorial";
import { HelpCircle } from "lucide-react";
import useTutorial from "@/hooks/tutorial/useTutorial";

const Game = () => {
  const { n, difficulty }: {
    n: string,
    difficulty: string
  } = GameRoute.useSearch();
  const [state, updateProgress, closeTutorial, openTutorial] = useTutorial();
  const { data, error, isPending } = usePuzzle(n, difficulty);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <Tutorial state={state} updateProgress={updateProgress} closeModal={closeTutorial}/>
      <DragDropProvider>
        <Board puzzle={data}/>
        <DraggableTiles puzzle={data} n={n}/>
      </DragDropProvider>
      <div className="w-screen flex justify-end px-6">
        <HelpCircle onClick={openTutorial}/>
      </div>
    </div>
  );
};

export const GameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: Game,
  validateSearch: formSchema,
});
