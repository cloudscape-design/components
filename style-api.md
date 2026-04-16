# Button

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Focus outline color |
| `--awsui-style-focus-outline-width` | Focus outline width |
| `--awsui-style-focus-outline-offset` | Focus outline distance from the focused element |
| `--awsui-style-focus-outline-radius` | Focus outline border radius |
| `--awsui-style-icon-color` | Icon color |

## Selectors

### `.awsui-style-button-root`

The root element which can be a button or an anchor depending on properties.

**Applies to:** `<button>`, `<a>`

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `aria-disabled` | Can be used to select disabled buttons or links. Do not use "disabled" attribute for that. |

# Checkbox

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Focus outline color |
| `--awsui-style-focus-outline-width` | Focus outline width |
| `--awsui-style-focus-outline-offset` | Focus outline distance from the focused element |
| `--awsui-style-focus-outline-radius` | Focus outline border radius |
| `--awsui-style-checkbox-fill-color` | Color of the checkbox rect background |
| `--awsui-style-checkbox-mark-color` | Color of the checkbox mark |

## Selectors

### `.awsui-style-checkbox-root`

The root element of the checkbox that includes invisible semantic input and visible checkbox SVG and label.

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `data-checked` | Use it to assert if the checkbox is checked. |
| `data-indeterminate` | Use it to assert if the checkbox is indeterminate. |
| `data-disabled` | Use it to assert if the checkbox is disabled. |

### `.awsui-style-checkbox-label`

Checkbox selector, rendered next to checkbox SVG element.

# Icon

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-icon-color` | Icon color |

## Selectors

_No selectors defined._

# Input

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--awsui-style-focus-outline-color` | Focus outline color |
| `--awsui-style-focus-outline-width` | Focus outline width |
| `--awsui-style-focus-outline-offset` | Focus outline distance from the focused element |
| `--awsui-style-focus-outline-radius` | Focus outline border radius |
| `--awsui-style-input-placeholder-color` | Color of the input placeholder |
| `--awsui-style-input-placeholder-font` | Font of the input placeholder |
| `--awsui-style-input-placeholder-font-style` | Font style of the input placeholder |
| `--awsui-style-input-placeholder-font-weight` | Font weight of the input placeholder |

## Selectors

### `.awsui-style-input-root`

The root element of the input that includes a semantic input and optional icons to the left and right.

### `.awsui-style-input-input`

The semantic input element.

**Applies to:** `<input>`
