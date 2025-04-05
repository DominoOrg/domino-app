import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TutorialProvider } from "../hooks/tutorial/context"; // Import the tutorial provider
import { TimerProvider } from "../hooks/timer/context"; // Import the timer provider

export const Route = createRootRoute({
  component: () => (
    // TimerProvider must wrap TutorialProvider because TutorialProvider uses useTimer
    <TimerProvider>
      <TutorialProvider> {/* Wrap Outlet with the tutorial provider */}
        <Outlet />
      </TutorialProvider>
    </TimerProvider>
  ),
  errorComponent: (props) => <div>Some error occourred: {JSON.stringify(props)}</div>,
});
