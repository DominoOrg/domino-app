import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useGame } from "@/hooks/game_state/useGame";
import { useTimer } from "@/hooks/timer/context";
import { useState } from "react";

const Header = () => {
  return (
    <div className="w-3/4 flex flex-col justify-around gap-4">
      <BreadcrumbDemo />
      <HeaderLabels />
    </div>
  );
};

export default Header;

function HeaderLabels() {
  const { getElapsedTime, togglePause, isPaused } = useTimer();

  return (
      <div className="flex justify-center items-center">
        <div className="w-full flex justify-around items-center">
          <div className="flex flex-col justify-center">
            <p className="text-center">Size</p>
            <p className="text-center">Medium</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-center">Complexity</p>
            <p className="text-center">Medium</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-center">Elapsed time</p>
            <p className="text-center">{getElapsedTime()}</p>
          </div>
          <button onClick={togglePause}>{!isPaused? "Pause" : "Resume"}</button>
        </div>
      </div>
  );
}


function BreadcrumbDemo() {
  return (
    <Breadcrumb className="flex-start">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Puzzle</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
