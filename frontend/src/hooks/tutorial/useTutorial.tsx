import { useReducer } from "react";

type TutorialState = {
  open: boolean;
  progress: number;
  title: string;
  description: string;
  gif: any;
  cta: string;
};

export default function useTutorial(): [TutorialState, () => void, () => void, () => void] {
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
    if (state.progress === 2) {
      dispatch({ type: 'CLOSE_tutorial' });
      localStorage.setItem("tutorialDone", "true");
    }
  };
  const closeTutorial = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  }
  const openTutorial = () => {
    localStorage.setItem("tutorialDone", "false");
    dispatch({ type: 'UPDATE_PROGRESS', payload: 0 });
  }

  return [state, updateProgress, closeTutorial, openTutorial];
}
  
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
            title = "Place tiles";
            break;
          case 2:
            title = "Rotate tiles";
            break;
          default:
            title = "";
        };
        let description;
        switch (action.payload) {
          case 0:
            description = "This is a tutorial on how to play.";
            break;
          case 1:
            description = "Choose a tile you want to move in, click and drag it to an empty tile. You can also \"remove\" a tile dragging in an empty space if you have one."; ;
            break;
          case 2:
            description = "Choose a tile you want to rotate then click it.";
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
      default:
        return state;
    }
  };