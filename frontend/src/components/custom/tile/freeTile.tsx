import { useDraggable } from "@/draganddrop/Draggable";

const FreeTile: React.FC<{
  tile: [number, number],
  index: number,
  imgClasses: string,
  n: number
}> = ({ tile, index, imgClasses, n }) => {
  let heighClass = "";
  console.log(n)
  switch(n) {
    case 3:
      heighClass = "h-24";
      break;
    case 6:
      heighClass = "h-12 md:h-24 lg:h-24 xl:h-28";
      break;
    case 9:
      heighClass = "h-10 md:h-16 lg:h-16 xl:h-20";
      break;
    default:
      break;
  }
  imgClasses += heighClass;
  const id = tile[0] + "" + tile[1];
  const ref = useDraggable({
    id,
    type: "freeTile",
    data: tile
  });

  return (
    <img
      ref={ref}
      id={id}
      key={index}
      src={
        "tile" +
        (tile[0] > tile[1]
          ? tile[0] + "" + tile[1]
          : tile[1] + "" + tile[0]) +
        ".png"
      }
      className={imgClasses}
    />
  );
};

export default FreeTile;
