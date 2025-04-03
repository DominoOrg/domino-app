import { Option, Tile } from "@/hooks/game_state/types";
import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<Option<Tile>>;
}

export function usePuzzle(id: string) {
  // Mock data
  const json = {
    id: "0",
    tiles: [[2,4],[4,6],[6,8],null,null,null,[9,5],[5,3],[3,2],[2,6],[6,3],[3,0],[0,9],[9,7],[7,7],[7,5],[5,1],[1,1],[1,0],[0,2],[2,2],[2,1],[1,7],[7,0],[0,8],[8,1],[1,9],[9,8],[8,4],null,null,null,null,null,null,null,null,[0,0],[0,4],[4,7],[7,6],[6,6],[6,9],[9,9],[9,3],[3,1],[1,4],[4,5],[5,5],[5,2]].map((tile => {
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
        //const apiUrl = "api/get_puzzle_by_id?id=" +id;
        //const response = await fetch(apiUrl);
        //const json = await response.json();
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
