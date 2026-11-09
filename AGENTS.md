# AGENTS.md

`fintoc` is the official Node SDK for the Fintoc API, written in TypeScript. `fintoc-cli` depends on it, so new resources reach the CLI only after a release.

## Commands

- `yarn build`: compiles to `build/main` and `build/module`.
- `yarn test`: runs AVA over `build/main`, so build first.
- `yarn lint`: ESLint with `--max-warnings 0`.

If `yarn` is missing, use `corepack yarn`.

## Skills

Skills live in `.agents/skills/`. `.claude/skills` is a symlink to that folder, so edit them only there.

- `add-api-resource`: add or update an API resource (manager, resource, `core.ts`, tests, README and PR).

## Releases

Merging a PR to `master` with a `release:patch|minor|major` label publishes a release, with notes from the PR's `## Release notes` section (see `RELEASING.md`). Do not bump the version in feature PRs.

Pick one label by what SDK users get:

- `release:minor`: new resources, methods, parameters or fields.
- `release:patch`: fixes to existing behavior, with no new public surface.
- `release:major`: removes or renames something public, or changes it incompatibly.
- No label: changes SDK users don't get, such as tests, CI, docs or agent files.

Write `## Release notes` in English for SDK users: one bullet per change, naming what changed
(resource, method, field or error), without internal details.
