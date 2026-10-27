---
name: add-api-resource
description: Add or update public v1/v2 API resources and actions in fintoc-node. Also use to assess whether new API fields require SDK changes.
---

# Add or update an API resource

## SDK model

Managers expose API operations and build request paths. Resources represent responses and provide instance behavior. The shared client handles HTTP, authentication, pagination, JWS signing, and idempotency.

Reuse `ManagerMixin` and `ResourceMixin` for standard behavior. Extend them only where the API contract requires it, and enable in `static methods` only the operations supported by that contract.

Use the relevant contract from [main-api.json](https://github.com/fintoc-com/fintoc-docs/blob/main/reference/main-api.json) or [core-api.json](https://github.com/fintoc-com/fintoc-docs/blob/main/reference/core-api.json) in `fintoc-docs`.

## Choose the scope

| Change | Implementation |
| --- | --- |
| New resource | Add its manager and resource, export them from the internal `index.ts` barrels of their folders (v1 resources have none; `src/index.ts` does not change), and register the manager in `src/lib/core.ts` for the appropriate API version. For v2, add a top-level re-export `src/lib/resources/<camelName>.ts` like `recipient.ts`, unless a v1 file with that name already exists. |
| New standard operation | Enable it in the existing manager's `static methods` when the shared implementation matches the contract. |
| New action | Add a manager method for its path, HTTP method, and response type, and list its name in `static methods`. |
| Nested resource | Add the resource and manager, registering access on the parent manager. |
| New field | Usually no change: requests and responses accept fields dynamically. Check whether custom mapping or behavior is needed. |

Resource classes are resolved by name from the top level of `src/lib/resources/`, not by API version. Write `static resource` in snake_case (`transfer_batch`): camelCase never resolves. A v2 class without a top-level re-export silently becomes a generic resource. If a top-level file with that name already exists, it belongs to v1: keep it, and note in the PR that v2 responses get the v1 class (with its `mappings` and getters).

Nested paths take their placeholders from the call arguments. Check that every operation you add resolves them, including `create`.

Resources returned by an action keep the action path, so `update()` or `delete()` on that instance hits the wrong URL. This is a known limitation: do not rely on it in code or tests.

## Tests

Follow the existing AVA conventions. Use `src/spec/integration.spec.ts` to exercise the public client with the mocked HTTP instance, checking request routing, parameter forwarding, and headers for the operations being added or changed.

Add a dedicated spec with fixtures, like `src/spec/recipients.spec.ts`, when response conversion, pagination, or instance operations are affected. Fixtures use made-up data. Authentication and JWS signing are covered by shared client tests; do not repeat them per resource. For `POST` operations, assert the `Idempotency-Key` header with and without `idempotency_key`, like the `transfers` tests.

Install dependencies with `yarn install --frozen-lockfile` (or `corepack yarn` if `yarn` is missing). Tests run against the compiled `build/main`, so build before running them. Run the affected tests with `npx ava build/main/spec/integration.spec.js -m 'fintoc.v2.<manager>.*'`, then the full suite and CI checks:

```sh
yarn build && yarn test
yarn lint
```

## Documentation and PR

Update the relevant README examples in English when public usage changes. Use `list`, not the deprecated `all`.

Follow the repository's PR template and record actual requirements or additional changes; use `None.` where there are none. Keep version bumps and releases separate from resource changes.
