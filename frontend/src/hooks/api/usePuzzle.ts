import { Option, Tile } from "@/hooks/game_state/types";
import { useQuery } from "@tanstack/react-query";

type ApiPuzzle = {
  id: string;
  tiles: Array<[number, number] | null>;
  solution: Array<[number, number]>;
  n: number;
  c: number;
}

export type Puzzle = {
  id: string;
  tiles: Array<Option<Tile>>;
  solution: Array<Tile>;
  n: number;
  c: number;
}

export function usePuzzle(id: string) {
  // Mock data
  // const puzzle = [[5,5],[5,1],[1,3],[3,6],[6,2],[2,2],[2,3],[3,0],null,null,null,[3,3],[3,4],[4,4],[4,1],[1,1],[1,6],[6,6],[6,4],[4,5],[5,0],[0,4],[4,2],[2,1],[1,0],[0,0],[0,2],[2,5]];
  // const rawSolution = [[5,5],[5,1],[1,3],[3,6],[6,2],[2,2],[2,3],[3,0],[0,6],[6,5],[5,3],[3,3],[3,4],[4,4],[4,1],[1,1],[1,6],[6,6],[6,4],[4,5],[5,0],[0,4],[4,2],[2,1],[1,0],[0,0],[0,2],[2,5]];
  // const json = {
  //    id: "0",
  //    tiles:  puzzle.map((tile => {
  //      if(tile) {
  //        return new Tile(tile[0], tile[1]);
  //      } else {
  //        return null;
  //      }
  //    })),
  //    solution: rawSolution.map((tile) => new Tile(tile[0], tile[1])),
  //    n: 6,
  //    c: 2
  //  }
  // return json;
  return useQuery({
    queryKey: ["get_puzzle"],
    queryFn: async (): Promise<Puzzle> => {
        const apiUrl = "api/get_puzzle_by_id?id=" +id;
        const response = await fetch(apiUrl);
        const incomingJson: ApiPuzzle = await response.json();
        const json: Puzzle = {
          id: incomingJson.id,
          tiles: incomingJson.tiles.map((tile) => tile ? new Tile(tile[0], tile[1]) : null),
          solution: incomingJson.solution.map((tile) => new Tile(tile[0], tile[1])),
          n: incomingJson.n,
          c: incomingJson.c
        };
        return json;
      },
    })
}
