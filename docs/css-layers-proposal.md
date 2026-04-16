# CSS Style API for Cloudscape Components

## Problem

Cloudscape component styles use high-specificity selectors (e.g. `.awsui_button_vjswe_k1b2p_157:not(#\9)`) in their pre-compiled `.scoped.css` output. These scoped class names are generated at build time and are not stable — they change across versions. Consumers who need to customize component appearance have no reliable CSS targets and must resort to `!important` or fragile selector matching.

## Proposal

Introduce a CSS Style API that provides:

1. **Stable class names** on component DOM elements (e.g. `.awsui-style-button-button`) that consumers can target in CSS
2. **Data attributes** for variant/state selection (e.g. `[data-awsui-style-variant="primary"]`)
3. **CSS Cascade Layers** to ensure consumer styles override component styles without `!important`

### How it works end-to-end

A consumer customizes a button like this:

```css
@layer application, awsui-components;

@layer application {
  /* Override all buttons */
  .awsui-style-button-button {
    border-color: red;
    border-radius: 0px;
  }

  /* Override only primary buttons */
  .awsui-style-button-root[data-awsui-style-variant="primary"] {
    background-color: green;
    border-color: darkgreen;
  }
}
```

This works because:
- The component renders stable class names (`.awsui-style-button-root`, `.awsui-style-button-button`) alongside the scoped internal classes
- The component renders `data-awsui-style-variant` with the current variant value
- All component CSS is wrapped in `@layer awsui-components`, so any style in the `application` layer (or unlayered) wins regardless of specificity

## CSS Style API definition

Each component exports a `css_style_api` object that documents the available CSS targets. For the button component:

```ts
export const css_style_api = {
  root: {
    className: 'awsui-style-button-root',
    attributes: {
      'data-awsui-style-variant': [
        'primary', 'normal', 'link', 'icon', 'inline-icon',
        'inline-icon-pointer-target', 'flashbar-icon',
        'breadcrumb-group', 'menu-trigger', 'modal-dismiss',
      ],
    },
  },
  anchor: {
    className: 'awsui-style-button-anchor',
  },
  button: {
    className: 'awsui-style-button-button',
  },
  icon: {
    className: 'awsui-style-button-icon',
  },
};
```

### Structure

- Each key (`root`, `anchor`, `button`, `icon`) represents a targetable DOM element within the component
- `className` — a stable, unscoped class name applied to that element
- `attributes` — optional data attributes applied to the element, with an array of valid values. These enable CSS attribute selectors for variant/state-specific styling

### Naming convention

Class names follow the pattern: `awsui-style-{component}-{element}`

Data attributes follow the pattern: `data-awsui-style-{property}`

### How attributes are applied

The `data-awsui-style-variant` attribute is set on the root element with the current variant value. This requires minimal code — a single line where the className is already being applied:

```tsx
const buttonProps = {
  className: clsx(
    buttonClass,
    css_style_api.root.className,
    isAnchor ? css_style_api.anchor.className : css_style_api.button.className
  ),
  'data-awsui-style-variant': variant,
  // ... other props
};
```

### CSS selectors for consumers

| Target | Selector |
|---|---|
| All buttons | `.awsui-style-button-button` |
| All button anchors | `.awsui-style-button-anchor` |
| Primary buttons only | `.awsui-style-button-root[data-awsui-style-variant="primary"]` |
| Normal buttons only | `.awsui-style-button-root[data-awsui-style-variant="normal"]` |
| Button icons | `.awsui-style-button-icon` |

## CSS Layers implementation

### Why layers are needed

Even with stable class names, consumer styles lose the specificity battle against the component's scoped selectors (`.awsui_button_vjswe_k1b2p_157:not(#\9)`). CSS Cascade Layers solve this by establishing explicit priority ordering that takes precedence over selector specificity.

### Build architecture

The components repo has two pipelines that produce `lib/components/`:

1. **`styles` task** — calls `buildThemedComponentsInternal` from `@cloudscape-design/theming-build` (sourced from the `theming-core` repo). For each component's `styles.scss`:

```
src/button/styles.scss
  → sass.compile()                    # SCSS → raw CSS
  → postCSSForEach()                  # postcss-inline-svg + postcss-modules
  │   ├─ generates scoped class names # .button → .awsui_button_vjswe_k1b2p_157
  │   └─ writes styles.css.js         # JS module mapping original → scoped names
  → postCSSAfterAll()                 # autoprefixer + :not(#\9) specificity + discard-empty
  │   └─ postcss-layer-wrap           # ← NEW: wraps output in @layer awsui-components
  → writes lib/components/button/styles.scoped.css
```

2. **`typescript` task** — runs `tsc` to compile `src/**/*.ts(x)` → `lib/components/**/*.js`.

The output `styles.css.js` bridges the two — it imports the `.scoped.css` and exports the class name mapping:
```js
import './styles.scoped.css';
export default { "button": "awsui_button_vjswe_k1b2p_157", ... };
```

### Dev server vs production build

| | Production (`npm run build`) | Dev server (`npm run start`) |
|---|---|---|
| CSS compilation | `gulp build` → `styles` task → theming-core | `gulp watch` → same `styles` task → theming-core |
| CSS consumption | Output shipped in `lib/components/` | webpack serves `lib/components/` via dev server |
| Layer injection | theming-core `postCSSAfterAll` | Same — `.scoped.css` files already contain `@layer` when webpack reads them |

Both paths use the same theming-core pipeline. The dev server (`webpack serve`) only consumes the pre-built `.scoped.css` files — it does not compile SCSS itself. `npm run start` runs `gulp watch` and `webpack serve` in parallel, so `lib/` stays up to date.

This means **layer wrapping only needs to happen in one place: theming-core**. No webpack config changes are needed.

### Changes to `theming-core` (`@cloudscape-design/theming-build`)

#### 1. New PostCSS plugin — `src/build/tasks/postcss/layer-wrap.ts`

A PostCSS plugin following the same pattern as the existing `increase-specifity.ts`:

```ts
import { PluginCreator, AtRule as AtRuleType } from 'postcss';

export interface LayerWrapOptions {
  layerName: string;
}

const creator: PluginCreator<LayerWrapOptions> = ({ layerName = 'awsui-components' } = { layerName: 'awsui-components' }) => {
  return {
    postcssPlugin: 'postcss-layer-wrap',
    OnceExit(root, { AtRule }) {
      if (root.nodes.length === 1 && root.nodes[0].type === 'atrule' && (root.nodes[0] as AtRuleType).name === 'layer') {
        return;
      }
      const layer = new AtRule({ name: 'layer', params: layerName });
      layer.append(root.nodes);
      root.removeAll();
      root.append(layer);
    },
  };
};

creator.postcss = true;
export default creator;
```

- Runs once per file after all other processing (`OnceExit`)
- Idempotent — skips files already wrapped in a single `@layer`
- Configurable layer name

#### 2. `src/build/tasks/postcss/index.ts` — add plugin to `postCSSAfterAll`

`postCSSAfterAll` gains an optional `layerName` parameter. When provided, the layer-wrap plugin runs last (after autoprefixer, specificity increase, and discard-empty):

```ts
export interface PostCSSAfterAllOptions {
  layerName?: string;
}

export const postCSSAfterAll = (input: string, filename: string, options: PostCSSAfterAllOptions = {}) => {
  const plugins = [
    autoprefixer({ overrideBrowserslist: browserslist }),
    postCSSIncreaseSpecificity(),
    postCSSDiscardEmpty(),
    ...(options.layerName ? [postCSSLayerWrap({ layerName: options.layerName })] : []),
  ];
  return postcss(plugins).process(input, { from: filename });
};
```

#### 3. `src/build/tasks/style.ts` — thread `layerName` through `BuildStylesOptions`

```ts
export interface BuildStylesOptions {
  failOnDeprecations?: boolean;
  layerName?: string;
}
```

Passed to `postCSSAfterAll` in the compiler:
```ts
const postCSSAfterAllResult = await postCSSAfterAll(postCSSForEachResult.css, intermediate, { layerName: options.layerName });
```

#### 4. `src/build/internal.ts` — expose `layerName` on `BuildThemedComponentsInternalParams`

```ts
export interface BuildThemedComponentsInternalParams {
  // ... existing fields ...
  /** If set, wraps all component CSS output in a @layer with this name **/
  layerName?: string;
}
```

Passed through to `buildStyles`:
```ts
const styleTask = buildStyles(scssDir, componentsOutputDir, inlineStylesheets, { failOnDeprecations, layerName });
```

### Why PostCSS over manual SCSS wrapping

| Approach | Pros | Cons |
|---|---|---|
| Manual `@layer` in each `styles.scss` | Explicit, visible in source | Requires editing ~216 files; sub-files (`motion.scss`, `text.scss`, etc.) imported via `@use` add complexity; easy to miss new files |
| PostCSS plugin in theming-core | Zero source changes; automatically covers all components including new ones; single point of configuration; works for both build and dev | Layer wrapping is implicit — not visible in source SCSS |

The PostCSS approach was chosen because:
- It operates on the final compiled CSS, after all other transforms (scoping, specificity, autoprefixer)
- It requires no changes to any component SCSS source files
- New components are automatically covered
- The option is fully opt-in — omitting `layerName` preserves existing behavior

## Local development

To test theming-core changes locally in the components repo:

1. Build theming-core: `cd theming-core && npm run build` (compiles TS to `lib/node/`)
2. Register the local package: `cd theming-core/lib/node && npm link`
3. Link it into components: `cd components && npm link @cloudscape-design/theming-build`
4. Build/run: `npm run build` or `npm run start`

`npm link` creates a symlink without modifying `package.json` or `package-lock.json`. Step 2 registers the package by the `"name"` field in `lib/node/package.json` (`@cloudscape-design/theming-build`).

**Important**: Do not run `npm install` after linking — it will overwrite the symlink. Also ensure that `theming-core/node_modules/sass` matches the version in `components/node_modules/sass`, as Node resolves dependencies from the symlink's real path. If versions differ, delete `theming-core/node_modules/sass` to fall back to the components version.

## Consumer usage

Consumers declare layer order and place their overrides in the higher-priority layer:

```css
@layer application, awsui-components;

@layer application {
  .awsui-style-button-button {
    border-color: red;
    background-color: blue;
  }

  .awsui-style-button-root[data-awsui-style-variant="primary"] {
    background-color: green;
  }
}
```

The `@layer application, awsui-components;` declaration must appear before any other styles. This could be shipped as part of `@cloudscape-design/global-styles` in the future.

## Scope and limitations

- **Third-party CSS** bundled alongside components (e.g. `ace-builds` in code-editor) is not affected — only `.scoped.css` files produced by theming-core are wrapped.
- **Browser support**: CSS Cascade Layers are supported in all modern browsers (Chrome 99+, Firefox 97+, Safari 15.4+). No IE11 support.
- **Keyframes and animations**: `@keyframes` defined inside a layer still function correctly. They have lower priority than unlayered keyframes of the same name, which is acceptable for component-internal animations.
- **POC scope**: The CSS Style API is currently implemented only for the Button component. Scaling to all components requires defining `css_style_api` objects and applying stable class names + data attributes in each component.

## Files changed

### `theming-core`

| File | Change |
|---|---|
| `src/build/tasks/postcss/layer-wrap.ts` | New — PostCSS plugin |
| `src/build/tasks/postcss/index.ts` | `postCSSAfterAll` accepts optional `layerName`, conditionally applies layer-wrap plugin |
| `src/build/tasks/style.ts` | `BuildStylesOptions` gains `layerName`, passed to `postCSSAfterAll` |
| `src/build/internal.ts` | `BuildThemedComponentsInternalParams` gains `layerName`, passed to `buildStyles` |

### `components`

| File | Change |
|---|---|
| `build-tools/tasks/styles.js` | Passes `layerName: 'awsui-components'` to `buildThemedComponentsInternal` |
| `src/button/internal.tsx` | Defines `css_style_api`, applies stable class names and `data-awsui-style-variant` to button element |
| `pages/button/css-style-api.page.tsx` | New — demo page rendering buttons with style overrides |
| `pages/button/css-style-api.css` | New — consumer CSS demonstrating layer-based overrides with variant selection |
