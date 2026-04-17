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