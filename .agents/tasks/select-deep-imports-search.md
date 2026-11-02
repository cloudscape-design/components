# Deep-import search: moved Select/Multiselect/listbox internals

Read-only investigation. No files changed apart from this report. Nothing was posted and no one was contacted.

## Bottom line

**I could not run a usable code search on any system.** Amazon internal code search was unavailable. Public GitHub search was blocked or gave unreliable results. No consumer hits were found, but that is because no search worked. It is not evidence that nobody imports these files. Someone with builder-mcp or code.amazon.com search access needs to run the queries listed below.

## Paths in scope

| Old path (published as `@cloudscape-design/components/...` or `@awsui/components-react/...`) | Symbols | After the refactor |
|---|---|---|
| `select/utils/use-native-search` | `useNativeSearch`, option `useInteractiveGroups` | `internal/components/listbox/use-type-ahead` (`useTypeAhead`, option `interactiveGroups`) |
| `select/parts/item` | default `Item`, `ItemProps` | merged into `internal/components/listbox/parts/item` |
| `select/parts/multiselect-item` | default `MultiselectItem` | deleted, merged into the same file |
| `select/parts/plain-list` | default `PlainList`, `SelectListProps` | `internal/components/listbox/parts/plain-list` |
| `internal/components/listbox/parts/render-options` | `renderOptions` props `checkboxes`, `useInteractiveGroups` | props removed |
| `internal/components/listbox/parts/get-item-props` | `getItemProps` param `hasCheckbox` | param removed |

## Queries run

### 1. Amazon internal code search (InternalCodeSearch / builder-mcp): unavailable

I gave the brief to the `amzn-builder` sub-agent, which then tried `aws-builder` and `gpu-research`. None of the three sessions had InternalCodeSearch or any builder-mcp tool loaded, so the tool was never called and there is no error text. The tool was simply missing from the toolset. `web_fetch` cannot log in to code.amazon.com, so I had no fallback.

None of these queries ran:

1. `components/select/parts/item`
2. `select/parts/multiselect-item`
3. `select/parts/plain-list`
4. `select/utils/use-native-search`
5. `useNativeSearch`
6. `listbox/parts/render-options`
7. `listbox/parts/get-item-props`
8. `@cloudscape-design/components/select/parts`
9. `@awsui/components-react/select/parts`
10. `@cloudscape-design/components/internal/components/listbox`
11. `@awsui/components-react/internal/components/listbox`
12. `components-react/select/utils`

### 2. Public GitHub search: blocked or unreliable

| System | Query | Result |
|---|---|---|
| `gh search code` (shell) | n/a | **Not run.** Every shell command is denied in this session by the agent-profile permission rule (a bare `*` deny pattern). Even `which gh` was rejected. |
| GitHub REST API `api.github.com/search/code` | `"select/parts/plain-list"` | **HTTP 401 Unauthorized.** Code search needs a token. |
| grep.app API | `select/parts/item`, `useNativeSearch` | **HTTP 429 Too Many Requests** on both. |
| Sourcegraph.com stream API (anonymous), excluding `cloudscape-design/components` | `"select/parts/item"` | Finished, 0 matches. |
| Sourcegraph.com stream API, global, as a sanity check | `"parts/plain-list"` | Finished, **0 matches.** This should have matched the components repo itself (`src/multiselect/internal.tsx` imports `'../select/parts/plain-list'`). |
| Sourcegraph.com stream API, global, as a sanity check | `PlainList SelectListProps` | Finished, **0 matches.** This should also have matched the components repo. |
| Sourcegraph.com stream API, scoped `repo:^github\.com/cloudscape-design/components$` | `PlainList` | 5 matches (`src/select/internal.tsx`, `src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx`). |

Anonymous Sourcegraph works when scoped to one repo, but its global search returned 0 even for strings that exist in the components repo. So the 0 from the global search for `"select/parts/item"` means nothing, and I stopped running the other strings there.

## Hits

| Package/repo | File | Import line | Moved symbol | Prod/test |
|---|---|---|---|---|
| none found (no working search) | | | | |

Vendored or mirror copies: none identified, for the same reason.

## Local evidence on how exposed these paths are

From `build-tools/tasks/package-json.js` (`getComponentsExports()`):

- The published `@cloudscape-design/components` `package.json` has an `exports` map. It lists `.`, each public component's `index.js`, test-utils, `theming`, `interfaces`, `contexts/form-field`, `internal/plugins*`, `internal/widget-exports`, and a fixed set of `internal/do-not-use/*` and `internal/tooltip-do-not-use` entries.
- **None of the moved paths are in the `exports` map.** None of the `internal/do-not-use/*`, `internal/plugins` or `internal/widget-exports` entry points re-export them either (grep of those sources found 0 hits).
- So Node ESM/CJS resolution and exports-aware tooling already refuse `@cloudscape-design/components/select/parts/item` and the other moved paths. Exports-aware tooling here means webpack 5+, Vite/esbuild/Rollup with default settings, and TypeScript with `moduleResolution: node16 | nodenext | bundler`. Only consumers on tooling that ignores `exports` can reach these files today: webpack 4, Jest's older resolver, TS `moduleResolution: node`, or explicit file-path aliases.
- The legacy `@awsui/components-react` package is a separate, older artifact. It doesn't receive this refactor, so it is out of scope for breakage.

## What is still needed

Run the 12 queries from section 1 in code.amazon.com search, or in a session where builder-mcp/InternalCodeSearch is connected. Exclude `AWS-UI-Components*` and other Cloudscape mirror packages, `node_modules`, lockfiles and bundles. For public GitHub, run `gh search code '<query>' -- -repo:cloudscape-design/components` from an authenticated shell.

## Conclusion

I can't say whether any team imports these files. Internal code search was missing from every session I could use, `gh` couldn't run because shell is denied, and the public search APIs returned 401 or 429 or gave unreliable empty results. The structure of the package keeps the risk low: none of the moved files are public entry points or `do-not-use` exports, and the published `exports` map already blocks them for exports-aware resolvers. Any consumer that still deep-imports them depends on unsupported internals and on older resolution behaviour, which Cloudscape doesn't treat as API. Still, "low risk" here comes from how the package is built, not from a search. Run the internal code search above before merging if you need confirmation that no team is affected.
