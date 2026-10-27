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

Releases are manual from GitHub Actions (see `RELEASING.md`). Do not bump the version in feature PRs.
