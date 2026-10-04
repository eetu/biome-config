import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Fixtures include a `.test.tsx` file to lint, not to run.
    exclude: [...configDefaults.exclude, "__tests__/fixtures/**"],
  },
});
