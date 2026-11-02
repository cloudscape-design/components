# Move embedded list focus handling to #5239

Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`
Branch: `refactor/use-listbox-in-select` (not pushed)

- Backup branch: `backup/feat-add-option-list-v2-599443dd1` → `599443dd115cd62faa45ad9abc5cf0a43b28d69f`
- Starting tips verified: #5239 `c7d7fce91` (= origin), #5180 `599443dd1` with the 4 expected commits.

## New commit

`73f803b621c40dbf58e826d22c09fef208ccf93c` refactor: Share embedded list focus handling through useListbox

```
 .../__tests__/use-listbox.test.tsx     | 32 ++++++++++++++
 .../components/listbox/use-listbox.ts  | 26 ++++++++---
 src/select/utils/use-select.ts         | 12 +----
 3 files changed, 53 insertions(+), 17 deletions(-)
```

Taken from `4e25b0b13` (textually identical hunks): `BaseListProps` `onFocus | onBlur`,
`getListProps({ withKeyboard, embedded })` with the onFocus/onBlur handlers, the getListProps and hook
docstrings (no OptionList mention), `useSelect` passing `embedded` instead of its own handlers, and the
`focusEvent`/`blurEvent` helpers plus the `embedded` describe block in `use-listbox.test.tsx`.

Left in #5180 commit 1: optional `onEscape` (and its test), `getParent = noParent` default and its doc text,
and everything outside these three files.

## Checks (Node 22.23.2)

| Check | Result |
|---|---|
| `npm run quick-build` | pass (first run) |
| `npx tsc -p tsconfig.json --noEmit` | pass |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known @formatjs `Intl.ListFormat` errors |
| jest: select, multiselect, autosuggest, property-filter, listbox, options-list, selectable-item | 75 suites, 1181 tests passed; no Select/Multiselect tests edited |
| `npm run build` | pass |
| jest snapshot-tests (no `-u`) | 4 suites, 112 tests, 110 snapshots passed, unchanged |
| eslint on 3 changed files | pass |
| `git status` | clean except pre-existing untracked `pages/tsconfig.tsbuildinfo` (not tracked on this branch); `package-lock.json` unchanged |
