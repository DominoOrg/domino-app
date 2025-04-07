import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useGame } from "@/hooks/game_state/useGame";
import { useTimer } from "@/hooks/timer/context";
import useTutorial from "@/hooks/tutorial/useTutorial";
import { Pause, Check, HelpCircle, Play } from 'lucide-react';

export function Controls() {
  const { togglePause, isPaused } = useTimer();
  const { toggleTutorial } = useTutorial();
  const { solvePuzzle } = useGame();

  return (<Menubar className="h-fit w-3/4 justify-around shadow-lg">
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary" onClick={togglePause}>
          <div className="flex flex-col justify-center items-center text-[10px]">
            {isPaused ? <Play width={20}/> : <Pause width={20}/> }
            <p className="hidden md:block">{isPaused ? "RESUME" : "PAUSE"}</p>
            </div>
          </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary" onClick={solvePuzzle}>
          <div className="flex flex-col justify-center items-center text-[10px]">
            <Check width={20}/>
            <p className="hidden md:block">AUTO-SOLVE</p>
            </div>
          </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary" onClick={() => {
          togglePause();
          toggleTutorial();
          }}>
          <div className="flex flex-col justify-center items-center text-[10px]">
            <HelpCircle width={20}/>
            <p className="hidden md:block">HELP</p>
          </div>
        </MenubarTrigger>
    </MenubarMenu>
  </Menubar>);
}
