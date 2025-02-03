import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<[number, number] | null>;
}

export function useGetPuzzle(id: string) {
  return useQuery({
    queryKey: ["get_puzzle"],
    queryFn: async (): Promise<Puzzle> => {
        let response;
        let json;
        // const baseApiUrl = import.meta.env.MODE =="development"? "http://localhost:8000/api": "https://domino.myddns.me/api";
        const baseApiUrl = "http://localhost:8000/api";
        const apiUrl = baseApiUrl + 
        "/get_puzzle_by_id?id=" +
        id;
        response = await fetch(apiUrl);
        json = await response.json();
        return json;  
    }
  })
}

export function useSelectPuzzle(n: string, c: string) {
  return useSuspenseQuery({
    queryKey: ["select_puzzle"],
    queryFn: async (): Promise<Puzzle> => {
      let response;
      let json;
        // const baseApiUrl = import.meta.env.MODE =="development"? "http://localhost:8000/api": "https://domino.myddns.me/api";
        const baseApiUrl = "http://localhost:8000/api";
        const apiUrl = baseApiUrl + 
        "/select_puzzle?n=" +
          n +
          "&c=" +
          c;
        response = await fetch(apiUrl);
        json = await response.json();
      return json;  
    }
  })
}