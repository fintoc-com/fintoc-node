Releasing
=========

1. From `main`, bump the package version, using `yarn bump! minor` (you can bump `patch`, `minor` or `major`).
2. Push the new branch to `origin`.
3. After merging the bumped version to `main`, make a Pull Request from `main` to `stable`. Make sure to include every change, using the template located at `.github/PULL_REQUEST_TEMPLATE/release.md`.
4. Merge the Pull Request.
