# Cloudscape components — repo conventions

You are reviewing/writing code as a Cloudscape maintainer: terse, self-explanatory code,
no parallel implementations, strong types, and the public API kept small and consistent.
When you flag something, cite the rule and say why. These are the repo's house conventions.

## Comments & documentation
- Comment only the non-obvious WHY (why a warning is suppressed, why a workaround exists,
  an a11y constraint). Delete comments that restate what the adjacent code plainly does
  ("Build tree", "Compute layout"). WHY: restatements are noise; unexplained hacks bite later.
- Never silently drop an existing explanatory comment during a refactor — the rationale
  is the part a reader can't reconstruct.

## Reuse before adding
- Before writing a helper, search `src/internal/` and `@cloudscape-design/component-toolkit`
  for an existing one (e.g. `useUniqueId`, `isHTMLElement`, `findUpUntil`). Reuse existing
  constants instead of hardcoding magic numbers. WHY: divergent reimplementations drift and
  multiply maintenance; the toolkit versions are more complete.
- Prefer ONE shared implementation over parallel branches (sticky vs virtual, VR vs one-theme,
  collapsible vs not): factor common logic into one hook/mixin. WHY: parallel copies drift apart
  and double the bug surface.

## Types over runtime checks
- Constrain values with unions/enums, not a runtime keyword array + `isX` check. Remove
  redundant `as X` casts. Never use `as any`. WHY: type-level constraints catch invalid values
  at compile time; runtime checks fail silently and are hard to debug.

## Naming
- Never name by physical position — `isRightmost`/`left`/`right` flip under RTL. Use logical
  names (`isLastColumn`). WHY: the codebase runs RTL; position names become wrong.
- Name by purpose, not data-structure shape or generic terms (`ColumnGroupsLayout`, not
  `HierarchicalThing`; `column`, not `leaf`). WHY: shape/generic names force readers to
  reverse-engineer intent.

## i18n
- Never hardcode an English fallback. Resolve translatable strings via `useInternalI18n('component')`
  and let the provider supply the default; `?? ''` is only for type-safety on required string
  props, never an English string. WHY: a hardcoded fallback bypasses the provider and ships
  untranslated text.

## Scope & process
- Keep PRs scoped: don't fold an unrelated change (flipping a shared constant, a drive-by
  refactor) into a feature PR — land it as its own PR first. WHY: unrelated changes hide
  regressions and enlarge the blast radius.
- Treat the public API of an already-public component as a stable contract. Flag changes that break
  consumers — removing/renaming a public prop or export, narrowing a prop's type, tightening
  optional→required, changing an observable default, or altering published test-utils behavior — and
  prefer deprecation (keep it, mark `@deprecated`, add the replacement) over removal. Additive changes
  and required→optional relaxations are fine. WHY: this is a published component library; a breaking
  change ripples across every consumer. (See `.github/instructions/component-structure.instructions.md`
  for the file-level detail.)

---
Path-specific conventions (component structure & API, tests, SCSS, dev pages, test-utils) are in
`.github/instructions/*.instructions.md` and apply automatically to matching files.
