# Releasing

Manual desde Actions. Toma ~2–3 min.

## Cómo

1. https://github.com/fintoc-com/fintoc-node/actions → **Release** → **Run workflow**.
2. `bump`: `patch` / `minor` / `major`. `release-notes`: markdown opcional.
3. **Run workflow**. Solo corre desde `master`.

## Qué hace

`yarn install` + `yarn build` →
[`release/prepare`](https://github.com/fintoc-com/hermes/tree/main/.github/actions/release/prepare) bumpea local →
`npm publish` (OIDC) →
[`release/finalize`](https://github.com/fintoc-com/hermes/tree/main/.github/actions/release/finalize) pushea commit + tag, crea GitHub Release.

Todo autoreado por `fin-releases[bot]`.

## Si falla

| Falla en | Estado | Recovery |
|---|---|---|
| Antes o durante `npm publish` | Nada en el remote | Re-run |
| `release/finalize` (post-publish) | Paquete en npm, sin tag/release | `git push origin HEAD --follow-tags` + `gh release create vX.Y.Z` |
