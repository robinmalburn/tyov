# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the Vue 3 application code.
  - `src/components/` shared UI components.
  - `src/lib/` utilities (storage, randomness, UUIDs, game state).
  - `src/store/` Pinia stores.
  - `src/migrations/` save-state migrations.
  - `src/assets/` static assets.
- `tests/unit/` contains Vitest unit tests.
- `dist/` is the production build output (generated).
- Root config files include `vite.config.mjs`, `tailwind.config.js`, and `eslint.config.mjs`.

## Build, Test, and Development Commands

Use pnpm (preferred package manager in `package.json`).

- `pnpm install` install dependencies.
- `pnpm dev` run Vite dev server with hot reload.
- `pnpm build` create a production build in `dist/`.
- `pnpm serve` preview the production build locally.
- `pnpm test:unit` run Vitest unit tests.
- `pnpm lint` run ESLint on `.js` and `.vue` files.

## Coding Style & Naming Conventions

- Indentation: 2 spaces (match existing Vue component style).
- File naming: Vue components use `PascalCase.vue` (e.g., `ButtonComponent.vue`).
- Tests: `*.spec.js` colocated under `tests/unit/` with folder mirroring `src/`.
- Linting: ESLint with `eslint-plugin-vue` (`eslint.config.mjs`). Run `pnpm lint` before opening a PR.
- Tailwind CSS is enabled (see `tailwind.config.js`); prefer utility classes over ad-hoc CSS.

## Testing Guidelines

- Framework: Vitest with `@vue/test-utils` and `jsdom`.
- Naming: `Something.spec.js` (see `tests/unit/components/` and `tests/unit/lib/`).
- Focus on unit coverage for components, lib utilities, and migrations. Update/extend tests alongside logic changes.

## Commit & Pull Request Guidelines

- Commit messages are short, sentence-case, and present tense, often ending with a period (e.g., “Fixes eslint dependencies.”).
- Keep commits scoped and descriptive; avoid bundling unrelated changes.
- PRs should include:
  - A brief summary of changes and rationale.
  - Any related issues or references.
  - Screenshots or recordings for UI changes where it clarifies behavior.

## Configuration & Security Notes

- Persisted data uses local storage; migrations live in `src/migrations/`.
- If you change save formats, add a migration and tests in `tests/unit/migrations/`.
- Dependency changes: only add or upgrade dependencies with explicit maintainer permission.
