# Style API

The Cloudscape Style API is a mechanism that allows altering the CSS styles of individual Cloudscape components. It is designed to work at the component level and provides greater flexibility compared to theming.

## Style API Tenets

The Style API exposes a controlled set of CSS class names and custom properties that consumers can use to customize the appearance of Cloudscape components. These tenets exist to prevent encapsulation breaks — where a style applied to one element unintentionally affects nested components.

### 1. Use CSS layers for application and global styles

Cloudscape component styles are placed in a CSS layer. This ensures that un-layered style declarations — such as those targeting `main`, `h1`, or `button` tags from `normalize.css` or similar sources — cannot unintentionally override component styles.

To prevent conflicts, wrap global styles, application styles, and Style API overrides in their own named layers and explicitly declare their order:

```css
/* Declare layer order: global resets and app styles first, then components, then Style API overrides */
@layer global, application, awsui-components, awsui-style-api;

/* Third-party resets and normalize styles */
@layer global {
  h1 { font-size: 2em; }
}

/* Application styles — declared before awsui-components so they cannot accidentally override component styles */
@layer application {
  .my-app { color: #333; }
}

/* Style API overrides — declared last so they intentionally win over component defaults */
@layer awsui-style-api {
  .my-table.awsui-style-table-root {
    --awsui-style-table-row-selection-border-color: #db2777;
  }
}
```

### 2. Prefer CSS variables over direct styles

When a CSS custom property exists for what you want to change, use it. Variables are scoped to the component that defines them and do not cascade into child components.

```css
/* ✅ Safe — variable is scoped to the component */
.my-table.awsui-style-table-root {
  --awsui-style-table-row-selection-border-color: #db2777;
}

/* ❌ Wrong — this depends on an implementation detail of the table and can conflict with
   cell or selection border styles. Use the variable above instead. */
.my-table .awsui-style-table-table-row {
  border-color: #db2777;
}
```

### 3. Do not depend on a component's internal structure

The nesting of elements inside components can change, as can tag names, unless explicitly specified in the Style API contract. Only use the selectors, properties, and attributes declared in the Style API, and avoid making assumptions about the relative position of elements.

```css
/* ✅ Safe — the counter is somewhere inside .my-header, regardless of its exact position */
.my-header .awsui-style-header-counter {
  color: #5551f2;
}

/* ❌ Wrong — the exact relationship between the header root and counter may change */
.my-header > .awsui-style-header-counter {
  color: #af2555;
}

/* ❌ Wrong — the counter's tag name may change */
.my-header span.awsui-style-header-counter {
  color: #af2555;
}
```

### 4. Do not apply styles broadly

Use theming to set colors, borders, or spacing globally. Use the Style API only to target individual elements, to prevent unintended side effects.

```css
/* ✅ Safe — targets only the header counter inside a specific component instance */
.my-header .awsui-style-header-counter {
  color: #5551f2;
}

/* ❌ Wrong — overrides the color of every descendant element, including buttons, links, and nested components */
.my-container * {
  color: #af2555;
}
```

If you need to propagate a value, set a CSS variable on the root selector and let the components that support it pick it up.

---

## Style API Docs

### Button

#### Selectors

##### `.awsui-style-button-root`

Root element of the button. Renders as a `<button>` or `<a>` depending on the component properties.

**Applies to:** `<button>`, `<a>`

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `aria-disabled` | Present when the button is disabled. Prefer this over the "disabled" attribute when targeting disabled buttons or links. |

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

### Button Dropdown

#### Selectors

##### `.awsui-style-button-dropdown-main-action`

Main action button.

**Applies to:** `<button>`

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

##### `.awsui-style-button-dropdown-trigger`

Trigger button that opens the dropdown menu.

**Applies to:** `<button>`

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

##### `.awsui-style-button-dropdown-dropdown`

Dropdown element that includes options and groups. When component is used with `expandToViewport`, the dropdown is rendered in a portal and thus will not be nested under the root element. Use `referrerClassName` to attached a custom class to the dropdown in this case.

##### `.awsui-style-button-dropdown-dropdown-option`

Dropdown menu option.

**Applies to:** `<li>`

##### `.awsui-style-button-dropdown-dropdown-group`

Dropdown menu group.

**Applies to:** `<ul>`

##### `.awsui-style-button-dropdown-dropdown-expandable-group`

Interactive dropdown menu group.

**Applies to:** `<ul>`

### Checkbox

#### CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-checkbox-fill-color` | Background color of the checkbox. |
| `--awsui-style-checkbox-mark-color` | Color of the checkmark or indeterminate mark inside the checkbox. |

#### Selectors

##### `.awsui-style-checkbox-root`

Root element of the checkbox. Contains the hidden semantic input, the visible checkbox SVG, and the label.

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `data-checked` | Present when the checkbox is checked. |
| `data-indeterminate` | Present when the checkbox is in an indeterminate state. |
| `data-disabled` | Present when the checkbox is disabled. |

##### `.awsui-style-checkbox-label`

Label element rendered next to the checkbox SVG.

### Collection Preferences

#### Selectors

##### `.awsui-style-collection-preferences-trigger`

Collection preferences trigger that opens the preferences modal.

**Applies to:** `<button>`

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

### Header

#### Selectors

##### `.awsui-style-header-text`

The header text element.

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-typography-font` | Typography font. |
| `--awsui-style-typography-font-size` | Typography font size. |
| `--awsui-style-typography-font-style` | Typography font style. |
| `--awsui-style-typography-font-weight` | Typography font weight. |
| `--awsui-style-typography-color` | Typography font color. |

##### `.awsui-style-header-counter`

The header counter element.

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-typography-font` | Typography font. |
| `--awsui-style-typography-font-size` | Typography font size. |
| `--awsui-style-typography-font-style` | Typography font style. |
| `--awsui-style-typography-font-weight` | Typography font weight. |
| `--awsui-style-typography-color` | Typography font color. |

### Icon

#### CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-icon-color` | Color of the icon. |

### Input

#### Selectors

##### `.awsui-style-input-input`

The semantic input element.

**Applies to:** `<input>`

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `aria-invalid` | Present when the input is in an invalid state. |

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-input-placeholder-color` | Color of the placeholder text. |
| `--awsui-style-input-placeholder-font` | Font shorthand for the placeholder text. |
| `--awsui-style-input-placeholder-font-style` | Font style of the placeholder text. |
| `--awsui-style-input-placeholder-font-weight` | Font weight of the placeholder text. |

### Link

#### Selectors

##### `.awsui-style-link-root`

Root element of the link that renders as `<a>`.

**Applies to:** `<a>`

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

### Pagination

#### Selectors

##### `.awsui-style-pagination-button`

Pagination button (with page number or arrow).

**Applies to:** `<button>`

**CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

### Table

#### CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-table-row-selection-border-color` | Border color of a selected row. |
| `--awsui-style-table-row-selection-background-color` | Background color of a selected row. |

#### Selectors

##### `.awsui-style-table-root`

Root element of the table. Contains the table and its slots (header, footer, filter, pagination, preferences).

##### `.awsui-style-table-table`

The semantic table element.

**Applies to:** `<table>`

##### `.awsui-style-table-table-thead`

The thead element. Combine with row or cell selectors to target header-specific styles.

**Applies to:** `<thead>`

##### `.awsui-style-table-table-tbody`

The tbody element. Combine with row or cell selectors to target body-specific styles.

**Applies to:** `<tbody>`

##### `.awsui-style-table-table-row`

A table row element.

**Applies to:** `<tr>`

##### `.awsui-style-table-table-cell`

A table cell element. Present on both header (th) and data (td) cells.

**Applies to:** `<td>`, `<th>`

##### `.awsui-style-table-table-selection-cell`

The selection cell in the first column of tables with row selection enabled.

**Applies to:** `<td>`

##### `.awsui-style-table-table-header-cell-label`

The label of table header cells.

##### `.awsui-style-table-table-sorting-toggle`

The sortable header sorting toggle button.

**Applies to:** `<button>`

##### `.awsui-style-table-table-resize-handle`

The column resize handle in tables with resizable columns.

**Applies to:** `<button>`

##### `.awsui-style-table-table-expand-toggle`

The row expand toggle button in tables with expandable rows.

**Applies to:** `<button>`
