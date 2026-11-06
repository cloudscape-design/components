# OptionList keyboard scroll: verification

The user stopped verification early ("implementation is done, proceed"). Below is what was run and what was not.

## Ran

| Check | Command | Result |
|---|---|---|
| Build | `npm run quick-build` | pass. The first run failed in `clean` (ENOTEMPTY, because the user's `gulp watch` and dev server were running). The second run passed. |
| Unit tests | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect src/autosuggest src/__tests__/snapshot-tests/documenter.test.ts` | 45/46 suites, 738/741 tests pass. All new tests pass: 2 for `scrollOptionIntoView`, 7 for OptionList scrolling. |
| Documenter snapshot | same run | 3 failures, all pre-existing: the option-list definition and the test-utils dom/selectors snapshots. This change doesn't modify `src/option-list/interfaces.ts`. The option-list diff is grouping text that commit b9c34f236 ("chore: remove grouping") removed without updating the snapshot. |
| ESLint | `npx eslint src/internal/components/listbox src/option-list pages/option-list` | pass |
| Prettier | `npx prettier --check src/internal/components/listbox src/option-list pages/option-list` | pass |
| Stylelint | `npx stylelint 'pages/option-list/*.scss'` | pass |

## Not completed

- Integration tests (`src/option-list/__integ__/option-list.test.ts`). These were written but haven't passed locally. The global ChromeDriver is 152 and Chrome is 155. With ChromeDriver 155 downloaded to `/tmp/cd155`, every test, including the 4 existing ones, still failed on page load. The dev pages threw `Cannot read properties of undefined (reading 'data')` while loading `lib/components/internal/base-theme/styles.scoped.css`. That looks like an environment or `lib` state problem, not something this change caused. The cause wasn't confirmed.
- Manual Playwright check of `in-dropdown` and `scroll` pages: not done. The same page-load error blocked it.
- Check that Select on `global-scroll-padding` doesn't scroll the page on open: not done. Select keeps the unchanged `scrollStrategy='list'` code path, so its behaviour is expected to match today's.

## Cleanup

- The dev server started for verification (`webpack.config.integ.cjs`) has been stopped.
- The user's own dev server on :8080 and `gulp watch` had already exited during the session. They were not restarted.
- `pages/tsconfig.tsbuildinfo` is unchanged.
