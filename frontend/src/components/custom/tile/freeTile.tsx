import { Tile, Option } from "@/hooks/game_state/types";
import { useFreeTile } from "@/hooks/game_state/useFreeTile";


const FreeTile: React.FC<{
  tile: Option<Tile>,
  index: number,
  imgClasses: string,
  n: number
}> = ({ tile, index, imgClasses, n }) => {

  let heighClass = "";
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
  const { style, attributes, listeners, setNodeRef } = useFreeTile(tile, index);
  
  return (
      <img
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={index}
        src={
          tile?
          ("tile" +
          (tile.left > tile.right
            ? tile.left + "" + tile.right
            : tile.right + "" + tile.left) +
          ".png")
          : "missing_tile.png"
        }
        className={imgClasses}
      />
  );
};

export default FreeTile;
