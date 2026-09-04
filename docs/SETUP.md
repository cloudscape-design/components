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

- `AWSUI_PRIMARY_THEME` — one of `classic`, `visual-refresh`, `core`. Defaults to `classic`.
- `AWSUI_SECONDARY_THEMES` — comma-separated list of `visual-refresh`, `one-theme`. Defaults to `visual-refresh`. Pass an empty string (`AWSUI_SECONDARY_THEMES=`) for no secondary themes at all.

(Precedent: these follow the internal `AWSUI_TARGET` naming convention. The build-time constants these produce — `PRIMARY_THEME`/`INCLUDED_THEMES` in `lib/components/internal/environment.*` — keep their existing unprefixed names, matching the other unprefixed constants there (`THEME`, `SYSTEM`, `ALWAYS_VISUAL_REFRESH`, `PACKAGE_VERSION`, `GIT_SHA`); only the build INPUT env vars are prefixed. `ALWAYS_VISUAL_REFRESH` the env var is also left unprefixed, since renaming it would break existing consumers — so it's the one deliberate inconsistency here.)

If EITHER env var is set explicitly, both fields resolve from the explicit value or the preset default — resolution is atomic, so setting only one never silently mixes in a stale secondary/primary theme from a previous build.

A bare `npm run build`/`npm run quick-build` (no env vars) always produces `classic` + `visual-refresh` — this is the release composition and must stay unchanged, since pushing a `dev-v3-*` branch triggers a real publish to CodeArtifact. Examples of other supported compositions:

```
# open source (cloudscape-design publish): visual refresh only, no secondary theme
AWSUI_PRIMARY_THEME=visual-refresh AWSUI_SECONDARY_THEMES= npm run build

# console: visual refresh primary + one-theme secondary, no classic
AWSUI_PRIMARY_THEME=visual-refresh AWSUI_SECONDARY_THEMES=one-theme npm run build

# core: visual-refresh/core primary only, no secondary
AWSUI_PRIMARY_THEME=core AWSUI_SECONDARY_THEMES= npm run build
```

An unknown theme id, or an id used in a role it doesn't support (e.g. `AWSUI_SECONDARY_THEMES=core`, or the same theme listed as both primary and secondary), fails the build immediately with a clear error rather than silently falling back to a default.

Once you've built with a given composition, it's "sticky": a later bare `npm run quick-build` inherits whatever composition the last build produced (read from `lib/components/internal/environment.json`) instead of resetting to the release default — this is what lets `npm start`'s watcher keep serving the composition you built with across incremental rebuilds. Pass `AWSUI_PRIMARY_THEME`/`AWSUI_SECONDARY_THEMES` explicitly to switch composition.

If you run `npm start` (`gulp watch`) while an EARLIER, un-terminated `npm start`/`gulp watch` session for a *different* composition is still running somewhere, the older session will detect the mismatch the next time it reacts to a source change and abort loudly with a `[themes] ... stale and must be restarted` error rather than silently overwriting your newer build — kill it and restart it if you see that message.

## Running Locally

```
npm run start          # starts watcher + dev server for development pages
npm run start:react18  # starts watcher + dev server (React 18)
```

`npm start`'s watcher (`start:watch`) sets `AWSUI_THEME_PRESET=dev` by default, which resolves to `classic` + `visual-refresh` + `one-theme` (every switchable theme) as long as nothing else overrides the composition — so a fresh `npm run quick-build` followed by `npm start` gives you every theme in the dev-page switcher. If you've already built a specific composition with `npm run quick-build` (see above), `npm start` inherits it (sticky) rather than the dev preset — export `AWSUI_PRIMARY_THEME`/`AWSUI_SECONDARY_THEMES` yourself before `npm start` to force a specific composition instead.

The dev server runs at `http://localhost:8080`. Pages are served from `pages/<component-name>/`.