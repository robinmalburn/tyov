# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the Vue 3 application code.
  - `src/components/` shared UI components.
  - `src/lib/` utilities (storage, randomness, UUIDs, game state) in TypeScript.
  - `src/store/` Pinia stores.
  - `src/migrations/` save-state migrations.
  - `src/assets/` static assets.
  - `src/types/` global and ambient TypeScript declarations (e.g. Vue module shims).
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
- `pnpm lint` run ESLint on `.ts`, `.js` and `.vue` files.
- `pnpm lint:fix` run ESLint on `.ts`, `.js` and `.vue` files and fix issues where possible.
- `pnpm typecheck` run `vue-tsc` for TypeScript/Vue type checking.

## Coding Style & Naming Conventions

- Indentation: 2 spaces (match existing Vue component style).
- File naming: Vue components use `PascalCase.vue` (e.g., `ButtonComponent.vue`).
- Imports: use explicit `.vue` file extensions when importing Vue single-file components.
- Tests: `*.spec.js` and `*.spec.ts` under `tests/unit/` with folder mirroring `src/`.
- Linting: ESLint with `eslint-plugin-vue` (`eslint.config.mjs`). Run `pnpm lint` before opening a PR.
- Tailwind CSS is enabled (see `tailwind.config.js`); prefer utility classes over ad-hoc CSS.

## TypeScript Guidelines

- Prefer explicit types for public functions and store state.
- Avoid `any`; use `unknown` if necessary.
- Reuse existing types and interfaces before introducing new ones.

## State Management (Pinia)

- Stores live in `src/store/`.
- Prefer `defineStore` with the Composition API style.
- Keep stores focused on state and pure logic; UI concerns belong in components.
- Avoid side effects in getters wherever possible.
- Always ensure that state and getters do not shadow each others names, especially when derefencing state from entity factories. Where naming collisions occur, prefer renaming getters to semantically explain how they differe, e.g. `sortedPrompts` for the getter and `prompts` for state.

## Testing Guidelines

- Framework: Vitest with `@vue/test-utils` and `jsdom`.
- Naming: `Something.spec.js` / `Something.spec.ts` (see `tests/unit/components/` and `tests/unit/lib/`).
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

## Task Execution Rules

When given a task, follow these steps in order:

1. **Understand the task**
   - Restate the goal briefly.
   - Identify any relevant existing files before writing new code.

2. **Plan before coding**
   - Describe the minimal set of changes required.
   - Reuse existing patterns, utilities, and conventions.
   - Do not introduce new dependencies unless explicitly requested.

3. **Make changes**
   - Keep changes small and focused.
   - Do not refactor unrelated code.
   - Follow existing formatting and style.
   - Run `pnpm lint:fix` after changes to ensure style adherence.

4. **Tests**
   - Update or add tests where appropriate.
   - Ensure existing tests still pass.

5. **Verification**
   - State which commands should be run to verify the change
     (e.g. `pnpm test:unit`).

6. **Report**
   - Summarise what was changed.
   - Behavioural changes (if any).
   - Tests added or updated.
   - Call out any assumptions or follow-ups explicitly.

## When Unsure

- If requirements are ambiguous, ask for clarification before coding.
- Do not guess intended behaviour.
