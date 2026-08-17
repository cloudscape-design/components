## Setup

```
npm install
```

## Building

- `npm run quick-build` — fast dev build (compiles TS and SCSS files and generates icons, i18n and test utils). Use this for local development.
- `npm run build` — full production build (quick-build + dev pages, theming, docs, size-limit). Use this before publishing or to verify everything works end-to-end.
- `npm run build:react18` — production build targeting React 18.

### Theme composition

Every build compiles exactly one primary theme plus a list of secondary themes, controlled by two env vars:

- `PRIMARY_THEME` — one of `classic`, `visual-refresh`, `core`. Defaults to `classic`.
- `SECONDARY_THEMES` — comma-separated list of `visual-refresh`, `one-theme`. Defaults to `visual-refresh`. Pass an empty string (`SECONDARY_THEMES=`) for no secondary themes at all.

A bare `npm run build`/`npm run quick-build` (no env vars) always produces `classic` + `visual-refresh` — this is the release composition and must stay unchanged, since pushing a `dev-v3-*` branch triggers a real publish to CodeArtifact. Examples of other supported compositions:

```
# open source (cloudscape-design publish): visual refresh only, no secondary theme
PRIMARY_THEME=visual-refresh SECONDARY_THEMES= npm run build

# console: visual refresh primary + one-theme secondary, no classic
PRIMARY_THEME=visual-refresh SECONDARY_THEMES=one-theme npm run build

# core: visual-refresh/core primary only, no secondary
PRIMARY_THEME=core SECONDARY_THEMES= npm run build
```

An unknown theme id, or an id used in a role it doesn't support (e.g. `SECONDARY_THEMES=core`, or the same theme listed as both primary and secondary), fails the build immediately with a clear error rather than silently falling back to a default.

Once you've built with a given composition, it's "sticky": a later bare `npm run quick-build` inherits whatever composition the last build produced (read from `lib/components/internal/environment.json`) instead of resetting to the release default — this is what lets `npm start`'s watcher keep serving the composition you built with across incremental rebuilds. Pass `PRIMARY_THEME`/`SECONDARY_THEMES` explicitly to switch composition.

## Running Locally

```
npm run start          # starts watcher + dev server for development pages
npm run start:react18  # starts watcher + dev server (React 18)
```

`npm start`'s watcher (`start:watch`) sets `THEME_PRESET=dev` by default, which resolves to `classic` + `visual-refresh` + `one-theme` (every switchable theme) as long as nothing else overrides the composition — so a fresh `npm run quick-build` followed by `npm start` gives you every theme in the dev-page switcher. If you've already built a specific composition with `npm run quick-build` (see above), `npm start` inherits it (sticky) rather than the dev preset — export `PRIMARY_THEME`/`SECONDARY_THEMES` yourself before `npm start` to force a specific composition instead.

The dev server runs at `http://localhost:8080`. Pages are served from `pages/<component-name>/`.