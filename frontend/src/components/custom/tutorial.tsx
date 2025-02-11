import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import useTutorial from "@/hooks/tutorial/useTutorial";

const Tutorial = () => {
  const [state, updateProgress, closeModal, openTutorial] = useTutorial();

  return (<><Dialog open={state.open}>
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
    </Dialog>
    <div className="w-screen flex justify-end px-6">
      <HelpCircle onClick={openTutorial}/>
    </div>

    </>);
}

export default Tutorial;