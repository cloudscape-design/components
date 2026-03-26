React component library for [Cloudscape Design System](https://cloudscape.design/) — an open source design system for building accessible, inclusive web experiences at scale.

## Setup

```
npm install
```

## Building

- `npm run quick-build` — fast dev build (compiles TS, SCSS, generates icons/i18n/test-utils). Use this for local development.
- `npm run build` — full production build (quick-build + dev pages, theming, docs, size-limit). Use this before publishing or to verify everything works end-to-end.
- `npm run build:react18` — production build targeting React 18.

## Running Locally

```
npm start              # starts watcher + dev server (React 16, default)
npm run start:react18  # starts watcher + dev server (React 18)
```

The dev server runs at `http://localhost:8080`. Pages are served from `pages/<component-name>/`.

## Docs Index

For component structure, props, events, and refs, see docs/COMPONENT_CONVENTIONS.md.
For design tokens, CSS rules, and RTL support, see docs/STYLING.md.
For test commands and configs, see docs/TESTING.md.
For writing tests and test utils, see docs/WRITING_TESTS.md.
For prettier, stylelint, and eslint (`npm run lint`), see docs/CODE_STYLE.md.
For dev/test pages and running in the browser, see docs/DEV_PAGES.md.
For API documentation comments, see docs/API_DOCS.md.
For internal shared utilities, see docs/INTERNALS.md.
