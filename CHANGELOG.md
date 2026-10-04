# Changelog

Notable changes. Format follows [Keep a Changelog](https://keepachangelog.com/);
versions follow semver.

## [Unreleased]

## [1.0.0] - 2026-10-04

Shared Biome configuration — formatter, linter and import sorting — replacing
`@anarkisti/eslint-config` and Prettier in Node, React and plain web projects.
Requires `@biomejs/biome` 2.5 or later.

### Added

- **`@anarkisti/biome-config`** — Prettier-style formatting (2 spaces, double
  quotes, semicolons, trailing commas, 100 columns, LF); Biome's recommended
  rules; unused imports as errors, unused variables as warnings (`_` prefix
  ignored); sorted imports, `import type` for type-only ones.
- **`@anarkisti/biome-config/react`** — the base plus the React domain and
  `useComponentExportOnlyModules` (warn, constant exports allowed). Off in
  `routes/` and `*.test.tsx`/`*.spec.tsx`.
- **`useExhaustiveDependencies`** reports missing dependencies, not extra ones:
  a dependency an effect never reads is usually a deliberate re-run trigger.
- **Off for now** — `noNonNullAssertion`, `useButtonType` and the a11y
  interaction rules (`noStaticElementInteractions`, `useKeyWithClickEvents`,
  `useSemanticElements`, `noSvgWithoutTitle`, `noAutofocus`, `useMediaCaption`).

[Unreleased]: https://github.com/eetu/biome-config/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/eetu/biome-config/releases/tag/v1.0.0
