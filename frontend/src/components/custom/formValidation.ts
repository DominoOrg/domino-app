import { z } from "zod"

export const formSchema = z.object({
    n: z.enum(["3", "6", "9"]).default("3"),
    difficulty: z.enum(["1", "2", "3"]).default("1"),
  });