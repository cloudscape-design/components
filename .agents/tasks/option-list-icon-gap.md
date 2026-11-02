# OptionList: missing gap between icon and content

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-icon-gap`, branch `fix/option-list-icon-gap`, based on `origin/feat/add-option-list` (24524f9b9).
Commit: **87aa788fe** `fix: Add gap between icon and content in OptionList options`. It is the only commit on top of the base and has not been pushed.

## Root cause

The shared option renderer (`src/internal/components/option/index.tsx`) renders `option.__customIcon || <OptionIcon …/>`. `OptionIcon` is used for the built-in `iconName`/`iconUrl`/`iconSvg` of Select and Multiselect, and it wraps the icon in `<span class={option styles.icon}>`. That span has `padding-inline-end: awsui.$space-xs` (8px) and is the only source of the gap. A `__customIcon` is rendered as is. Its other callers bring their own wrapper: Token uses `styles.icon` and chart-filter uses `custom-icon-wrapper`. OptionList (`toInternalOptions` in `src/option-list/internal.tsx`) passed the consumer's raw `icon` node, so the `<Icon>` root sat directly against `.content`.

## Regression?

No. The pre-rebuild version (`backup/feat-add-option-list-origin-4925c401c`, which is also `save-pr-option-list`) has the same `__customIcon: icon` line, and its `src/option-list/styles.scss` contains only `.root`. Its deleted `listbox/parts/styles.scss` had no option-icon rule either, only `.selected-icon`. The shared option's `__customIcon` branch is the same in both versions. The gap was missing from the start.

## Fix

- `src/option-list/internal.tsx`: `__customIcon: icon && <span className={styles.icon}>{icon}</span>`. This applies to options and group headers. When there is no icon, there is no wrapper.
- `src/option-list/styles.scss`: new `.icon` rule with the same declarations as the shared option `.icon`: `padding-inline-end: awsui.$space-xs; align-content: center; display: flex; flex-shrink: 0`. It uses a design token and a logical property.
- Shared option, item, Select, Multiselect, Token and chart-filter code are untouched.

## Tests added

In `src/option-list/__tests__/option-list.test.tsx`:
- `wraps the icon in the icon slot that spaces it from the content`: the parent of the consumer's icon has the OptionList `styles.icon` class. Before the fix, the parent is the option element.
- `renders no icon slot when the option has no icon`.

jsdom cannot measure spacing, so the spacing was checked in the browser (below). `pages/option-list/permutations.page.tsx` already has `screenshotArea={{ disableAnimations: true }}` and includes the `withIcons` permutations, so visual regression covers it. No integ test was added.

## Measurements (details in `.agents/tasks/option-list-icon-gap/measurements.md`)

The table shows the visible gap between the icon glyph and the content, measured with `getBoundingClientRect`.

| Surface | Before | After |
|---|---|---|
| OptionList single (16 rows) and multi (24 rows), `option-list/permutations` | 0px | 8px |
| Select item (5 rows), `select/item.permutations` | 8px | 8px |
| Multiselect item (6 rows), `select/item.permutations` | 8px | 8px |
| Select dropdown opened, `select/screenshot` | 8px | 8px |
| Multiselect dropdown opened, `multiselect/disabled-reason` | 8px | 8px |

Screenshots are in `.agents/tasks/option-list-icon-gap/`: `before-*.png` and `after-*.png` (option-list single/multi, select item permutations, select dropdown, multiselect dropdown). The measurement script is `measure.cjs`, and the dev server launcher is `serve.sh`.

## Verification (all run in the worktree with `mise exec node@22.23.2 --`)

| Command | Result |
|---|---|
| Dev server `webpack serve --config pages/webpack.config.cjs --host 127.0.0.1 --port 8080` + `gulp watch` | `lsof` showed `TCP 127.0.0.1:8080 (LISTEN)` only. Both were stopped afterwards, and `lsof` confirmed 8080 is free |
| `npm run quick-build` | exit 0 |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/internal/components/listbox src/internal/components/option src/internal/components/selectable-item` | exit 0. 56/56 suites, 678/678 tests passed |
| `npm run build` | exit 0 |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | exit 0. 4/4 suites, 113 tests, 111/111 snapshots passed, none changed. The new `.icon` class is not a test-utils selector |
| `npx eslint src/option-list/internal.tsx src/option-list/__tests__/option-list.test.tsx` | exit 0 |
| `npx stylelint src/option-list/styles.scss` | exit 0 |
| `npx tsc -p tsconfig.json --noEmit` | exit 0 |
| `git checkout -- pages/tsconfig.tsbuildinfo package-lock.json` | done. Working tree is clean apart from the commit |
| `git commit` (pre-commit hooks ran, no `--no-verify`) | 87aa788fe |

## Bringing it into feat/add-option-list

```
git checkout feat/add-option-list
git cherry-pick 87aa788fe
```
