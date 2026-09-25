---
applyTo: "src/*/{index,internal,interfaces}.{ts,tsx}"
---
# Component structure & doc voice

Apply the contract rules below — they hold regardless of a component's shape. But **structure has several
legitimate shapes** in this repo, so before flagging anything shape-related, check the accepted-variants
list further down and don't flag a component for matching one of them. Cite the rule when flagging; never
invent a divergence.

## Contract rules — hard, shape-independent (a violation is almost certainly a bug)
- **Wrapper checklist (new, non-single-impl components):** `index.tsx` starts with `'use client';` as its
  first statement, calls `applyDisplayName(X, '${Name}')`, and has `export { ${Name}Props }` + one default
  export. These are near-universal in the repo — flag any that are absent.
- **forwardRef ⇔ `Props.Ref`.** If (and only if) the component exposes a `${Name}Props.Ref`, it must use
  `React.forwardRef` and forward the ref. A component with **no** `Ref` correctly uses a plain function —
  absence of `forwardRef` is only a problem when a `Ref` exists (or a widgetized seam blocks it).
- **`Ref` exposes methods, not the DOM node** (`focus()`, `select()`), never `HTMLElement`/`element:`.
- **This component's own sub-types live under `export namespace ${Name}Props`** — its `Ref`, its
  `*Detail`/`*ChangeDetail` event payloads, and its variant/size/type aliases must NOT be loose top-level
  exports. (Private sub-component prop types are exempt — see the allowlist.)
- **`getBaseProps(...)` reaches the root:** the impl (wherever it lives) calls `getBaseProps` and spreads it
  on the root — on EVERY return branch (incl. loading/early returns) — so consumer `className`/`id`/`data-*`
  are not dropped. Flag only if genuinely dropped.
- **`__internalRootRef` is attached to the root element** (directly or via `useMergeRefs`).
- **Internal-only props are `__`-prefixed.** Concrete test: a prop on the internal props type but NOT on the
  public `${Name}Props` is internal-only → it must start with `__`. Flag any that doesn't.
- **Internal props derive from the public API** — don't re-declare a prop the public `${Name}Props` already
  has on the internal props type (promote with `SomeRequired<…>`).

## Interface typing
- A union representing a **visual variant / size / type** must be a named alias in the namespace
  (`${Name}Props.Variant`). **Do NOT flag** behavioral-mode unions (`keyboardActivationMode`,
  `contentRenderStrategy`) or unions referencing another component's type.
- Event handler props (`on*`) use `CancelableEventHandler<Detail>` / `NonCancelableEventHandler<Detail>`,
  never a bare function. WHY: the build fails for non-standard event-handler types.
- Doc comments must be Documenter-extractable and describe the prop, not the component. Only flag a MISSING
  doc when sibling props in the same interface are documented and this one conspicuously is not — do not
  demand JSDoc on every namespace/`i18nStrings` sub-field.

## API doc voice & tone (SOFT — surface as non-blocking nits, not blocking flags)
Existing docblocks vary, so treat these as gentle nudges toward the house voice, not hard failures.
- **Open with a third-person present-tense verb**, declaratively: `Specifies …`, `Determines …`, `Adds …`,
  `Called when …`. Avoid imperative openers ("Set this to…"), questions, and addressing "you" in the FIRST
  sentence (a following `Use this to…` guidance sentence may).
- **Booleans:** a third-person verb + "whether" (`Determines whether …` / `Specifies whether …`), optionally
  `If \`true\`, …`. **Events:** `Called when …` (+ `The event \`detail\` contains …`). **aria props:**
  `Adds \`aria-x\` to <element>`.
- **Enums (3+ values):** a bulleted list of backticked values marking `(default)`. Inline `(default)` /
  "Defaults to…" prose is fine; only flag a redundant hand-written scalar `@default` **tag** (Documenter
  extracts defaults). **Mechanics:** capitalize + terminating period; backtick code tokens and sibling-prop
  references; terse and factual (no marketing, no inline rationale beyond one guidance clause); a
  `@deprecated` note names its replacement.

## Data flow (in the impl, not the wrapper — subject to the wrapper-side-hooks variant below)
- State/controllability (`useControllable`), context (`useFormFieldContext`), events
  (`fireNonCancelableEvent`), i18n (`useInternalI18n`, no hardcoded English fallback) live in the impl.
- Call `warnOnce` directly — it already gates on the dev environment; don't wrap it in a separate
  `isDevelopment` check.
- `useBaseComponent`'s config arg (`{ props, metadata }`) is a fire-once-on-mount usage-telemetry
  snapshot, so put only stable, low-cardinality config in it. `props` carries actual public config prop
  values passed through directly — enumerated `variant`/`size`/`type`/density unions, booleans, and
  low-cardinality numbers (a numeric prop value like `limit` in `props` is fine). `metadata` carries
  derived facts — booleans (`hasX: Boolean(...)`) or numbers (counts) — especially reductions of
  high-cardinality inputs. Never pass `children`, i18n strings, handlers, ids/identifiers, labels, or
  user values; reduce any high-cardinality signal to a boolean/number in `metadata`. Omit the arg when
  nothing is trackable.

## Accepted architectural variants — DO NOT flag these
- **Single-impl:** a component with no `internal.tsx` folds its implementation into `index.tsx` (plus
  helper files). `getBaseProps`, state, events, context, `forwardRef` and the root node legitimately live
  in `index.tsx` here (e.g. tabs, tag-editor, badge, textarea).
- **Widgetized / loadable:** `internal.ts(x)` re-exports `createWidgetizedX(createLoadableComponent(…))`;
  the real impl is in `implementation.tsx`, internal props in `internal-interfaces.ts` (e.g. flashbar,
  app-layout, table, breadcrumb-group, drawer). Don't expect `InternalX`/`getBaseProps`/root in
  `internal.tsx`; `forwardRef` may be impossible through the widgetized seam.
- **Wrapper-side hooks:** `index.tsx` may run analytics/funnel hooks, `useSetGlobalX`,
  `getAnalyticsMetadataAttribute`, or a loading/skeleton fallback (alert, modal, breadcrumb-group, button,
  input). "Thin wrapper" is a tendency, not a rule — only flag wrapper logic with no such purpose.
- **`internal.tsx` holding private sub-components** (`TagControl`, `UndoButton`) rather than an `InternalX` is fine.
- **Sanctioned imports:** importing a sibling's `internal.tsx`/`implementation.tsx`, or another component's
  **publicly exported** interface, is normal. Only flag importing another component's **styles** or clearly
  private files across `src/<other>/`.
- **Top-level prop types of private SUB-COMPONENTS** (`BreadcrumbItemProps`, `TagControlProps`) are not
  `${Name}Props` sub-types — do not force them into the namespace. (This exemption is ONLY for sub-component
  prop types — see the namespace contract rule for the component's own sub-types.)

## Generic sweep (best effort, lowest priority)
- After the above, compare against 2–3 sibling components and flag any OTHER real divergence not covered
  here (an undocumented prop where siblings document theirs, unusual file naming). Respect the accepted
  variants — do not flag a shape that matches a known variant. Name the sibling you compared against.
