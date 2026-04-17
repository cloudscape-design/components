# Style API Tenets

The Style API exposes a controlled set of CSS class names and custom properties that consumers can use to customise the appearance of Cloudscape components. These tenets exist to prevent encapsulation breaks — where a style applied to one element unintentionally affects nested components.

---

## 1. Prefer CSS variables over direct styles

When a CSS custom property exists for what you want to change, use it. Variables are scoped to the component that defines them and do not cascade into child components.

```css
/* ✅ Safe — variable is scoped */
.my-table.awsui-style-table-root {
  --awsui-style-table-row-selection-border-color: #db2777;
}

/* ❌ Risky — direct color may cascade into nested components */
.my-table.awsui-style-table-root {
  color: #db2777;
}
```

---

## 2. Apply visual styles only to terminal elements

Apply `color`, `background`, `font-*`, `border`, and other visual properties only to selectors that represent leaf-level HTML elements — elements that contain no Cloudscape component children. Intermediate wrappers and component roots should be styled via variables (see tenet 1).

```css
/* ✅ Safe — cell is a terminal element */
.my-table .awsui-style-table-table-cell {
  background-color: #fff1f2;
}

/* ❌ Risky — row contains cells and potentially other components */
.my-table .awsui-style-table-table-row {
  background-color: #fff1f2;
}
```

---

## 3. Use slot selectors for targeting only, not for visual styles

Slot selectors (e.g. `awsui-style-table-slot-header`) identify where content is placed in the component layout. Use them to reach the right place, then target a specific child element. Do not apply visual properties directly to a slot selector — slots contain arbitrary consumer content and any visual style will cascade into it unpredictably.

Layout properties (`display`, `gap`, `padding`) are acceptable on slots when needed.

```css
/* ✅ Safe — slot used for targeting, style applied to a specific child */
.my-table .awsui-style-table-slot-header .my-heading {
  color: #831843;
}

/* ✅ Acceptable — layout-only property on a slot */
.my-table .awsui-style-table-slot-footer {
  padding-block: 8px;
}

/* ❌ Risky — visual style on a slot cascades into all slot content */
.my-table .awsui-style-table-slot-header {
  color: #831843;
}
```

---

## 4. Never use universal or broad descendant selectors from a slot

Selectors like `* { color: inherit }` or `.awsui-style-table-slot-header * { ... }` applied from a slot will reach into every nested component and override their internal styles. This is the most dangerous pattern.

```css
/* ❌ Never do this */
.my-table .awsui-style-table-slot-header * {
  color: inherit;
}
```

If you need to propagate a value, set a CSS variable on the root and let components that support it pick it up.

---

## 5. Set CSS variables at the component root

Declare `--awsui-style-*` overrides on the component root selector, not on intermediate elements. This keeps the override surface predictable and easy to audit.

```css
/* ✅ Variables declared at the root */
.my-table.awsui-style-table-root {
  --awsui-style-table-row-selection-border-color: #db2777;
  --awsui-style-focus-outline-color: #9d174d;
}

/* ❌ Variable declared mid-tree — harder to reason about scope */
.my-table .awsui-style-table-table-tbody {
  --awsui-style-table-row-selection-border-color: #db2777;
}
```

---

## 6. Keep layout and visual overrides in separate rules

Mixing structural properties (`display`, `padding`, `gap`) with visual ones (`color`, `background`) in the same rule makes it harder to audit which overrides are safe and which carry cascade risk.

```css
/* ✅ Separated */
.my-table .awsui-style-table-slot-footer {
  padding-block: 8px;
}
.my-table .awsui-style-table-slot-footer .my-footer-text {
  color: #db2777;
}

/* ❌ Mixed — harder to audit */
.my-table .awsui-style-table-slot-footer {
  padding-block: 8px;
  color: #db2777;
}
```
