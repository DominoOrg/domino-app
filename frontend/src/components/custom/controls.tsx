import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useTimer } from "@/hooks/timer/context";
import useTutorial from "@/hooks/tutorial/useTutorial";
import { RotateCcw, Pause, Lightbulb, Check, HelpCircle, Play } from 'lucide-react';

export function Controls() {
  const { togglePause, isPaused } = useTimer();
  const { toggleTutorial } = useTutorial();

  return (<Menubar className="h-fit w-3/4 justify-around">
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary">
          <div className="flex flex-col justify-center items-center text-[10px]">
            <RotateCcw width={20}/>
            <p className="hidden md:block">ROLLBACK</p>
            </div>
          </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary" onClick={togglePause}>
          <div className="flex flex-col justify-center items-center text-[10px]">
            {isPaused ? <Play width={20}/> : <Pause width={20}/> }
            <p className="hidden md:block">{isPaused ? "RESUME" : "PAUSE"}</p>
            </div>
          </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary">
          <div className="flex flex-col justify-center items-center text-[10px]">
            <Lightbulb width={20}/>
            <p className="hidden md:block">HINTS</p>
            </div>
          </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="font-arial text-sm text-primary">
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
