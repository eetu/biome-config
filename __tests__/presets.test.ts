import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const biome = join(root, "node_modules", ".bin", "biome");
const fixture = (name: string) => join(__dirname, "fixtures", name);

type Diagnostic = { category: string; severity: string };

const check = (args: string[], cwd = root): Diagnostic[] => {
  const result = spawnSync(biome, ["check", "--reporter=json", ...args], {
    cwd,
    encoding: "utf8",
  });
  return JSON.parse(result.stdout).diagnostics;
};

const lint = (preset: "base" | "react", file: string) =>
  check([`--config-path=${preset}.json`, fixture(file)]).map((d) => d.category);

const readJson = (file: string) => JSON.parse(readFileSync(join(root, file), "utf8"));

/** Every leaf of `subset`, as a path, with its value. */
const leaves = (value: unknown, path = ""): [string, unknown][] =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, `${path}/${key}`))
    : [[path, value]];

describe("presets", () => {
  // Biome does not apply an `extends` inside an extended config, so react.json
  // repeats the base rather than extending it.
  it("react carries every base setting", () => {
    const react = new Map(leaves(readJson("react.json")));
    for (const [path, value] of leaves(readJson("base.json"))) {
      expect(react.get(path), path).toEqual(value);
    }
  });

  it("resolve from an app by package name", () => {
    const app = mkdtempSync(join(tmpdir(), "biome-config-"));
    mkdirSync(join(app, "node_modules", "@anarkisti"), { recursive: true });
    symlinkSync(root, join(app, "node_modules", "@anarkisti", "biome-config"));
    writeFileSync(join(app, "package.json"), '{ "name": "app", "private": true }');
    writeFileSync(join(app, "biome.json"), '{ "extends": ["@anarkisti/biome-config/react"] }');
    cpSync(fixture("react-refresh-invalid.tsx"), join(app, "component.tsx"));

    const categories = check(["component.tsx"], app).map((d) => d.category);

    expect(categories).toContain("lint/style/useComponentExportOnlyModules");
  });
});

describe("base", () => {
  it("formats like Prettier at the house width", () => {
    expect(lint("base", "format-valid.ts")).toEqual([]);
  });

  it("sorts imports", () => {
    expect(lint("base", "import-sort-invalid.ts")).toContain("assist/source/organizeImports");
    expect(lint("base", "import-sort-valid.ts")).toEqual([]);
  });

  it("errors on unused imports", () => {
    const diagnostics = check(["--config-path=base.json", fixture("unused-imports-invalid.tsx")]);
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ category: "lint/correctness/noUnusedImports", severity: "error" }),
    );
  });

  it("warns on unused parameters unless prefixed with _", () => {
    expect(lint("base", "unused-vars-invalid.ts")).toContain(
      "lint/correctness/noUnusedFunctionParameters",
    );
    expect(lint("base", "unused-vars-valid.ts")).toEqual([]);
  });

  it("allows non-null assertions", () => {
    expect(lint("base", "non-null-assertion.ts")).toEqual([]);
  });
});

describe("react", () => {
  it("checks hook dependencies", () => {
    expect(lint("react", "react-hooks-invalid.tsx")).toContain(
      "lint/correctness/useExhaustiveDependencies",
    );
    expect(lint("react", "react-hooks-valid.tsx")).toEqual([]);
  });

  it("keeps component modules fast-refreshable", () => {
    expect(lint("react", "react-refresh-invalid.tsx")).toContain(
      "lint/style/useComponentExportOnlyModules",
    );
    expect(lint("react", "react-refresh-valid.tsx")).toEqual([]);
    expect(lint("react", "react-refresh-constant.tsx")).toEqual([]);
  });
});
