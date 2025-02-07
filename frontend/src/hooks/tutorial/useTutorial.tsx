import { useReducer } from "react";

export type TutorialState = {
  open: boolean;
  progress: number;
  title: string;
  description: string;
  gif: string | null; // Changed to string for URL or null
  cta: string;
};

type Action =
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'CLOSE_MODAL' };

const initialState: TutorialState = {
  open: false,
  progress: 0,
  title: "Welcome",
  description: "This is a tutorial on how to play",
  gif: null,
  cta: "Continue"
};

const steps = [
  {
    progress: 0,
    title: "Welcome",
    description: "This is a tutorial on how to play.",
    gif: null,
    cta: "Continue"
  },
  {
    progress: 1,
    title: "Place tiles",
    description: "Choose a tile you want to move in, click and drag it to an empty tile. You can also \"remove\" a tile by dragging it to an empty space if you have one.",
    gif: "/tutorial1.gif",
    cta: "Continue"
  },
  {
    progress: 2,
    title: "Rotate tiles",
    description: "Choose a tile you want to rotate then click it.",
    gif: "/tutorial2.gif",
    cta: "Play"
  }
];

const reducer = (state: TutorialState, action: Action): TutorialState => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        ...steps.find(s => s.progress === action.payload) || steps[0],
        open: action.payload < steps.length
      };
    case 'CLOSE_MODAL':
      return { ...state, open: false };
    default:
      return state;
  }
};

export default function useTutorial(): [TutorialState, () => void, () => void, () => void] {
  const isFirstTime = !localStorage.getItem("tutorialDone") || localStorage.getItem("tutorialDone") === "false";
  
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    open: isFirstTime
  });

  const updateProgress = () => {
    const newProgress = state.progress + 1;
    dispatch({ type: 'UPDATE_PROGRESS', payload: newProgress });
    if (newProgress >= steps.length) {
      localStorage.setItem("tutorialDone", "true");
    }
  };

  const closeTutorial = () => dispatch({ type: 'CLOSE_MODAL' });

  const openTutorial = () => {
    localStorage.setItem("tutorialDone", "false");
    dispatch({ type: 'UPDATE_PROGRESS', payload: 0 });
  };

  return [state, updateProgress, closeTutorial, openTutorial];
}