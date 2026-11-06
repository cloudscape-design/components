# OptionList PR (#5180): i18n namespace, tooltip Escape, page templates — verification (iteration 1)

Worktree `/Users/amanabiy/Documents/components/.worktrees/pr3-option-list`, branch `feat/add-option-list`, HEAD
ca4280cf5. Nothing committed (later step commits). `npm-lock-churn` stash untouched. `package-lock.json` not modified;
`pages/tsconfig.tsbuildinfo` (untracked, created by `tsc -p pages`) deleted.

## Proposed commits

1. `fix:` (or `feat:`) i18n namespace — `src/option-list/internal.tsx`, `src/i18n/messages-types.ts`,
   `src/i18n/messages/all.*.json` (15), the two i18n tests in `option-list.test.tsx`.
2. `test:` tooltip Escape — the Escape test in `option-list.test.tsx` (`git add -p` to split from 1).
3. `chore: Use page templates for OptionList dev pages` — `pages/option-list/permutations.page.tsx`.

## Fix 1: OptionList i18n namespace

- `internal.tsx`: `useInternalI18n('option-list')` and `i18n('i18nStrings.selectedAriaLabel', i18nStrings?.selectedAriaLabel)`.
  Key shape follows the `i18nStrings.*` prop path, like `multiselect` `i18nStrings.selectAllText` and `dialog`
  `i18nStrings.dismissAriaLabel`.
- Pattern source: `81007d585 feat: Add dialog component (#4904)` — new namespace added to `messages-types.ts` and every
  `all.<locale>.json`, with a real translation per locale, alphabetical position.
- Locale handling: all 15 locales (ar, de, en-GB, en, es, fr, id, it, ja, ko, pt-BR, th, tr, zh-CN, zh-TW) get
  `"option-list": { "i18nStrings.selectedAriaLabel": <that locale's select.selectedAriaLabel> }`, inserted between
  `multiselect` and `pagination`. Same meaning, so the existing translation is reused (e.g. en "Selected", de
  "Ausgewählt", ar "مُحدَّد").
- `messages-types.ts`: added `"option-list": { "i18nStrings.selectedAriaLabel": never; }` in the same position.
- `@i18n` tag on `i18nStrings` in `interfaces.ts` already present, unchanged.
- Snapshots: none changed (documenter, test-utils selectors/wrappers all pass unchanged).
- Tests (`option-list.test.tsx`, `describe('i18n provider')`, same file as the component tests like dialog does):
  provider message for `option-list` / `i18nStrings.selectedAriaLabel` is announced; `i18nStrings.selectedAriaLabel`
  prop wins over the provider.

## Fix 2: tooltip Escape (`listbox/parts/item.tsx` line 194)

Reachable: the internal Tooltip listens for `keydown` Escape on `window` (capture) and calls `onEscape`, which sets
`canShowTooltip=false`. Test "Escape closes the disabled reason tooltip and keeps the highlight and selection":
highlight the disabled option with a reason via ArrowDown, press Escape, tooltip is gone, highlight stays on the
option, `onChange` not called, selection unchanged. Same pattern as `src/select/__tests__/disabled.test.tsx`
"closes tooltip when Esc is pressed but leaves dropdown open".

## Change 3: page templates

- `permutations.page.tsx`: bare `<h1>` + `ScreenshotArea disableAnimations` replaced with
  `<PermutationsPage title="OptionList permutations" screenshotArea={{ disableAnimations: true }}>` (template used by
  `pages/dialog/permutations.page.tsx`, `pages/table/multi-column-sort.permutations.page.tsx` and others).
- `simple.page.tsx` and `scroll.page.tsx` already use `SimplePage` with `screenshotArea={{}}`, URL settings via
  `AppContext` (scroll); no hand-rolled header/wrapper left to drop. Unchanged. All ids / data-testids / headings the
  integ tests use are untouched.

## Coverage (`TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox --coverage --coverageThreshold='{}' --collectCoverageFrom='lib/components/internal/components/listbox/parts/item.js' --coverageReporters=text`, after `npm run quick-build`)

| File | stmts / branch / funcs / lines | uncovered lines |
|---|---|---|
| `item.tsx` before | 97.05 / 89.65 / 85.71 / 96.77 | 194 |
| `item.tsx` after | 100 / 89.65 / 100 / 100 | — |
| `option-list/internal.tsx` after | 100 / 93.1 / 100 / 100 | — |

## Commands and results

| Check | Command | Result |
|---|---|---|
| eslint | `npx eslint internal.tsx option-list.test.tsx messages-types.ts permutations.page.tsx` | clean |
| prettier | `npx prettier --check` same files + `all.*.json` | the 4 TS/TSX files: `internal.tsx`, test, page clean; `messages-types.ts` and 7 JSON files (ar, fr, ja, ko, th, tr, zh-CN; no newline at EOF) flagged, but they fail identically at HEAD (checked via `git show HEAD:<file> \| prettier --check`); generated/unformatted files, formatting preserved |
| quick-build | `npm run quick-build` | pass |
| full build | `npm run build` | pass (exit 0) |
| unit | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/i18n src/select src/multiselect` | 43 suites, 582 passed |
| unit `src/__tests__` | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__ --maxWorkers=1` | 16 suites, 2086 passed, 110 snapshots pass, none updated |
| pages TS | `npx tsc -p pages --noEmit` | only 2 errors, both in `node_modules/@formatjs/ecma402-abstract/utils.d.ts` (`Intl.ListFormat`, environment lib, unrelated); none in `pages/`. Pages also compile in `npm run build` (`buildPagesStatic`). tsbuildinfo deleted |
| integ | `npm run start:integ` + `PATH=/tmp/cd155/chromedriver-mac-arm64:$PATH NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/` | 12/12 OptionList integ tests pass (same `jest.integ.config.js` and window sizes as CI) |
| pages render | temp probe (deleted) loading `option-list/permutations`, `simple`, `scroll`, `scroll?container=dropdown`, `scroll?container=root` and waiting for `.screenshot-area` + `h1` | 5/5 pass (permutations: 52 listboxes) |

## Files changed

- `src/option-list/internal.tsx`
- `src/option-list/__tests__/option-list.test.tsx`
- `src/i18n/messages-types.ts`
- `src/i18n/messages/all.{ar,de,en-GB,en,es,fr,id,it,ja,ko,pt-BR,th,tr,zh-CN,zh-TW}.json`
- `pages/option-list/permutations.page.tsx`

## Behaviour notes

- Customers using `I18nProvider` messages for `select.selectedAriaLabel` no longer affect OptionList; they now use
  `option-list` / `i18nStrings.selectedAriaLabel`. The default text per locale is unchanged. OptionList is unreleased, so
  no customer depends on the old namespace.
- While the disabled-reason tooltip is shown, Escape is consumed by the tooltip (stopPropagation, existing Tooltip
  behaviour, same as in Select) and does not reach a parent. Once the tooltip has closed, the existing test "Escape is
  not handled and reaches the parent" covers propagation (not separately re-tested after a tooltip close).

## Commits
Local only, nothing pushed. Hooks ran normally (lint-staged eslint/prettier, git-secrets), both passed first try.
1. `a1e4900de fix: Use own i18n namespace in OptionList` — `src/option-list/internal.tsx`, `src/i18n/messages-types.ts`,
   `src/i18n/messages/all.*.json` (15), and only the i18n hunks of `src/option-list/__tests__/option-list.test.tsx`
   (`TestI18nProvider` import + `describe('i18n provider')`). Split by applying a filtered diff to the index
   (`git apply --cached --recount`), no `git add -p`.
2. `6e2b89147 test: Cover OptionList disabled reason tooltip Escape` — remaining hunk of `option-list.test.tsx`
   (the Escape test).
- Left uncommitted: `pages/option-list/permutations.page.tsx` (planned separate `chore:` commit), `.agents/`.
- `package-lock.json` unmodified, `pages/tsconfig.tsbuildinfo` absent, `npm-lock-churn` stash still `stash@{0}`.
- Post-commit: `jest src/option-list` 1 suite, 56 passed.
