# Per-target theme composition for One Theme

## How the build pipeline works

There are three repos involved:

1. **`github/components`** — the source. `npm run build` compiles SCSS into CSS. One-theme is a secondary theme, so its rule blocks (`.awsui-one-theme { ... }`) are baked into every compiled CSS file. The output lands in `lib/`.

2. **`AWS-UI-Artifacts-Components-React`** — a brazil package containing the pre-built `lib/` from step 1. It's a snapshot of the components build output.

3. **`AWS-UI-Components`** — the brazil wrapper that consumes the artifact and produces five target packages (polaris, console, core, open-source-visual-refresh, open-source-classic). For each target it produces two outputs:

   - **Components package** (`components-{target}/`): Copies the source artifact, then **regenerates all CSS from SCSS** using the target's own `primaryTheme` + `secondaryTheme` from `targets.ts`. The pre-baked CSS is overwritten. One-theme only appears here if the target explicitly lists it as `secondaryTheme`.

   - **Themeable package** (`components-themeable-{target}/`): Copies the pre-built themeable template from the source artifact **verbatim**. CSS is not regenerated. Whatever was baked in at step 1 flows to every themeable variant identically.

## The problem

The source artifact has one-theme baked in. The components packages are fine — their CSS gets regenerated per-target, so one-theme only appears where `targets.ts` says it should. But the themeable packages are a pass-through copy of the source, so one-theme CSS leaks into every themeable variant — including `components-themeable-open-source-visual-refresh`, which becomes `@cloudscape-design/components-themeable`. We can't ship one-theme to OSS.

The root cause: themeable packages have no per-target composition. They ignore `targets.ts` entirely.

## Solution

Make themeable packages respect the same per-target theme configuration as components packages.

Add a `secondaryThemes` field to `TargetConfig` in `targets.ts` that controls which secondary themes are compiled into **both** the components package and the themeable package for that target:

```ts
export interface TargetConfig {
  name: TargetName;
  systemTag: string;
  primaryTheme: Theme;
  secondaryThemes?: Theme[];       // compiled into both components and themeable
  metadata: Record<string, any>;
  designTokensFileName: string;
  designTokensPackageName: string;
  alwaysVisualRefresh?: boolean;
  freezeComponentsList?: boolean;
}
```

Change `generateComponentsThemeable` so that instead of copying the source themeable template verbatim, it **regenerates CSS from SCSS** using the same primary + secondaryThemes as the components package. The themeable package gets the same theme composition as its corresponding components package.

Target configuration becomes:

```ts
export const targets: Array<TargetConfig> = [
  {
    name: "polaris",
    systemTag: "console",
    freezeComponentsList: true,
    primaryTheme: polarisClassic,
    secondaryThemes: [polarisVisualRefresh],
    // ...
  },
  {
    name: "console",
    systemTag: "console",
    primaryTheme: polarisVisualRefresh,
    secondaryThemes: [oneTheme],
    alwaysVisualRefresh: true,
    // ...
  },
  {
    name: "core",
    systemTag: "core",
    primaryTheme: coreTheme,
    secondaryThemes: [oneTheme],
    alwaysVisualRefresh: true,
    // ...
  },
  {
    name: "open-source-visual-refresh",
    systemTag: "core",
    primaryTheme: openSourceVisualRefresh,
    secondaryThemes: [],
    alwaysVisualRefresh: true,
    // ...
  },
  {
    name: "open-source-classic",
    systemTag: "console",
    freezeComponentsList: true,
    primaryTheme: openSourceClassic,
    secondaryThemes: [],
    // ...
  },
];
```

One-theme appears in console and core. It does not appear in open-source targets. The configuration is explicit and there's a single `secondaryThemes` field that controls both outputs for a target.

## Behavior changes

Console and core themeable packages currently contain OSS-flavor CSS (classic + visual-refresh rule blocks, OSS token hashes, OSS fallback colors). After this change they contain per-target CSS (visual-refresh only, internal token hashes, internal fallback colors). This is correct — these targets enforce `alwaysVisualRefresh: true` and pair with internal design-tokens packages that use internal hashes. The pre-change setup had a structural mismatch.

## Follow-up work (independent)

Add one-theme to `awsui-design-tokens-console` and `awsui-design-tokens-core` and register it in the theming-runtime schema. Required before consumers can call `applyTheme({ baseThemeId: 'one-theme' })`.
