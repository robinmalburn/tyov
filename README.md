# Thousand Year Old Vampire Companion
`tyov` is a [companion web app](https://robinmalburn.github.io/tyov/) for [Thousand Year Old Vampire by Tim Hutchings](https://thousandyearoldvampire.com/).

## Current Functionality
The app is a local-first play companion for tracking rolls, prompts, and game state.

### Actions and Prompt Tracking
- Roll flow for `d10 - d6`, with current and previous roll shown.
- Automatic prompt progression after each roll.
- Manual prompt management:
  - Add prompts with visit count.
  - Set current prompt.
  - Increment/decrement visit count.
  - Remove non-current prompts.

### Save and Load
- Save state to:
  - Downloadable file (`save-game`).
  - Browser local storage (`save-game` key), when supported.
- Load state from file or local storage.
- Persisted state is serialized and versioned with migrations, so older saves can be upgraded to the current schema.

### Character, Skill, and Mark Management
- Characters:
  - Name, bio, immortal flag, dead/alive flag.
  - Quick toggle for dead/alive.
- Skills:
  - Add/edit/remove.
  - Quick toggle for checked/unchecked.
- Marks:
  - Add/edit/remove.

### Resources, Diaries, Memories, and Events
- Resources:
  - Add/edit/remove.
  - Track lost and stationary state.
- Diaries:
  - Add/edit/remove.
  - Track lost state.
  - Enforces one active (not lost) diary at a time.
- Memories:
  - Add/edit/remove.
  - Toggle forgotten/recovered.
  - Diarise/undiarise when an active diary exists.
  - Split views for active, forgotten, and diary memories.
- Events:
  - Add/edit/remove events linked to memories.

### Rule-Aware Constraints Implemented in App Logic
- Maximum of 5 active (non-forgotten, non-diarised) memories.
- Maximum of 3 events per memory (via UI controls).
- Active diary capacity of 4 memories.
- Active diary cannot be marked lost while it still has active diary memories.

### UX
- Inline validation and warning/error notifications.
- Responsive multi-pane layout for desktop and mobile usage.

## Tech Stack
- Vue 3 + TypeScript
- Pinia for state management
- Vite for build/dev tooling
- Tailwind CSS 4 for styling
- Vitest + `@vue/test-utils` + `jsdom` for unit tests

## Requirements
- Node.js `>=22 <23`
- pnpm (project uses `pnpm` lockfile)

## Development
Install dependencies:

```sh
pnpm install
```

Start local development server:

```sh
pnpm dev
```

Build for production:

```sh
pnpm build
```

Preview production build locally:

```sh
pnpm serve
```

Run unit tests:

```sh
pnpm test:unit
```

Run formatting checks:

```sh
pnpm lint
```

Auto-fix formatting:

```sh
pnpm lint:fix
```

Run type checks:

```sh
pnpm typecheck
```
