import { type Config, load } from "./config";

// Prettier's layout at 100 columns: double quotes, semicolons, trailing commas.
export const settings = (config: Config) => ({
  name: config.name,
  tags: ["aaaaaaaaaaaaaa", "bbbbbbbbbbbbbb", "cccccccccccccc", "dddddddddddddd", "eee"],
  load: () => load(config),
});
