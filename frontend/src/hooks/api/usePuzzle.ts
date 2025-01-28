import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<[number, number] | null>;
}

export function usePuzzle(n: string, c: string) {
  return useQuery({
    queryKey: ["puzzle"],
    queryFn: async (): Promise<Puzzle> => {
      let response;
      let json;
      do {
        // const baseApiUrl = import.meta.env.MODE =="development"? "http://localhost:8000/api": "https://domino.myddns.me/api";
        const baseApiUrl = "http://localhost:8080/api";
        const apiUrl = baseApiUrl + 
        "/select_puzzle?n=" +
          n +
          "&c=" +
          c;
        response = await fetch(apiUrl);
        json = await response.json();
        c = String(Number(c) - 1);
      } while (json.tiles.length == 0);
      return json;  
    }
  })
}