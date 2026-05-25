# Per-target themeable composition for One Theme (and beyond)

## How it works today

The brazil pipeline `AWS-UI-Components` is the single source of all components packages — both internal (`@amzn/awsui-*`) and open-source (`@cloudscape-design/*`, `@awsui/*`). It produces five build targets, defined in `base-build/targets.ts`:

| Target name | Becomes |
|---|---|
| `polaris` | `@amzn/awsui-components` (and `*-themeable`) |
| `console` | `@amzn/awsui-components-console` (and `*-themeable`) |
| `core` | `@amzn/awsui-components-core` (and `*-themeable`) |
| `open-source-visual-refresh` | `@cloudscape-design/components` and `@cloudscape-design/components-themeable` |
| `open-source-classic` | `@awsui/components-react` and `@awsui/components-themeable` |

The OSS scope rename happens in a post-processing step (`awsui-prepare-open-source.js`) that takes the `@amzn/awsui-*` build output, swaps scopes, adds licenses, and packs npm tarballs. There is no separate OSS publish pipeline — the cloudscape-design GitHub repo is a downstream source mirror, not the build source.

For each target, brazil produces two build outputs:

- **The runtime build** (`build/aws-ui-npm/components-{target}/`) — the compiled CSS and JS that React components import when consumers use them directly without re-theming. Composed per-target by `buildThemedComponentsInternal` using `primaryTheme` and `secondaryTheme` from `targets.ts`. Internal teams and OSS consumers who don't need re-theming use these.

- **The themeable build** (`build/aws-ui-npm/components-themeable-{target}/`) — a parallel artifact for consumers who re-theme via the `@cloudscape-design/theming-runtime` API. It contains the same compiled CSS, plus SCSS templates and a JS entry point that lets consumers swap design tokens at runtime. Today this is a **pass-through copy**: brazil copies `awsui-artifacts-components-themeable` (the synced OSS-flavored themeable input) into the target's themeable output, then only overlays `internal/generated/` and `internal/environment.js` per-target. Per-target composition from `targets.ts` is ignored. Every themeable variant has identical compiled CSS — only the generated dev-mode env values differ.

Per-target visual differences (e.g., console buttons darker than polaris) work entirely outside themeable shape. Each target ships its own `awsui-design-tokens-{target}` package defining different values for the same CSS custom-property names. Themeable CSS contains `var(--token-name, fallback)` references; the cascade resolves them to whichever design-tokens stylesheet the consumer loads. Consumers can also call `applyTheme()` from the theming-runtime to override token values at runtime.

## Problem

We want One Theme available in `awsui-components-console-themeable` and `awsui-components-core-themeable`, so internal teams using themeable can toggle the `.awsui-one-theme` body class and get its style rules. We do not want it in `@cloudscape-design/components-themeable`, because OSS hasn't agreed to ship One Theme yet.

This is impossible with today's setup. The only way per-target secondaries reach a build artifact is through the runtime build path — `secondaryTheme` in `targets.ts` flows into `components-{target}/`, but never into `components-themeable-{target}/`. Themeable is a pass-through of the OSS-synced template input regardless of target. So:

- Setting `secondaryTheme: oneTheme` on console and core puts one-theme rule blocks in `components-console/` and `components-core/` runtime CSS, but **not** in their themeable counterparts.
- Adding one-theme to the OSS-synced themeable input (by enabling `INCLUDE_ONE_THEME` in the OSS components repo build) puts the rule blocks into the themeable input, but they then flow to **every** themeable variant equally — including `components-themeable-open-source-visual-refresh`, which becomes `@cloudscape-design/components-themeable` after the OSS rename. That violates the requirement to keep One Theme out of OSS packages.

The same constraint applies to any future per-target secondary theme. Brazil composes primary + secondaries for runtime CSS but not for themeable. Themeable is locked to whatever the OSS-flavored themeable input contains.

Tokens have a related but separable gap. Even with one-theme rule blocks present in themeable, consumers calling `applyTheme({ baseThemeId: 'one-theme', tokens: ... })` need the theming-runtime to know about one-theme. Today's design-tokens artifacts include schemas only for `classic` and `visual-refresh`. Until one-theme is added to `awsui-design-tokens-console` and `awsui-design-tokens-core` and registered in the runtime schema list, `applyTheme()` calls scoped to one-theme don't resolve.

## Solution

Make brazil's themeable composition per-target. Add a new field to `TargetOverrideConfig`:

```ts
themeable?: {
  templateSource?: 'oss' | 'runtime'; // default: 'oss'
};
```

The two modes:

- **`'oss'` (default)** — current pass-through behavior. The themeable variant's `internal/template/` is copied from the OSS-synced themeable input. Backward-compatible; preserves byte-for-byte equivalence with what flows to npm today.
- **`'runtime'` (new)** — the themeable variant's `internal/template/` is overlayed from `components-{target}/` (the per-target runtime build of the **same** target). Per-target primaries and secondaries flow in.

Set `templateSource: 'runtime'` on `console` and `core`. Their `secondaryTheme` is one-theme; their runtime build composes visual-refresh primary plus one-theme secondary; their themeable variants inherit the same composition.

Leave polaris and the open-source targets on the default `'oss'`. Polaris doesn't have a per-target secondary that needs to surface in themeable. The open-source targets must continue producing themeable that matches the OSS-sync shape, since `@cloudscape-design/components-themeable` is the public contract and must not gain one-theme until OSS agrees.

The fix only changes themeable. Runtime builds (`components-{target}/`) already work correctly per-target and need no changes.

For tokens, the follow-up work is independent: add one-theme to `awsui-design-tokens-console` and `awsui-design-tokens-core`, and register one-theme as a known base theme in the theming-runtime schema. Required before internal teams can call `applyTheme({ baseThemeId: 'one-theme' })` and have it correctly scope overrides under `.awsui-one-theme`. Without this, the new themeable rule blocks render with their built-in token values but cannot be customized per-consumer.

## Behavior change to call out

Switching console+core themeable from `'oss'` to `'runtime'` means those variants no longer share the OSS-sync composition. There are two visible consequences worth flagging in the PR.

First, console and core runtime is visual-refresh-only (`alwaysVisualRefresh: true`), while the OSS sync today contains classic + visual-refresh. So `awsui-components-console-themeable` and `awsui-components-core-themeable` lose their `.awsui-classic` rule blocks. Both targets enforce `alwaysVisualRefresh: true`, so consumers always render with the `.awsui-visual-refresh` body class and never hit classic rules anyway. Removing them is a harmless cleanup and brings themeable in line with what these targets actually serve.

Second, and more substantive, the pre-change console-themeable and core-themeable shipped with OSS-flavor token-name hashes (e.g., `--color-background-button-primary-default-3w82vy`) and OSS fallback colors (e.g., blue `#0073bb` for primary button background). The corresponding runtime build uses polaris-VR token-name hashes (`-rz0flk`) and AWS-orange fallbacks (`#ff9900`). Internal consumers pairing `awsui-components-console-themeable` with `awsui-design-tokens-console` (which uses polaris-VR hashes) had a structural mismatch — the cascade never resolved at the per-target hash and fell through to the hardcoded fallback or relied on `applyTheme()` overrides. Post-change, the themeable hashes match the design-tokens hashes and cascade resolution works correctly. Default fallback colors flip from OSS to internal-flavor, which is more accurate for these targets but is a visible change for any consumer that wasn't overriding tokens.

The architectural argument: the pre-change setup was producing artifacts with mismatched token namespaces. `templateSource: 'runtime'` is correct beyond the one-theme requirement — it's how console-themeable and core-themeable should have always worked.
