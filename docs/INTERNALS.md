# Internal Utilities

Shared infrastructure lives in `src/internal/`.

## What's in there

- `hooks/` — shared React hooks (component telemetry, controllable state, focus management, container/element queries, visual mode detection, intersection observers, debounce/throttle, etc.)
- `components/` — shared internal UI building blocks (dropdowns, options, focus locks, tooltips, chart primitives, transitions, screen-reader utilities, drag handles, etc.)
- `context/` — React contexts for cross-component communication (form fields, modals, split panels, container headers, etc.)
- `utils/` — pure helper functions (DOM helpers, key handling, date/time, locale, display names, prop stripping, etc.)
- `events/` — event handler type definitions used by all component `on*` props
- `base-component/` — base prop extraction utilities
- `styles/` — shared SCSS mixins
- `analytics/` — telemetry and funnel metrics

Always check `src/internal/` before introducing new utilities, hooks, or shared components.
