import { Option, Tile } from "@/hooks/game_state/types";
import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<Option<Tile>>;
}

export function usePuzzle(id: string) {
  // Mock data
  const puzzle = [[7,9],[9,3],[3,5],[5,5],[5,6],[6,8],[8,2],[2,3],[3,6],[6,0],null,null,null,null,null,[8,4],[4,6],[6,9],[9,2],[2,2],[2,1],[1,1],[1,5],[5,4],[4,1],[1,0],[0,0],[0,2],[2,5],[5,7],[7,3],[3,3],[3,0],[0,4],[4,2],[2,6],null,null,null,null,null,null,[1,8],[8,9],[9,1],[1,7],[7,7],[7,0],[0,8],[8,7]];
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
