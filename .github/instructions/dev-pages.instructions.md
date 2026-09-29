---
applyTo: "pages/**"
---
# Dev / demo page conventions
- Build pages with the `SimplePage` helper (h1, content paddings, i18n, screenshot area), not
  hand-rolled bespoke scaffolding. WHY: consistent, low-boilerplate, avoids a11y violations.
  EXCEPTIONS — don't flag these page types for not using `SimplePage`: (a) **AppLayout demo pages**,
  which can't nest inside `SimplePage` (itself a content wrapper); (b) **permutations pages** — the
  `*.permutations.page.tsx` shape built from `createPermutations` + `PermutationsView` + `ScreenshotArea`
  with a bare `<h1>` heading is the established structure for screenshot-matrix pages.
- Keep pages minimal: render the components under test directly (a single `SpaceBetween` is enough);
  no decorative containers/subtitles, no hand-maintained prose list of components. WHY: test pages
  should isolate behavior; decorative structure and lists drift.
- Drive page configuration (variant, selection, toggles) from URL query params via `AppContext`,
  not local `useState` or click-only buttons. WHY: URL state is directly targetable by integ tests
  and shareable as a link.
- Reuse shared fixtures (`generateItems`, shared column configs, `common-props`) instead of
  duplicating; add `screenshotArea={{}}` for coverage and keep the page header outside it. WHY:
  deduplicates fixtures, keeps screenshots isolated.
