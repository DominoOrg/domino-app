import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useReducer } from "react";

export default function Tutorial() {
  const initialState = {
    open: true,
    progress: 0,
    title: "Welcome",
    description: "This is a tutorial on how to play",
    gif: "",
    cta: "Continue"
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateProgress = () => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: state.progress + 1 });
  }
  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  }
  return (<Dialog open={state.open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{state.title}</DialogTitle>
          <DialogDescription>
            {state.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {state.progress > 0 && state.gif}
        </div>
        <DialogFooter>
          {state.progress < 2 && <Button variant="outline" onClick={closeModal}>Close</Button>}
          <Button type="submit" onClick={updateProgress}>{state.cta}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
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
    default:
      return state;
  }
};