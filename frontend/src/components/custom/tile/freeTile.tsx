import { Tile } from "@/utils/types/game_state";

const FreeTile: React.FC<{
  tile: Tile,
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
  const id = tile.left + "" + tile.right;
  
  return (
    <img
      id={id}
      key={index}
      src={
        "tile" +
        (tile.left > tile.right
          ? tile.left + "" + tile.right
          : tile.right + "" + tile.left) +
        ".png"
      }
      className={imgClasses}
    />
  );
};

export default FreeTile;
