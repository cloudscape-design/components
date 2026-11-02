# PR 2 verification: `refactor: Move list rendering and helpers into internal listbox`

Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-02`, branch `listbox/02-move-list-helpers`,
base `listbox/01-list-container-rename` (`de0b6293a`). Changes are staged under `src/` only, not committed.
`package-lock.json` (pre-existing, unrelated) and `.agents/` are left unstaged.

## 1. Diff is a pure move

`git -C <worktree> diff --cached -M --stat listbox/01-list-container-rename`

```
 src/autosuggest/internal.tsx                                      |  2 +-
 src/autosuggest/options-list.tsx                                  |  2 +-
 .../components/listbox}/__tests__/connect-options.test.ts         |  0
 .../components/listbox}/__tests__/get-item-props.test.ts          |  6 +++---
 .../components/listbox}/__tests__/scroll-to-index.test.ts         |  2 +-
 .../components/listbox}/__tests__/use-announcement.test.ts        | 10 +++++-----
 src/{select => internal/components/listbox}/parts/common.ts       |  0
 .../utils => internal/components/listbox/parts}/get-item-props.ts |  4 ++--
 .../components/listbox}/parts/option-group.tsx                    |  2 +-
 .../components/listbox/parts}/render-options.tsx                  | 18 +++++++++---------
 .../components/listbox/parts}/scroll-to-index.ts                  |  0
 .../utils => internal/components/listbox}/use-announcement.ts     |  6 +++---
 .../components/listbox}/utils/check-option-value-field.ts         |  2 +-
 .../components/listbox}/utils/connect-options.ts                  |  4 ++--
 src/multiselect/use-multiselect.tsx                               |  6 +++---
 src/prompt-input/components/menu-dropdown.tsx                     |  2 +-
 src/select/internal.tsx                                           |  4 ++--
 src/select/parts/plain-list.tsx                                   |  6 +++---
 src/select/parts/virtual-list.tsx                                 |  6 +++---
 src/select/utils/use-select.ts                                    |  2 +-
 20 files changed, 42 insertions(+), 42 deletions(-)
```

Renames (similarity): `connect-options.test.ts` 100%, `get-item-props.test.ts` 94%, `scroll-to-index.test.ts` 98%,
`use-announcement.test.ts` 94%, `parts/common.ts` 100%, `parts/get-item-props.ts` 80%, `parts/option-group.tsx` 91%,
`parts/render-options.tsx` 87%, `parts/scroll-to-index.ts` 100%, `use-announcement.ts` 93%,
`utils/check-option-value-field.ts` 94%, `utils/connect-options.ts` 89%.

Every changed `+`/`-` line in `git diff --cached -M` is an import statement (specifier change or a
`simple-import-sort` reorder applied by `eslint --fix`). No identifier, JSX, logic, comment or SCSS change.

`item.tsx` stays in `src/select/parts` (per plan: depends on `select/parts/styles.scss` and is a rewrite, not a
rename, on `backup-after-done`). `option-group.tsx` imports `../../../../select/parts/styles.css.js`, so no SCSS moved
and no CSS-module class names changed.

## 2. Build

- `npm run quick-build` (cwd = worktree): exit 0.
- `npm run build` (cwd = worktree, needed for documenter/style-docs snapshot suites): exit 0.

## 3. Lint

- `npx eslint --fix <changed files>` then `npx eslint <changed files>`: exit 0, no findings.
- `npx prettier --check <changed files>`: all files formatted.
- `npm run lint` (eslint . + stylelint): exit 0, 0 errors (32 pre-existing TODO/skip warnings in unrelated files).

## 4. Unit tests

- Targeted run before full build:
  `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox src/select src/multiselect src/autosuggest src/prompt-input src/button-dropdown src/internal/components/list-container src/__tests__/snapshot-tests --ci`
  -> 87/89 suites passed; the 2 failures were `documenter.test.ts` / `style-docs.test.ts` missing
  `lib/components-definitions` because only quick-build had run. Resolved by `npm run build`.
- Full suite after `npm run build`: `npm run test:unit` -> exit 0. 645/645 suites, 14147 passed, 162 skipped,
  snapshots 199 passed, none written, none obsolete.
- No snapshot changes, including `test-utils-selectors.test.tsx.snap`: no class/selector changed.

## 5. Integration tests

Not completed; the user asked to skip running them and will run them manually.

An attempt was made: port 8080 was taken by a dev server from the main checkout, so a temporary integ dev server was
started on `127.0.0.1:8081` with a temp jest config pointing `baseUrl` there. The run did not produce usable results:
WebDriver reported `session not created: This version of ChromeDriver ...` (installed Chrome is 155.0.8059.85), i.e.
a ChromeDriver/Chrome version mismatch, not a code failure. All temp files and processes were removed.

To run them yourself (from the worktree, with nothing else on port 8080):

```
cd /Users/amanabiy/Documents/components/.worktrees/listbox-02
npm i -g chromedriver            # must match the installed Chrome major version (155)
npm start                        # terminal 1: dev server on http://localhost:8080
# terminal 2:
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js \
  src/select/__integ__ src/multiselect/__integ__ src/autosuggest/__integ__ src/prompt-input/__integ__
```

Stop the main checkout's dev server first (it holds 8080), or the tests will hit the main checkout's code.

## 6. Commit

Commit: `e0a0ef858e2a78c920b4be77bcd256c10a47a760` (`e0a0ef858`) on `listbox/02-move-list-helpers`.
Subject: `refactor: Move list rendering and helpers into internal listbox`. Hooks ran normally (lint-staged
eslint --fix on 20 files, git-secrets); they made no further modifications, so no amend was needed.

`git log --oneline listbox/01-list-container-rename..HEAD`

```
e0a0ef858 (HEAD -> listbox/02-move-list-helpers) refactor: Move list rendering and helpers into internal listbox
```

`git log --oneline origin/main..HEAD`

```
e0a0ef858 (HEAD -> listbox/02-move-list-helpers) refactor: Move list rendering and helpers into internal listbox
de0b6293a (listbox/01-list-container-rename) refactor: Rename options-list to list-container
```

`git diff -M --stat listbox/01-list-container-rename` (compares the working tree, so it also shows the unstaged,
uncommitted `package-lock.json` from `npm install`; that file is NOT in the commit):

```
 package-lock.json                                         | 27 +++++++++++++-------------
 src/autosuggest/internal.tsx                              |  2 +-
 src/autosuggest/options-list.tsx                          |  2 +-
 .../components/listbox}/__tests__/connect-options.test.ts |  0
 .../components/listbox}/__tests__/get-item-props.test.ts  |  6 +++---
 .../components/listbox}/__tests__/scroll-to-index.test.ts |  2 +-
 .../listbox}/__tests__/use-announcement.test.ts           | 10 +++++-----
 .../components/listbox}/parts/common.ts                   |  0
 .../components/listbox/parts}/get-item-props.ts           |  4 ++--
 .../components/listbox}/parts/option-group.tsx            |  2 +-
 .../components/listbox/parts}/render-options.tsx          | 18 ++++++++---------
 .../components/listbox/parts}/scroll-to-index.ts          |  0
 .../components/listbox}/use-announcement.ts               |  6 +++---
 .../components/listbox}/utils/check-option-value-field.ts |  2 +-
 .../components/listbox}/utils/connect-options.ts          |  4 ++--
 src/multiselect/use-multiselect.tsx                       |  6 +++---
 src/prompt-input/components/menu-dropdown.tsx             |  2 +-
 src/select/internal.tsx                                   |  4 ++--
 src/select/parts/plain-list.tsx                           |  6 +++---
 src/select/parts/virtual-list.tsx                         |  6 +++---
 src/select/utils/use-select.ts                            |  2 +-
 21 files changed, 55 insertions(+), 56 deletions(-)
```

Commit-only (`listbox/01-list-container-rename HEAD`): 20 files changed, 42 insertions(+), 42 deletions(-), all under `src/`.
`git show --name-only HEAD` contains no `package-lock.json`, `tsbuildinfo`, `.agents/` or `.kiro/` paths.

Summary:
- Unit tests: `npm run test:unit` green after `npm run build`: 645/645 suites, 14147 passed, 162 skipped, 199
  snapshots passed, none written/obsolete.
- Integration tests: could not run. Skipped at the user's request; the one attempt failed to create a WebDriver
  session because ChromeDriver does not match installed Chrome 155 (environment issue, not a code failure).
- Deferred to later PRs: `select/parts/item.tsx` and `multiselect-item.tsx` (depend on `select/parts/styles.scss`,
  rewritten later in the stack); any SCSS move; `use-native-search.ts` stays in Select as Select-only typeahead;
  integration-test run (user to run manually with the commands above).
