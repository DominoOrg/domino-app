import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import useTutorial from "@/hooks/tutorial/useTutorial";

const Tutorial = () => {
  const { state, updateProgress, toggleTutorial } = useTutorial();

  // Combined handler
  const handleToggle = () => {
    toggleTutorial();
  };

  return (<><Dialog open={state.open} onOpenChange={handleToggle}> {/* Use combined handler */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{state.title}</DialogTitle>
          <DialogDescription>
            {state.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {state.progress > 0 && <img src={state.gif} alt="tutorial gif"/>}
        </div>
        <DialogFooter>
          {/* Use combined handler */}
          {state.progress < 2 && <Button variant="outline" onClick={handleToggle}>Close</Button>}
          {/* Use updateProgress directly */}
          <Button type="submit" onClick={() => {
            updateProgress();
          }}>{state.cta}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>);
}

export default Tutorial;
