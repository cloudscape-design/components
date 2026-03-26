# Dev Pages

Dev and test pages live in `pages/<component-name>/`. They are used for local development, integration tests, and visual regression tests.

## Running Dev Pages

```
npm run quick-build    # build first (required before starting)
npm start              # starts watcher + dev server at http://localhost:8080
npm run start:react18  # same, but with React 18
```

Navigate to `http://localhost:8080/#/light/<component-name>/<page-name>` to view a page. The sidebar lists all available pages.

## Rules

- Export a default function component
- Import components via `~components/<name>` (not relative paths to `src/`)
- File names must end with `.page.tsx` to be discovered by the dev server

## Visual Regression Pages

For pages used in visual regression tests, wrap content so screenshots are consistent:

- `SimplePage` from `pages/app/templates` — preferred for most pages. Handles heading, screenshot area, i18n provider, and layout padding automatically. Accepts `title`, `settings`, `screenshotArea`, and `i18n` props.
- `ScreenshotArea` from `pages/utils/screenshot-area` — use when you need more control over layout. Requires a manual `<h1>` heading.

Use `SimplePage` for new pages unless you have a specific reason to use `ScreenshotArea` directly.

## Permutation Pages

Use `createPermutations` and `PermutationsView` from `pages/utils/` for pages that show all prop combinations. Use `PermutationsPage` from `pages/app/templates` as the page wrapper (it extends `SimplePage` with screenshot area enabled by default).

## Controlling State via URL (App Context)

Use `useAppContext` from `pages/app/app-context` to read and write URL parameters for interactive dev pages. This lets you control component state (e.g. color, variant, size) via the URL and settings UI.

```tsx
import { useAppContext } from '../app/app-context';

export default function MyPage() {
  const { urlParams, setUrlParams } = useAppContext<'color'>();
  const color = urlParams.color ?? 'blue';
  // Use setUrlParams({ color: 'red' }) to update
}
```

Built-in URL params include `density`, `direction`, `visualRefresh`, and `motionDisabled`.

## Shared Data

If multiple pages share data (like `i18nStrings`), put it in a `common.tsx` in the same directory.
