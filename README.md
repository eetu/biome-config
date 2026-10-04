# @anarkisti/biome-config

Shared [Biome](https://biomejs.dev) configuration — formatter, linter and import
sorting in one tool — for Node, React and plain web projects. Biome does not
depend on the `typescript` package, so it never holds back a TypeScript upgrade.

## Install

```bash
yarn add -D @anarkisti/biome-config @biomejs/biome
```

## Usage

`biome.json` next to the project's `package.json` (Biome resolves the preset
through it):

```jsonc
{ "extends": ["@anarkisti/biome-config"] }       // Node and plain web projects
{ "extends": ["@anarkisti/biome-config/react"] } // React
```

```jsonc
// package.json
"scripts": {
  "lint": "biome check src",
  "lint:fix": "biome check --write src"
}
```

`biome check` covers formatting, linting and import order in one pass.

## What the presets set

- **Formatting** in Prettier's style: 2 spaces, double quotes, semicolons,
  trailing commas, 100 columns, LF.
- **Linting**: Biome's recommended rules, plus unused imports as errors and
  unused variables as warnings (`_`-prefixed names are ignored). Non-null
  assertions are allowed. `useButtonType` and the a11y interaction rules
  (`noStaticElementInteractions`, `useKeyWithClickEvents`, `useSemanticElements`,
  `noSvgWithoutTitle`, `noAutofocus`, `useMediaCaption`) are off for now.
- **Imports** sorted; type-only imports become `import type`, mixed ones keep
  inline `type` specifiers.
- **React** (`/react`): the React domain, and `useComponentExportOnlyModules`
  (warn, constant exports allowed) for fast refresh.
  - `useExhaustiveDependencies` reports missing dependencies but not extra ones:
    a dependency the effect never reads is usually there to re-run it, and
    Biome's fix would delete it.
  - The fast-refresh check is off in `routes/` and `*.test.tsx`/`*.spec.tsx`.
    File routes keep their components local (the router hot-reloads them), and
    tests never hot-reload.

Each preset is self-contained: Biome does not apply an `extends` inside an
extended config, so `react.json` repeats `base.json`, and a test keeps the two
in sync.

The presets leave `vcs` off: `vcs.useIgnoreFile` fails outright when the config's
folder has no `.gitignore`. A project that checks its whole tree lists exclusions
in `files.includes` (`["**", "!sdks", "!build"]`).

A project's `files.includes` replaces a preset's rather than merging with it, so
exclusions live in the project. `overrides` do merge: a project's own overrides
apply alongside the preset's.

## Svelte

Svelte apps stay on `@anarkisti/eslint-config`, since `svelte-check` holds them
at TypeScript 6 either way. Biome 2.5's experimental Svelte support compiled to
identical components across the fleet with `html.formatter.whitespaceSensitivity:
"strict"`, and needs `noUnusedVariables` off for `*.svelte` (it misses variables
used only in markup).
