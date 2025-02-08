import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  errorComponent: (props) => <div>Some error occourred: {JSON.stringify(props)}</div>,
});
