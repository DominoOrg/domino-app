import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

type TutorialProps = {
  state: any,
  updateProgress: () => void,
  closeModal: () => void
}

const Tutorial: React.FC<TutorialProps> = ({ state, updateProgress, closeModal }) => {
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

export default Tutorial;