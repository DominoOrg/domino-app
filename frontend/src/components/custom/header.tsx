import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useTimer } from "@/hooks/timer/context";

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
  const { getElapsedTime } = useTimer();

  return (
      <div className="flex justify-center items-center">
        <div className="w-full flex justify-around items-center">
          <div className="flex flex-col justify-center">
            <p className="text-center text-primary">Size</p>
            <p className="text-center font-arial text-primary">Medium</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-center text-primary">Complexity</p>
            <p className="text-center font-arial text-primary">Medium</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-center text-primary">Elapsed time</p>
            <p className="text-center font-arial text-primary">{getElapsedTime()}</p>
          </div>
        </div>
      </div>
  );
}


function BreadcrumbDemo() {
  return (
    <Breadcrumb className="flex-start mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-lg">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-lg">Puzzle</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
