# Design review: unified listbox spec and plan (revision 4)

Reviewed: `listbox-unified-spec.md` and `listbox-unified-plan.md` (revision 4, answering the third review), against
`listbox-unified-setup.md`, `listbox-stack-plan.md` and the code at `feat/add-option-list` = `4c06e5e9f`.
Read-only: `git show`, `git log`, `git grep`, `git rev-parse`, `git branch --list`, `git stash list`,
`git status --short` in the worktree. No branch, worktree, backup or stash was changed. No tests were run.

**Verdict: APPROVED** (0 HIGH, 0 MEDIUM, 3 NIT)

All 4 findings from the third review are addressed, and I re-checked each against the code and the git commands
the plan runs (see Verified assumptions). The rewritten FAILPROOF step 4 now handles modified, staged-new and
untracked-new test files on separate paths, and I walked step 10 through it command by command without finding a
failure. The NITs below are small robustness and clarity gaps. None of them can produce a wrong commit, because the
plan either stops or `tsc` fails first.

## Findings

### 1. NIT: FAILPROOF step 4 doesn't list `__integ__` files, so step 5 (A) would stop if it took that path

Where: plan FAILPROOF steps 1, 4a and 4b; plan step 5.

`5f8b96389` modifies `src/multiselect/__integ__/multiselect.test.ts` (`git show 5f8b96389 --name-status`). Step 1
excludes `__integ__` from `.files`, and step 4a only lists `**/__tests__/**`. If step 5 ever reached FAILPROOF
step 4, the 4a check ("every line of `git status --short` names a file in `.files`, `.mod-tests` or `.new-tests`;
stop if not") would stop on the integ file, and 4b's "`git status --short` must now be empty" could not hold. I
traced every A test against the parent's `findMatchingOption` (whole-list `filterOptions`): all of them fail on
the parent, so step 5 is not expected to take step 4, and the procedure stops safely rather than corrupting
anything. It is still a latent gap.

Fix: in 4a, build `.mod-tests` with `-- '**/__tests__/**' '**/__integ__/**'` (and the same for the two new-file
lists), so integ changes are saved, reset and restored with the test files. The integ file is never in a `test:`
commit, because it holds no passing unit test.

### 2. NIT: `useSelect` order puts the core call before `hasFilter`, which the core's arguments need

Where: spec section 3, "`useSelect` after" ("Order inside `useSelect`: `useListboxCore`, `useOpenState`,
`closeDropdownIfNecessary`, `handleEscape`, the remaining refs, effects and prop getters as today"); plan step 14.

The core call reads `hasFilter` (`spaceSelects: hasFilter ? …`, `preventNativeHomeEnd: !hasFilter`). On the base,
`hasFilter` is a plain `const` at `use-select.ts:89`, after the refs. Read literally, the order puts the core call
before that `const`. `tsc` would report TS2448 (use before declaration), so the mistake can't get committed, but
the spec should say what goes first.

Fix: write the order as "the plain derived values (`hasFilter`, `isDialog`) and refs as today, then
`useListboxCore`, `useOpenState`, `closeDropdownIfNecessary`, `handleEscape`, then the rest as today". The local
`isHighlightable` and `interactivityCheck` are removed, because the core owns them.

### 3. NIT: the embedded Multiselect Home/End change has no test

Where: spec section 1 intentional-changes table ("Home/End … Multiselect: same (also embedded)"); risk 11.

Embedded Multiselect has `hasFilter === false` (`hasFilter = filteringType !== 'none' && !embedded`), so it now
prevents Home/End on its list. I checked that this is correct. In `property-filter/property-editor.tsx:93` the
embedded list is a separate focus target from the autosuggest input, and the menu's `onKeyDown` is attached only to
the list, so the text input's cursor keys are not affected. But no test pins this. `home-end.test.tsx` in
`6792d0dc3` covers only the standalone Multiselect, and risk 11's guard ("property-filter unit tests") passes with
or without prevention.

Fix: in step 10, add one case to `src/multiselect/__tests__/home-end.test.tsx` that renders `EmbeddedMultiselect`
(as `multiselect-embedded.test.tsx` does) and asserts `fireEvent.keyDown(list, { keyCode: END })` returns `false`.
It fails on the parent on that assertion, so it belongs in the fix commit. Alternatively, state in risk 11 that the
embedded case is covered only by code reading.

## Verified assumptions

- `feat/add-option-list` = `4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047`, and `feat/listbox-unified` = `9a6541a01`. It
  is the only `*listbox-unified*` branch, and its worktree is clean. `stash@{0}` is still the
  "backup: listbox-test-dedup uncommitted OptionList tests" entry.
- Third-review finding 1 (FAILPROOF and staged new files), walked through for step 10:
  - `6792d0dc3` gives `M use-keyboard.test.ts`, `A` for both `home-end.test.tsx`, plus hand-edited
    `keyboard.test.tsx` and `use-listbox.ts`. After step 1, the product files are reset in both index and worktree.
    After step 3, they are modified only in the worktree.
  - 4a: `git diff HEAD --diff-filter=A` lists index-added files, which `git diff HEAD` compares as tracked, so both
    `home-end.test.tsx` land in `.staged-new-tests`. `--diff-filter=M` gives the two modified test files. Git's
    default pathspec wildcards let `*` cross `/`, so `'**/__tests__/**'` matches `src/select/__tests__/…`.
  - 4b: after `git rm --cached` and `rm`, every path passed to `git checkout HEAD --` exists in `HEAD`, so the
    pathspec error from the earlier revision can't happen. Status is empty.
  - 4d: the step-c commit leaves the index clean, so `git apply --3way` (index mode) can run. The
    `use-keyboard.test.ts` hunk conflicts with the trimmed describe that step c appended at the same EOF position.
    The plan anticipates this ("keep one copy of each"). `cp -R` restores the full new files, and the product patch
    applies, because the `test:` commit didn't touch product files.
  - The three tests named as passing on the parent do pass there: the parent `useMenuKeyboard` never calls
    `preventDefault` for HOME/END, so `fireEvent.keyDown` returns `true` and `preventDefault` isn't called. The
    "without filtering", `preventNativeHomeEnd: true` and restored OptionList cases fail on assertions.
- Third-review finding 2: plan step 0.4 baselines FUNC, and step 14 compares against it.
- Third-review finding 3: `interactivityCheck` is at `use-select.ts:83` and `use-listbox.ts:85` on `4c06e5e9f`. The
  spec's corrected numbers are right. `highlightOption: highlightOptionWithKeyboard` is at `use-select.ts:343`.
- Third-review finding 4: plan step 0.3 now rewrites both the Branch and Base lines of the setup file.
- FAILPROOF failures are on assertions, not compilation. `tsconfig.json` excludes `**/__tests__/**`, so QB on the
  parent product code doesn't type-check the new tests. In the nodiag config, `tsconfig: 'tsconfig.unit.json'`
  resolves against the overridden `rootDir`, and `setupFilesAfterEnv` is absolute (`path.join(__dirname, …)`).
- A tests all fail on the parent. Under the parent's whole-list filter, `e` matches the Compute header first, `c`
  pulls in the children of a matching group, and Select's closed `c` selects EC2. So step 5 doesn't need FAILPROOF
  step 4 (relevant to finding 1).
- G's OptionList test: on the parent with A applied, the third `c` looks up the current highlight (Cloud, `shared`)
  by value and finds the Compute header at index 0, so it stays on Cloud. With G it moves to Cache, as the spec
  says. OptionList's duplicate-value `warnOnce` checks leaf options only, so the shared group/option value doesn't
  warn.
- Wrap rule: `isHighlightable` excludes only non-interactive group headers, and disabled options stay
  highlightable. So the intentional-change table is complete: only empty leading or trailing groups change.
  Multiselect hardcodes `useInteractiveGroups = true` (`use-multiselect.tsx:109`), so "no change" for Multiselect
  holds.
- Core mapping matches both hooks: `useMenuKeyboard` calls `selectOption()` without arguments, so OptionList's
  `() => selectOption()` and Select's direct `selectOption` are the same. `preventNativeSpace: true` (OptionList) is
  equal to `spaceSelects: 'always'`. `closeDropdown` is optional on the base, which `onEscape?` uses.
  `HighlightedOptionHandlers` is exported from `use-highlight-option.ts`. `useAnnouncement` accepts
  `SelectProps.ContainingOptionAndGroupString`.
- `selectedAriaLabel` (i18n at `select/internal.tsx:106`, `use-multiselect.tsx:98`), `renderHighlightedAriaLive` and
  `parentMap` (`:125`, `:110`) are all defined before the `useSelect` calls, so they can be passed in.
- `use-select.test.ts:98` asserts only `getTriggerProps` key order. `getMenuProps` is checked by picking fields
  (`:112`), so spreading `core.mouseHandlers` doesn't break a key-order assertion.
- Section requirements: all 8 sections are present and meet the brief. That covers requirements with public
  API/DOM/aria/test-utils under "Must not change", the code-grounded current architecture, the target with exact
  files, and 3 alternatives on correctness/risk/diff/review/bundle. It also covers the explicit Autosuggest "no",
  per-fix landing and tests with FAILPROOF, risks with verification, per-commit Node 22 checks (no integ), and the
  PR split titled `test:`/`fix:`/`refactor:` without scope.

## Unverified or wrong assumptions

- Unverified, deferred to the run as designed: base-neutral tests pass on the base. Every restored test other than
  those traced above fails on its parent on an assertion. The later test-file cherry-picks (`e7429e11f`,
  `bd8f0792b`, `6b95bbf8c`, `7626adb9a`) resolve under the conflict rule. `pages/tsconfig.json` has exactly the 2
  known `@formatjs` errors. FUNC passes on the base, or its failures get recorded.
- Not covered by a test: embedded Multiselect Home/End prevention (finding 3). It is correct by code reading.
