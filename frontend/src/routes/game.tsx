import { createRoute } from "@tanstack/react-router";
import Board from "@/components/custom/board";
import { formSchema } from "@/components/custom/homeForm";
import DraggableTiles from "@/components/custom/draggableTiles";
import Header from "@/components/custom/header";
import { DragDropProvider } from "@/draganddrop/DragDropContext";
import { usePuzzle } from "@/api/mod";
import { rootRoute } from "./__root";
import Tutorial from "@/components/custom/tutorial";
import { HelpCircle } from "lucide-react";
import { useReducer } from "react";

const Game = () => {
  const { n, difficulty }: {
    n: string,
    difficulty: string
  } = GameRoute.useSearch();
  const { data, error, isPending } = usePuzzle(n, difficulty);
  const isFirstTime = !localStorage.getItem("tutorialDone") || localStorage.getItem("tutorialDone") === "false";
  const initialState = {
    open: isFirstTime,
    progress: 0,
    title: "Welcome",
    description: "This is a tutorial on how to play",
    gif: "",
    cta: "Continue"
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateProgress = () => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: state.progress + 1 });
  }
  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
    localStorage.setItem("tutorialDone", "true");
  }
  const openModal = () => {
    dispatch({ type: 'OPEN_MODAL' });
  }

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-screen h-screen flex flex-col justify-around items-center overflow-hidden">
      <Header />
      <Tutorial state={state} updateProgress={updateProgress} closeModal={closeModal}/>
      <DragDropProvider>
        <Board puzzle={data}/>
        <DraggableTiles puzzle={data} n={n}/>
      </DragDropProvider>
      <div className="w-screen flex justify-end px-6">
        <HelpCircle onClick={()=>{
          localStorage.setItem("tutorialDone", "false");
          openModal();
        }}/>
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


const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      let open = action.payload !== 3;
      let title;
      switch (action.payload) {
        case 0:
          title = "Welcome";
          break;
        case 1:
          title = "Step 1";
          break;
        case 2:
          title = "Step 2";
          break;
        default:
          title = "";
      };
      let description;
      switch (action.payload) {
        case 0:
          description = "This is a tutorial on how to play";
          break;
        case 1:
          description = "Choose a tile you want to move in, click and drag it to an empty tile";
          break;
        case 2:
          description = "Choose a tile you want to rotate then click it";
          break;
        default:
          description = "";
      };
      let gif;
      switch (action.payload) {
        case 0:
          gif = "";
          break;
        case 1:
          gif = <img src="/tutorial1.gif" alt="tutorial gif" />;
          break;
        case 2:
          gif = <img src="/tutorial2.gif" alt="tutorial gif" />;
          break;
        default:
          gif = "";
      }
      let cta;
      switch (action.payload) {
        case 0:
          cta = "Continue";
          break;
        case 1:
          cta = "Continue";
          break;
        case 2:
          cta = "Play";
          break;
        default:
          cta = "";
      }
      return { progress: action.payload, open, title, description, gif, cta };
    case 'CLOSE_MODAL':
      return { open: false };
    case 'OPEN_MODAL':
      return { open: true, progress: 0, title: "Welcome", description: "This is a tutorial on how to play", gif: "", cta: "Continue" };
    default:
      return state;
  }
};
