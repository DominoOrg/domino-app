import { useReducer } from "react";

export interface TutorialState {
  open: boolean;
  progress: number;
  title: string;
  description: string;
  gif?: string; // Changed to string for URL or null
  cta: string;
};

type Action =
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'TOGGLE_MODAL' }

const initialState: TutorialState = {
  open: localStorage.getItem("tutorialDone") === "false" || !localStorage.getItem("tutorialDone"),
  progress: 0,
  title: "Welcome",
  description: "This is a tutorial on how to play",
  gif: undefined,
  cta: "Continue"
};

const steps = [
  {
    progress: 0,
    title: "Welcome",
    description: "This is a tutorial on how to play.",
    gif: undefined,
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
      const newProgress = {
        ...steps.find(s => s.progress === action.payload) || steps[0],
        open: action.payload < steps.length
      };
      // Mark as done if progressing past the last step
      if (action.payload >= steps.length) {
        localStorage.setItem("tutorialDone", "true");
      }
      return newProgress;
    case 'TOGGLE_MODAL': {
      const newOpenState = !state.open;
      // If closing the modal, reset progress to the first step
      if (!newOpenState) {
        return { ...steps[0], open: newOpenState };
      }
      // Otherwise, just toggle the open state
      return { ...state, open: newOpenState };
    }
    default:
      return state;
  }
};

interface useTutorialReturn {
  state: TutorialState;
  updateProgress: () => void;
  toggleTutorial: () => void;
}

// Renamed function containing the actual logic
// Accept togglePause as an argument
function _internal_useTutorialLogic(togglePause: () => void): useTutorialReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Define updateProgress *inside* the hook logic function
  const updateProgress = () => {
    const newProgress = state.progress + 1;
    dispatch({ type: 'UPDATE_PROGRESS', payload: newProgress });
    // If completing the tutorial, toggle the pause state
    console.log("Update progress with progress == ",state.progress);
      if (newProgress > steps.length - 1) {
        console.log("Toggling pause");
        togglePause(); // Call togglePause ONCE on completion
    }
    // Removed the misplaced closing brace and duplicate call
  };

  // Define toggleTutorial *inside* the hook logic function
  const toggleTutorial = () => {
    dispatch({ type: 'TOGGLE_MODAL' });
    // Also toggle pause when tutorial is manually toggled via X or Close button
    togglePause(); // togglePause parameter is now in scope
  };

  // Return the state and the correctly scoped functions
  return { state, updateProgress, toggleTutorial };
}

// Export the internal logic function with a specific name
export { _internal_useTutorialLogic };

// The public hook now consumes the context
import { useTutorialContext } from './context';

// Default export is the hook that consumes the context
export default function useTutorial(): useTutorialReturn {
  return useTutorialContext();
}
