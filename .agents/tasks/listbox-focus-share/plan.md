# Plan: share list focus handling through `useListbox`

Goal: list-level focus/blur (and OptionList's pointer-down guard) live in `useListbox.getListProps`. Select, embedded
Multiselect and OptionList each select their current behavior through a `focus` setting. No behavior change for
Select or Multiselect. A later PR (not this one) unifies the settings.

Hard rules: no `git push`, no `--no-verify`, no `git reset --hard`, no `git rebase -i`, never port 8080, never touch
`/Users/amanabiy/Documents/components/.worktrees/option-list-rebase`. Always use absolute paths; relative paths
resolve against the parent workspace, not the worktree.

Worktrees:
- Part 1: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`, branch `refactor/use-listbox-in-select`, tip `c7d7fce91` (clean apart from untracked `pages/tsconfig.tsbuildinfo`, leave it).
- Part 2: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`, tip `0d4ac6cf5`.
- Both have `node_modules` (symlink) and `lib` present. Git is 2.54, so `git rebase --autosquash` works without `-i`.

## Verified current behavior (matches the task brief)

- `use-listbox.ts`: `BaseListProps = Pick<ListElementProps, 'id' | 'ref' | 'onMouseUp' | 'onMouseMove' | 'onKeyDown' | 'nativeAttributes'>`.
  `getListProps({ withKeyboard })` returns `{ id, ref: listRef, ...mouseHandlers }`, plus `onKeyDown` and
  `nativeAttributes: { 'aria-activedescendant': activeDescendantId }` with `withKeyboard`. `selectedSet = new Set(selectedOptions)`
  already exists inside the hook (connected options). The hook docstring says focus stays with callers (must be updated).
- `use-select.ts` `getMenuProps`: spreads `getListProps({ withKeyboard: !hasFilter })`, adds `open`, `statusType`; only
  when `embedded`: `onFocus = () => { if (!highlightedOption) goHomeWithKeyboard(); }`, `onBlur = () => resetHighlightWithKeyboard()`.
  `embedded` forces `hasFilter = false`, so embedded always has `withKeyboard: true`. Non-embedded: open effect + `focusActiveRef` + Dropdown `onBlur` (unchanged by this plan).
- Consumers of `getMenuProps`: `select/internal.tsx:258` (adds onLoadMore/aria*), `multiselect/use-multiselect.tsx:251` (adds onLoadMore/aria*/embedded), rendered via `select/parts/virtual-list.tsx` or `internal/components/listbox/parts/plain-list.tsx` into `OptionsList`. None set onFocus/onBlur/nativeAttributes/onMouseDown themselves.
- `OptionsList` (`src/internal/components/options-list/index.tsx`): spreads `{...nativeAttributes}` first, then its own `onKeyDown`/`onMouseMove`/`onMouseUp`/`onBlur`/`onFocus` (so nativeAttributes `onFocus`/`onBlur` would be overwritten). It has no `onMouseDown` prop and attaches no mousedown handler.
- No `OptionsList` consumer passes `nativeAttributes.onMouseDown` (checked: button-dropdown passes `{ id }`, autosuggest and prompt-input pass none, select/multiselect pass only aria-activedescendant).
- `OptionsList` is internal; `src/__tests__/snapshot-tests/__snapshots__/documenter.test.ts.snap` contains no `OptionsList`/`options-list` entry, and test-utils snapshots are about wrappers/selectors. Event handler props do not render into the DOM. So no snapshot changes are expected.
- `use-option-list.ts` (Part 2) is added by commit `014e62e01 feat: Add OptionList component`; it is touched by no later commit (91ac86328, 0d4ac6cf5 don't touch it, nor use-listbox.ts, options-list/index.tsx or use-select.ts). It currently: `pointerDown = useRef(false)`; puts `onMouseDown: () => (pointerDown.current = listRef.current !== document.activeElement)` inside merged `nativeAttributes`; `onFocus` reads+clears flag, returns if from pointer, else highlights `options.find(o => new Set(selectedOptions).has(o))` with keyboard or `goHomeWithKeyboard()`; `onBlur` clears flag and `resetHighlightWithKeyboard()`. `getRootProps` returns `{ onKeyDown: onTypeAhead, onMouseLeave }`.
- Discrepancies with the brief: none found.

## Chosen API (Part 1)

In `src/internal/components/listbox/use-listbox.ts`:

```ts
/**
 * Focus handling of a list that is a tab stop. Each setting keeps the current behavior of its component;
 * the settings will be unified in a follow-up.
 */
export interface ListFocusOptions {
  /**
   * Highlight set when the list gets focus.
   * - 'home-if-no-highlight': keeps an existing highlight, else highlights the first option (embedded Multiselect).
   * - 'first-selected-in-list-order-or-home': highlights the first selected option in list order, else the first
   *   option (OptionList).
   */
  entry: 'home-if-no-highlight' | 'first-selected-in-list-order-or-home';
  /**
   * When focus comes from a mousedown that moves focus into the list, keep the current highlight: the click that
   * follows sets the mouse highlight and selection. Adds `onMouseDown` to the list props.
   */
  skipAfterPointerDown?: boolean;
}

export type BaseListProps = Pick<
  ListElementProps,
  'id' | 'ref' | 'onMouseUp' | 'onMouseMove' | 'onMouseDown' | 'onKeyDown' | 'onFocus' | 'onBlur' | 'nativeAttributes'
>;

getListProps(options: { withKeyboard: boolean; focus?: ListFocusOptions }): BaseListProps;
```

Decisions:
- The pointer flag (`const pointerDown = useRef(false)`) lives in `useListbox`, next to `listRef`. Hooks must be unconditional; a `useRef` does not affect `useUniqueId`, so the list id is unchanged.
- `onFocus`/`onBlur` are returned only when `focus` is given; `onMouseDown` only when `focus.skipAfterPointerDown`. Without `focus` the returned object is exactly today's (existing `toEqual` tests keep passing).
- `OptionsList` gets a named `onMouseDown?: () => void` prop, attached as `onMouseDown={onMouseDown}` (raw, so `undefined` attaches nothing, same DOM as today). Reason: the user asked why handlers go through different channels; with a named prop all focus-related handlers are named props and `nativeAttributes` only carries `aria-activedescendant`. No consumer puts `onMouseDown` in `nativeAttributes`, so the named prop placed after the spread overrides nothing.
- `nativeAttributes` merging: `getListProps` keeps returning `nativeAttributes` only for `aria-activedescendant`; focus handlers never go into it. OptionList no longer builds `nativeAttributes` itself, so there is nothing to merge. Callers that add native attributes later must spread `baseListProps.nativeAttributes` (documented in the `getListProps` docstring).

Implementation of `getListProps` (keep `highlightedOption`, `options`, `selectedSet`, `highlight`, `listRef` from the same render, exactly like the current closures):

```ts
const pointerDown = useRef(false);
const getListProps = ({ withKeyboard, focus }: { withKeyboard: boolean; focus?: ListFocusOptions }) => {
  const listProps: BaseListProps = { id: listId, ref: listRef, ...mouseHandlers };
  if (withKeyboard) {
    listProps.onKeyDown = onKeyDown;
    listProps.nativeAttributes = { 'aria-activedescendant': activeDescendantId };
  }
  if (focus) {
    listProps.onFocus = () => {
      const fromPointer = pointerDown.current;
      pointerDown.current = false;
      if (fromPointer) {
        return;
      }
      if (focus.entry === 'home-if-no-highlight') {
        if (!highlightedOption) {
          highlight.goHomeWithKeyboard();
        }
        return;
      }
      // First selected option in list order, not selection order, as the ARIA listbox pattern describes.
      const selectedOption = options.find(option => selectedSet.has(option));
      if (selectedOption) {
        highlight.highlightOptionWithKeyboard(selectedOption);
      } else {
        highlight.goHomeWithKeyboard();
      }
    };
    listProps.onBlur = () => {
      pointerDown.current = false;
      highlight.resetHighlightWithKeyboard();
    };
    if (focus.skipAfterPointerDown) {
      // Only a mousedown that moves focus into the list counts: on an already focused list no focus event follows,
      // and the flag would leak into the next keyboard or programmatic focus.
      listProps.onMouseDown = () => {
        pointerDown.current = listRef.current !== document.activeElement;
      };
    }
  }
  return listProps;
};
```

`use-select.ts` `getMenuProps` becomes:

```ts
const menuProps: ListElementProps = {
  ...listbox.getListProps({
    withKeyboard: !hasFilter,
    // The embedded list is a tab stop. A dropdown list gets its highlight from the open effect below instead.
    focus: embedded ? { entry: 'home-if-no-highlight' } : undefined,
  }),
  open: isOpen,
  statusType,
};
return menuProps;
```

## Why Select / Multiselect behavior and snapshots stay identical

- Non-embedded Select and Multiselect: `focus` is `undefined`, so `getListProps` returns the same keys and values as today (no onFocus, onBlur, onMouseDown). `OptionsList` receives `onMouseDown={undefined}` → React attaches no listener; `onFocus`/`onBlur` wrappers are attached today already with `undefined` handlers and stay that way. Open effect, `focusActiveRef`, Dropdown `onBlur`/`onMouseDown` and trigger handlers are untouched.
- Embedded Multiselect: `onFocus` runs `pointerDown.current` read/clear (always `false`, because no `onMouseDown` is returned, so the flag is never set), then `if (!highlightedOption) goHomeWithKeyboard()` — identical to today. `onBlur` sets the flag to `false` (no observable effect) and calls `resetHighlightWithKeyboard()` — identical. `highlightedOption` and `goHomeWithKeyboard` are the same render values as the current closures in `use-select.ts` (they come from the same `listbox` object). No `onMouseDown` → same DOM listeners.
- Select with filter (`hasFilter`): unchanged; `focus` undefined, `withKeyboard` false.
- `useListbox` keeps the same hook order apart from one extra `useRef` after `listRef`; `useUniqueId` calls are unchanged so ids stay stable.
- Snapshots/documenter: `OptionsList` and `useListbox` are internal (not in `documenter.test.ts.snap`); new optional prop and handler props render no attributes. Expect zero snapshot diffs; if any appear, stop and investigate rather than updating with `-u`.

## Implementation Plan

- [ ] 1. Part 1: add the named `onMouseDown` prop to `OptionsList`.
      In `OptionsListProps` add `onMouseDown?: () => void;` after `onMouseMove` with a one-line doc ("Called on mousedown on the list."). Destructure `onMouseDown` after `onMouseMove`, and attach `onMouseDown={onMouseDown}` on `<Tag>` next to `onMouseUp` (after the `nativeAttributes` spread). Do not wrap it, so `undefined` attaches nothing.
      Files: /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox/src/internal/components/options-list/index.tsx
      Verify: `cd /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox && npx tsc -p src/tsconfig.json --noEmit` (or the repo's `npx tsc --noEmit` if that tsconfig path differs) — no errors.

- [ ] 2. Part 1: add `ListFocusOptions`, extend `BaseListProps`, implement `focus` in `getListProps` (code above), add `pointerDown` ref next to `listRef`.
      Update docs: `UseListboxApi.getListProps` docstring ("With `focus`, also `onFocus` and `onBlur` (and `onMouseDown` with `skipAfterPointerDown`), for a list that is a tab stop. Callers that add native attributes spread `nativeAttributes`."), and the `useListbox` docstring: list focus handling is shared through `getListProps({ focus })`; open state, filter, type-ahead and the highlight on open stay with callers. Place `ListFocusOptions` right after `BaseListProps` (keeps the edit away from the `onEscape`/`getParent` lines changed in Part 2's `e6a502d09`).
      Files: /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox/src/internal/components/listbox/use-listbox.ts
      Verify: type check as in item 1.

- [ ] 3. Part 1: switch the embedded branch of `getMenuProps` to the shared setting (code above); remove the manual `menuProps.onFocus`/`onBlur` block. Keep `goHomeWithKeyboard`, `resetHighlightWithKeyboard`, `highlightedOption` destructures (still used elsewhere: trigger keyboard, onClose, filter, return value); remove any that become unused per lint.
      Files: /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox/src/select/utils/use-select.ts
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select src/multiselect` — all pass, in particular `src/multiselect/__tests__/multiselect-embedded.test.tsx` and `src/select/__tests__/use-select.test.ts`.

- [ ] 4. Part 1: unit tests for the `focus` option in the existing `describe('getListProps')` of `use-listbox.test.tsx` (fixture: index 0 group header, 1 a, 2 disabled b, 3 c, 4 d; `interactiveGroups: false`, so home = index 1). Keep the two existing `toEqual` tests unchanged (they prove no `focus` → no new keys). Add:
      - without `skipAfterPointerDown` no `onMouseDown` is returned; with it, it is.
      - `home-if-no-highlight`: focus with no highlight → highlightedIndex 1, keyboard type; with a mouse highlight on 3 → stays 3; blur → -1.
      - `first-selected-in-list-order-or-home`: `selectedOptions: [d, c]` (multiSelection) → focus highlights index 3 (list order, not selection order); nothing selected → index 1.
      - `skipAfterPointerDown`: `onMouseDown()` while the list is not `document.activeElement` (listRef unattached → `null !== activeElement`) then `onFocus()` keeps the highlight (-1 stays -1); a second `onFocus()` without mousedown highlights (flag is cleared); `onMouseDown()` then `onBlur()` then `onFocus()` highlights (blur clears the flag).
      Call handlers inside `act()` and re-read `hook.result.current.getListProps(...)` after each act so closures are fresh.
      Files: /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox/src/internal/components/listbox/__tests__/use-listbox.test.tsx
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox src/internal/components/options-list` — pass.

- [ ] 5. Part 1: full checks and commit.
      Run `npx eslint src/internal/components/listbox src/internal/components/options-list src/select src/multiselect`, then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select src/multiselect src/internal/components src/autosuggest src/button-dropdown src/prompt-input src/__tests__/snapshot-tests` (snapshot tests must pass without `-u`; if documenter tests need a fresh build, run `npm run build` first, never port 8080). Then commit on `refactor/use-listbox-in-select`:
      `refactor: Share list focus handling through useListbox` with body: "getListProps takes a focus setting that returns onFocus, onBlur and, with skipAfterPointerDown, onMouseDown for a list that is a tab stop. Embedded Multiselect uses 'home-if-no-highlight', its current behavior; Select and Multiselect dropdowns pass no setting and are unchanged. OptionsList takes a named onMouseDown. The settings will be unified in a follow-up."
      Files: (commit only) — do not stage `pages/tsconfig.tsbuildinfo`.
      Verify: `git -C <part1> log --oneline -2` shows the new commit on top of `c7d7fce91`; `git status` clean apart from the untracked tsbuildinfo. Do NOT push.

- [ ] 6. Part 2: back up and rebase OptionList onto the new Part 1 tip.
      In `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`: `git branch backup/feat-add-option-list-v2-0d4ac6cf5 0d4ac6cf5`, then `git rebase --onto refactor/use-listbox-in-select c7d7fce91 feat/add-option-list-v2`.
      Conflict risk is low: `e6a502d09` edits `use-listbox.ts` at the `onEscape`/`getParent` prop docs (~lines 49-52), adds `const noParent` before the hook docstring, and changes the `getParent` default in the destructure; it edits `options-list/index.tsx` only at `statusType` (interface ~line 19, destructure ~line 66). Part 1 edits `BaseListProps`/`ListFocusOptions` (after the props interface), the `getListProps` docstring in `UseListboxApi`, the hook docstring (adjacent to `noParent`: the most likely conflict spot — resolve by keeping `noParent` and the new docstring text), the `listRef`/`getListProps` block, and the `onMouseMove`-adjacent lines in OptionsList. `use-listbox.test.tsx`: e6a502d09 adds an Escape test (~line 116), Part 1 adds tests in `getListProps` (~line 265). If a conflict happens, resolve keeping both sides, `git add`, `git rebase --continue`.
      Verify: `git log --oneline -5` shows the same 4 subjects on top of the new Part 1 commit; `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox` passes (old OptionList code still works, since it passes no `focus`).

- [ ] 7. Part 2: switch `useOptionList` to the shared focus setting.
      In `src/option-list/use-option-list.ts`: remove `useRef` import, `pointerDown`, the `nativeAttributes` override, and the manual `onFocus`/`onBlur`; drop `selectedOptions` from the `useListbox` destructure (now unused; keep `highlight`, used by `onMouseLeave` and type-ahead). Build list props as:
      ```ts
      const listProps: ListElementProps = {
        ...getListProps({
          withKeyboard: true,
          // Focus from a click keeps the current highlight; keyboard focus starts on the first selected option in
          // list order, or the first option.
          focus: { entry: 'first-selected-in-list-order-or-home', skipAfterPointerDown: true },
        }),
        open: true,
        embedded: true,
        isMultiSelect: selection.selectionType === 'multi' || undefined,
      };
      ```
      Keep `onMouseLeave` and type-ahead in `getRootProps` unchanged. Update the hook docstring: focus, blur and the pointer-down guard come from `useListbox`; this hook adds the tab stop settings, mouse-leave reset and type-ahead. Wiring: `internal.tsx` spreads `listProps` into `PlainList` → `OptionsList`, so `onMouseDown` now arrives through the named prop instead of `nativeAttributes` (same element, same event).
      Files: /Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox/src/option-list/use-option-list.ts
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list` — all pass, especially `highlight.test.tsx` ("focus from a pointer adds no highlight", "focus after selecting with the mouse...", "keyboard focus entry replaces a hover highlight ..."). No test edits should be needed; if one fails, the behavior is not identical — fix the code, not the test.

- [ ] 8. Part 2: fold into the commit that adds `use-option-list.ts` (`feat: Add OptionList component`, was `014e62e01`).
      `git add src/option-list/use-option-list.ts && git commit --fixup="$(git log --format=%H --grep='^feat: Add OptionList component$' -1)"`, then `GIT_SEQUENCE_EDITOR=: git rebase --autosquash refactor/use-listbox-in-select`.
      Verify: `git log --oneline refactor/use-listbox-in-select..HEAD` shows exactly 4 commits with the original subjects; `git show --stat HEAD~2` (feat commit) includes `use-option-list.ts`; `git diff backup/feat-add-option-list-v2-0d4ac6cf5 HEAD --stat` lists only the Part 1 files plus `use-option-list.ts`.

- [ ] 9. Part 2: final verification across the stack (in the Part 2 worktree).
      `npx eslint src/option-list src/internal/components/listbox src/internal/components/options-list src/select src/multiselect`; `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/select src/multiselect src/internal/components src/__tests__/snapshot-tests` — all pass with no snapshot updates. Optionally run OptionList integ tests only if a dev server on a non-8080 port is already available; otherwise skip and say so. Do NOT push either branch; report the new tips and the backup branch name.
