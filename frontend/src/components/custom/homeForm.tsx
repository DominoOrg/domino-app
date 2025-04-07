import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { router } from "../../main";
import { formSchema } from "./formValidation";

function HomeForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      n: "6",
      difficulty: "2",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let response;
    let json;
    let c = Number(values.difficulty);
    do {
      const apiUrl = "api/select_puzzle?n=" +
        values.n +
        "&c=" +
        c;
      response = await fetch(apiUrl);
      json = await response.json();
      if (!json.id) c -= 1;
    } while (!json.id);
    if (json.id) {
      router.navigate({
        to: "/game",
        search: { puzzleId: json.id },
      });
    }
   };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 space-y-8 flex flex-col justify-center align-center"
      >
        <FormField
          control={form.control}
          name="n"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-font">Puzzle size</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Medium (28 tiles)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Small (8 tiles)</SelectItem>
                    <SelectItem value="6">Medium (28 tiles)</SelectItem>
                    <SelectItem value="9">Large (50 tiles)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the puzzle length, so determines how many tiles will be in total
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-font">Game difficulty</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Easy</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the puzzle difficulty, determines how hard is to reinsert the removed tiles
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" variant="default" className="w-full">
          Play
        </Button>
      </form>
    </Form>
  );
}

export default HomeForm;
