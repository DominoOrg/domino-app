import { Option, Tile } from "@/hooks/game_state/types";
import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<Option<Tile>>;
}

export function usePuzzle(id: string) {
  // Mock data
  const puzzle = [[5,5],[5,6],[6,3],[3,1],[1,2],[2,2],[2,8],[8,5],[5,9],[9,8],[8,7],[7,5],[5,4],[4,2],[2,6],[6,7],[7,0],[0,8],[8,6],[6,0],[0,2],[2,3],[3,5],[5,2],[2,9],[9,1],null,null,[4,1],[1,0],[0,0],[0,3],[3,7],[7,7],[7,9],null,null,[3,4],[4,6],[6,6],null,null,null,null,null,null,null,[8,1],[1,1],[1,5]];
  const json = {
     id: "0",
     tiles:  puzzle.map((tile => {
       if(tile) {
         return new Tile(tile[0], tile[1]);
       } else {
         return null;
       }
     })),
   }
  return json;
  /*return useQuery({
    queryKey: ["get_puzzle"],
    queryFn: async (): Promise<Puzzle> => {
        const apiUrl = "api/get_puzzle_by_id?id=" +id;
        const response = await fetch(apiUrl);
        const json = await response.json();
          json.tiles = json.tiles.map((tile: [number, number] | null) => {
          if(tile) {
            return new Tile(tile[0], tile[1]);
          } else {
            return null;
          }
        });

    return json;
    }
  })*/
}
