# Button

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-icon-color` | Color of the icon. |

## Selectors

### `.awsui-style-button-root`

Root element of the button. Renders as a `<button>` or `<a>` depending on the component properties.

**Applies to:** `<button>`, `<a>`

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `aria-disabled` | Present when the button is disabled. Prefer this over the "disabled" attribute when targeting disabled buttons or links. |

# Checkbox

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Color of the focus outline. |
| `--awsui-style-focus-outline-width` | Width of the focus outline. |
| `--awsui-style-focus-outline-offset` | Gap between the focused element and the focus outline. |
| `--awsui-style-focus-outline-radius` | Border radius of the focus outline. |
| `--awsui-style-checkbox-fill-color` | Background color of the checkbox. |
| `--awsui-style-checkbox-mark-color` | Color of the checkmark or indeterminate mark inside the checkbox. |

## Selectors

### `.awsui-style-checkbox-root`

Root element of the checkbox. Contains the hidden semantic input, the visible checkbox SVG, and the label.

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `data-checked` | Present when the checkbox is checked. |
| `data-indeterminate` | Present when the checkbox is in an indeterminate state. |
| `data-disabled` | Present when the checkbox is disabled. |

### `.awsui-style-checkbox-label`

Label element rendered next to the checkbox SVG.

# Icon

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-icon-color` | Color of the icon. |

## Selectors

_No selectors defined._

# Input

## CSS Variables

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

## Selectors

### `.awsui-style-input-root`

Root element of the input. Contains the semantic input element and optional leading and trailing icons.

### `.awsui-style-input-input`

The semantic input element.

**Applies to:** `<input>`

# Table

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-table-row-selection-border-color` | Border color of a selected row. |
| `--awsui-style-table-row-selection-background-color` | Background color of a selected row. |

## Selectors

### `.awsui-style-table-root`

Root element of the table. Contains the table and its slots (header, footer, filter, pagination, preferences).

### `.awsui-style-table-header`

Header slot of the table.

### `.awsui-style-table-footer`

Footer slot of the table.

### `.awsui-style-table-filter`

Filter slot of the table.

### `.awsui-style-table-pagination`

Pagination slot of the table.

### `.awsui-style-table-preferences`

Preferences slot of the table.

### `.awsui-style-table-table`

The semantic table element.

**Applies to:** `<table>`

### `.awsui-style-table-table-thead`

The thead element. Combine with row or cell selectors to target header-specific styles.

**Applies to:** `<thead>`

### `.awsui-style-table-table-tbody`

The tbody element. Combine with row or cell selectors to target body-specific styles.

**Applies to:** `<tbody>`

### `.awsui-style-table-table-row`

A table row element.

**Applies to:** `<tr>`

### `.awsui-style-table-table-cell`

A table cell element. Present on both header (th) and data (td) cells.

**Applies to:** `<td>`, `<th>`

### `.awsui-style-table-table-selection-cell`

The selection cell in the first column of tables with row selection enabled.

**Applies to:** `<td>`

### `.awsui-style-table-table-resize-handle`

The column resize handle in tables with resizable columns.

**Applies to:** `<button>`

### `.awsui-style-table-table-expand-toggle`

The row expand toggle button in tables with expandable rows.

**Applies to:** `<button>`
