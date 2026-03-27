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
npm run start              # starts watcher + dev server for development pages
npm run start:react18  # starts watcher + dev server (React 18)
```

The dev server runs at `http://localhost:8080`. Pages are served from `pages/<component-name>/`.

## Docs Index

See docs/CLOUDSCAPE_COMPONENTS_GUIDE.md for the full list of contributor documentation.
For running tests and configs, see docs/RUNNING_TESTS.md.
