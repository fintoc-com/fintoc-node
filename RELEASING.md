# Releasing

Automático al mergear a `master` un PR con label `release:*`. Toma ~2–3 min.

## Cómo

1. Al PR agrégale un label `release:patch`, `release:minor` o `release:major`. Sin label no se publica.
2. Escribe las notas en la sección `## Release notes` de la descripción del PR, en inglés. Si queda vacía, se usan las notas autogeneradas de GitHub.
3. Mergea. El workflow **release** corre en el push a `master`.

Si se mergea otro PR a `master` antes de que parta el release, ese release falla antes de publicar, para no sacar los cambios del otro PR con el bump y las notas de este. Los cambios salen en el siguiente release; si necesitan un bump mayor, usa el manual.

### Manual

1. https://github.com/fintoc-com/fintoc-node/actions → **Release** → **Run workflow**.
2. `bump`: `patch` / `minor` / `major`. `release-notes`: markdown opcional; si va vacío, se usan las notas autogeneradas.
3. **Run workflow**. Solo corre desde `master`.

## Qué hace

`resolve` decide bump y notas (inputs del dispatch, o label y descripción del PR mergeado) →
checkout de `master` y, en push, chequeo de que no haya otros merges después del PR →
`yarn install` + `yarn build` →
[`release/prepare`](https://github.com/fintoc-com/release-action/tree/main/prepare) bumpea y pushea commit + tag a `master` (atómico) →
`npm publish` (OIDC) →
[`release/finalize`](https://github.com/fintoc-com/release-action/tree/main/finalize) crea el GitHub Release.

Todo autoreado por `fin-releases[bot]`.

## Si falla

| Falla en | Estado | Recovery |
|---|---|---|
| Antes o durante el push de `release/prepare` (por ejemplo, `master` avanzó) | Nada cambió: sin commit, tag ni paquete | Re-run desde la nueva punta de `master` (o esperar al siguiente release) |
| Entre el push y `npm publish` (notas autogeneradas o publish) | Commit y tag en `master`, sin paquete en npm | Publicar desde el tag (`git checkout vX.Y.Z`, `yarn install && yarn build`, `npm publish` con credenciales de npm) + `gh release create vX.Y.Z`; o saltarse la versión: el siguiente release parte desde ella |
| `release/finalize` (post-publish) | Paquete en npm, commit y tag en `master`, sin GitHub Release | `gh release create vX.Y.Z --notes '...'` |

Re-correr el job completo después de que el push llegó bumpea a la versión siguiente, porque `prepare` parte desde el commit de release que ya está en `master`.
