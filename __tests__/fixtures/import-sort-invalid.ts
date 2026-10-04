import { foo } from "./foo";
import { z } from "zod";
import { bar } from "./bar";

export const schema = z.object({ foo, bar });
