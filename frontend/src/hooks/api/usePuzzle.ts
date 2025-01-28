import { useQuery } from "@tanstack/react-query";

export type Puzzle = {
  id: string;
  tiles: Array<[number, number] | null>;
}

export function usePuzzle(n: string, c: string) {
  return useQuery({
    queryKey: ["puzzle"],
    queryFn: async (): Promise<Puzzle> => {
      const baseApiUrl = import.meta.env.MODE =="development"? "http://localhost:8000/api": "https://domino.myddns.me/api";
      const apiUrl = baseApiUrl + 
      "/select_puzzle?n=" +
        n +
        "&c=" +
        c;
      const response = await fetch(apiUrl);
      return await response.json();
    }
  })
}