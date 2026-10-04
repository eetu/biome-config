import { z } from "zod";

import { bar } from "./bar";
import { foo } from "./foo";

export const schema = z.object({ foo, bar });
