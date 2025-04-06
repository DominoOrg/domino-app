import { Option, Tile } from "@/hooks/game_state/types";
import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<Option<Tile>>;
}

export function usePuzzle(id: string) {
  // Mock data
  const puzzle = [null,null,null,null,[2,2],[2,1],[1,1],null];
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
