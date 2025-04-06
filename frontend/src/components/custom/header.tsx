import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useTimer } from "@/hooks/timer/context";

const Header = ({n, c}: {n: number, c: number}) => {
  return (
    <div className="w-3/4 flex flex-col justify-around gap-4">
      <BreadcrumbDemo />
      <HeaderLabels n={n} c={c}/>
    </div>
  );
};

export default Header;

function HeaderLabels({n, c}: {n: number, c: number}) {
  const { getElapsedTime } = useTimer();

  let size = "";
  switch (n) {
    case 3:
      size = "Small";
      break;
    case 6:
      size = "Medium";
      break;
    case 9:
      size = "Large";
      break;
    default:
      size = "";
  }

  let complexity = "";
  switch (c) {
    case 1:
      complexity = "Easy";
      break;
    case 2:
      complexity = "Medium";
      break;
    case 3:
      complexity = "Hard";
      break;
    default:
      complexity = "";
  }

  return (
      <div className="flex justify-center items-center">
        <div className="w-full flex justify-around items-center">
          <div className="flex flex-col justify-center">
            <p className="text-center text-primary">Size</p>
            <p className="text-center font-arial text-primary">{size}</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-center text-primary">Complexity</p>
            <p className="text-center font-arial text-primary">{complexity}</p>
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
