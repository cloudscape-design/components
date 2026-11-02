# PR 3 (OptionList) verification — implement pass 1

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-04`, branch `listbox/03-option-list`, base
  `listbox/02-selection-models` (`9185f55ad`). No review JSON existed → first (implement) pass.
- Nothing staged or committed (files brought in with `git checkout backup-after-done -- …` were unstaged with
  `git restore --staged`; `git diff --cached --stat` is empty). Not touched: `package-lock.json` (npm install only),
  `.agents/`, `pages/tsconfig.tsbuildinfo` (created by `tsc -p pages`, deleted), planning docs.
- Logs referenced below are in `/tmp/listbox-04-*.log`.

## Diff against the base

`git -C $W diff -M --stat listbox/02-selection-models` (tracked, modified): 15 files, +672 / −22 — including
`package-lock.json` (not part of the PR) and the three snapshots (+468 / +4 / +80). Untracked new files:
`pages/option-list/` (7 files), `src/option-list/` (index, interfaces, internal, styles, test-classes, `__tests__`,
`__integ__`), `src/test-utils/dom/option-list/index.ts`, `test/definitions/visual/option-list.ts`,
`src/internal/components/listbox/{use-listbox.ts,use-type-ahead.ts,index.tsx,parts/list.tsx,parts/item.tsx,parts/styles.scss,__tests__/use-type-ahead.test.ts}`.

Touched files outside option-list / pages / test-utils / visual / snapshots / listbox, with justification:

| File | Change | Why |
| --- | --- | --- |
| `build-tools/utils/pluralize.js` | `+ OptionList: 'OptionLists'` | test-utils generator needs the plural for `findAllOptionLists` (B's line). |
| `eslint.config.mjs` | scoped `@typescript-eslint/no-restricted-imports` block | Blocks runtime imports from `select/`/`multiselect/` in `src/option-list/**` and the five new engine files (type imports allowed). Scoped, not B's `listbox/**` glob, because `render-options`/`option-group` still import `select/parts` on this base. Comment does not reference the planning docs. |
| `src/__tests__/required-props-for-components.ts` | `'option-list': { options: [], selectionType: 'single' }` | Needed: base-props-support, ssr, use-base-component, use-telemetry-usage, outer-form-submit and test-utils functional suites crashed on `props.options.length` (first full run, `/tmp/listbox-04-unit.log`). |
| `src/internal/components/options-list/index.tsx` | `statusType?` + default `'finished'` (B doc comment); `onMouseLeave?` prop forwarded to the root | `useListbox.getListProps()` returns `onMouseLeave` and no `statusType`; its return type is `Omit<OptionsListProps,'children'>`. No existing caller passes `onMouseLeave` (re-grepped); `undefined`/`'finished'` both ≠ `'pending'`. No rename. |
| `src/internal/components/options-list/utils/use-keyboard.ts` | `closeDropdown?` + `if (closeDropdown) { stopPropagation; closeDropdown }` | OptionList passes no Escape handler; Escape must propagate to a surrounding Dropdown/Modal. Only existing caller (`select/utils/use-select.ts`) always passes a function → unchanged path. |
| `src/internal/components/selectable-item/{index.tsx,interfaces.ts,styles.scss}` | optional `hideTopDivider` → `.hide-top-divider` class + B's rule | OptionList hides the first row's top divider. Default `undefined` → class omitted, DOM identical for existing callers. B's `list-container` import in `interfaces.ts` NOT taken. |

Inside `listbox/` (existing files): `parts/scroll-to-index.ts` (+ test) = B (additive `scrollOptionIntoView`, default
export untouched); `parts/render-options.tsx` = base + optional `selectionType` (when set, renders the new listbox
`Item` with `selectionType`; when unset, unchanged `useInteractiveGroups ? MultiselectItem : Item`). B's version
rejected (would re-render Select/Multiselect rows with listbox styles).

`git diff listbox/02-selection-models --stat -- src/select src/multiselect src/autosuggest src/prompt-input src/button-dropdown`
→ empty. Reverse-import grep
`grep -rnE "option-list|listbox/(use-listbox|index|parts/list|parts/item|use-type-ahead)" src/{select,multiselect,autosuggest,prompt-input,button-dropdown}`
→ only `src/select/utils/use-select.ts:125: useUniqueId('option-list')` (pre-existing id prefix string, not an import).

## Backup comparison

`git diff --stat backup-after-done -- src/option-list src/internal/components/listbox src/test-utils/dom/option-list pages/option-list`
(on the working tree): 21 files, +196 / −100. Remaining differences:

- `src/option-list/internal.tsx`, `listbox/{index.tsx,use-listbox.ts,use-type-ahead.ts,parts/list.tsx,parts/item.tsx,__tests__/use-type-ahead.test.ts}`:
  only [A] adaptations (`list-container`→`options-list`, `use-highlighted-option`→`use-highlight-option`,
  `ListContainer(Props)`→`OptionsList(Props)`, `ListOption`→`DropdownOption`) and the resulting import re-sort.
  Grep for `list-container|ListContainer|\bListOption\b|use-highlighted-option|LISTBOX_` in these trees → 0 hits.
- `src/option-list/__tests__/option-list.test.tsx`: `+ expect(onChange).toHaveBeenCalledTimes(3);` (re-select contract).
- `listbox/parts/render-options.tsx`: base version + `selectionType` branch (above), not B's.
- `listbox/parts/styles.scss`: B minus `.option-group` and `.layout-strut` (unused by new files; Select keeps
  `select/parts/styles.scss`).
- `listbox/{parts/get-item-props.ts,parts/option-group.tsx,use-announcement.ts,utils/connect-options.ts,selection/**}`
  and their tests: untouched in this PR (PR 1/PR 2 base versions; differences are the B renames/`checkboxes`
  removal and PR 2's own changes).
- `src/test-utils/dom/option-list`, `pages/option-list`, `src/option-list/{index,interfaces,styles,test-classes,__integ__}`:
  identical to B.
- Three backup fixes present: `scrollStrategy: 'nearest'` + `scrollOptionIntoView` (5d5b1f7ba); focus entry +
  `onMouseDown` pointer flag only when focus moves in (88710936f); list-order multi focus entry and configurable
  scroll page (785cc27ce).

## Build, lint, format

| Command (cwd `$W`) | Result |
| --- | --- |
| `npm run quick-build` | exit 0 (tsc clean) |
| `npm run build` | exit 0 (53 s; only webpack size warnings) |
| `npx tsc -p pages/tsconfig.json --noEmit` | exit 2: 2 errors, both in `node_modules/@formatjs/ecma402-abstract/utils.d.ts` (`Intl.ListFormat`), none in repo files; the full `npm run build` (incl. pages build) passed. `tsconfig.tsbuildinfo` deleted. |
| `npx eslint --max-warnings 0 <changed dirs>` | first run: 3 `simple-import-sort` errors from the renames (item, list, use-listbox) → `eslint --fix` |
| `npm run lint` (eslint + stylelint, whole repo) | exit 0; 32 warnings, none in changed files |
| `npx stylelint` on option-list / listbox / selectable-item / pages scss | exit 0 |
| `npx prettier --check` on all 34 changed/new non-snapshot files | exit 0 (`.snap` files have no prettier parser) |
| `jest -c jest.build-tools.config.js` | 3 suites, 11 tests pass |

## Unit tests

| Command | Result |
| --- | --- |
| `jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/select src/multiselect src/autosuggest src/prompt-input src/button-dropdown` | 90 suites, 2337 passed, 1 skipped (no test edits in select/multiselect/autosuggest/prompt-input/button-dropdown/options-list) |
| `jest -u -c jest.unit.config.js src/__tests__/snapshot-tests` (after full build) | 5 updated, 1 written; documenter +468 (option-list definition + `OptionListWrapper`/`OptionListOptionWrapper`), wrappers +80 (OptionList import/export/find methods only), selectors +4 (only the new `"option-list": ["awsui_option_1kbcw", "awsui_root_1kbcw"]` block). No removed lines in any snapshot; no `select`/`options-list`/`selectable-item`/`option`/`multiselect`/`disabled-reason-tooltip` changes. style-docs passed after full build. |
| `npm run test:unit` (first run) | 6 functional suites failed on `option-list` (missing required props) → added `required-props-for-components.ts` entry |
| `jest -c jest.unit.config.js src/__tests__` | 16/17 suites; only `test-utils-wrappers` dom snapshot failed (known parallel flake, empty received) |
| `jest … src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` alone | 2/2 pass, snapshots pass |
| `TZ=UTC npm run test:unit` (final) | exit 0: 649 suites passed; 14246 passed, 162 skipped; 200 snapshots passed |

## Browser checks

Worktree dev server `webpack serve --config pages/webpack.config.integ.cjs --host 127.0.0.1 --port 8091`
(loopback only; :8080 not used or touched), Playwright-core + headless Chrome 155
(`/tmp/pw-overflow/listbox-04-probe.mjs`, log `/tmp/listbox-04-browser.log`): **50 PASS, 0 FAIL**, no page errors.

- `option-list/scroll`, container ∈ {page, wrapper-fixed, wrapper-max, root} × {single, multi} × preselected ∈
  {none, near-end, several}: Tab-in highlight correct and fully visible in every case (none → Option 1; near-end →
  Option 81; several: multi → Option 3 = first in list order, single → Option 81 because `singleSelection` only uses
  `selectedOptions[0]`, PR 2 contract). With none: ArrowDown ×40 → Option 41 visible; End → Option 100 visible.
- `option-list/in-dropdown?longList=true` (DIY select): mouse select Option 60 → reopen by click and by keyboard
  highlight Option 60, visible, `window.scrollY` 0→0; Escape closes (aria-expanded false) and returns focus to the
  trigger; keyboard select (ArrowDown ×5 + Enter) → Option 65 → reopen by keyboard and by click show Option 65,
  visible, scrollY unchanged.
- Sanity: real Select keyboard select works; real Multiselect click select (1 selected).
- `app-layout/global-scroll-padding` (#3798): opening the Select does not scroll the page (scrollY 0→0).

Server stopped afterwards (no listeners on 8091/8092/9515).

## Integration tests

ChromeDriver on PATH is 152 (Chrome 155). Resolved without global installs: the repo's own
`node_modules/.bin/browsers install chromedriver@155.0.8059.85 --path /tmp/listbox-04-chromedriver` (`npx --yes
@puppeteer/browsers` failed: npm registry login required). Integ `baseUrl` is hardcoded to `:8080`, so runs used
`/tmp/listbox-04-integ/jest.integ.config.js` (= repo config with a copy of `setup.integ.js` pointing at
`127.0.0.1:8091`; no repo file changed).

`PATH=<driver155>:$PATH NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c /tmp/listbox-04-integ/jest.integ.config.js <suite>`:

| Suite | Result |
| --- | --- |
| `src/option-list/__integ__/` | 1 suite, 20/20 pass |
| `src/select/__integ__/ src/multiselect/__integ__/ src/internal/components/options-list/__integ__/` | 10/11 suites, 128/129 pass. Failing: `async-select.test.ts` › virtualScrolling=true › "the bottom of the dropdown lines up with the highlighted option, when going down the list" (expected ≤ 3, received 32). Re-run alone: same. |
| Same `async-select.test.ts` against a baseline build of `listbox/02-selection-models` (`git archive` → `/tmp`, served on 127.0.0.1:8092) | same test fails with the same 32 → pre-existing (environment/Chrome 155), not caused by this PR. Baseline copy deleted. |
| `src/app-layout/__integ__/awsui-applayout.test.ts` (uses `global-scroll-padding`) | 29 pass, 1 skipped |

## Open before merge (not implemented, per plan section 7)

Listbox `id` forwarding; i18n namespace (`useInternalI18n('select')` kept); FormField integration; docs (re-select
`onChange`, no groups, when to use); "OptionList inside Dropdown" decision + VoiceOver comparison;
`OptionWrapper.findDisabledReason` does not find OptionList tooltips until PR 4/5; merged means released.
