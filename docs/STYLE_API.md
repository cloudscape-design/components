# Style API (v2)

Style API v2 lets consumers restyle parts of a component with their own CSS classes. A consumer passes class names
through the `styleClassNames` prop and writes their rules with generated Sass mixins:

```scss
@use '@cloudscape-design/components/styling/button';

.my-button {
  @include button.root($background: #0f766e, $border-radius: 999px);

  &:hover {
    @include button.root($background: #115e59);
  }
}
```

```tsx
<Button styleClassNames={{ root: 'my-button' }}>Save</Button>
```

This guide explains how to add the Style API to a component. For the rules of a component's own CSS, see
[Component styles](COMPONENT_STYLES.md). The Sass utilities themselves live in
[component-toolkit](https://github.com/cloudscape-design/component-toolkit/tree/main/src/internal/style-api); read
their source comments for the full API.

## Concepts

- **Slot**: a named part of the component (`root`, `dismissButton`, `headerCell`). The consumer's class goes on the
  element that paints that part.
- **Property**: a CSS property the consumer may set directly on the slot element, for example `background` or
  `border-radius`. Consumer rules win over component rules, in every state.
- **Token**: a `--awsui-style-<name>` custom property. Use a token when the value has to reach something the slot
  class can't, for example a pseudo-element, an SVG part or several inner elements. The focus ring is the common case.
- **Forward**: a slot that hands its class to a nested Cloudscape component, for example Alert's `dismissButton`, which
  goes to an internal Button's `root`.

Each component declares its slots in its `styles.scss`. The build turns these declarations into the style API docs
(`lib/components-definitions/style-api-doc/<component>.json`) and the consumer mixins
(`lib/components/styling/<component>.scss`), so the docs and mixins can't drift from the implementation.

## Design principles

- **Cover what consumers need, not every element.** Add a slot for a part with its own visual identity. Don't add
  slots or properties for content the consumer passes in (children, labels, icons, `ReactNode` props): they already
  style that content themselves.
- **Prefer properties over tokens.** A property is simpler to implement and to use. Add tokens only when a property
  can't reach the painted element.
- **Be transparent.** A consumer value applies in every state, including hover, disabled and read-only. Don't add
  per-state tokens. Consumers express states with their own selectors (`.my-item:hover`, `.my-item[aria-pressed='true']`)
  or with a callback slot (see below).
- **Reuse nested components.** If a part is an instance of another component, forward to it instead of declaring new
  properties. Forward to a single slot only when the target slot is `root` and it is the target's only slot; otherwise
  forward to the whole component.
- **Stay consistent.** Copy the slot and token names of the closest component that already has the Style API. Name
  properties after CSS properties; name tokens after the part they paint (`fill-color`, `line-width`), not after a CSS
  property they don't set.
- **Don't change the default look.** Every token read falls back to the value the component used before.
- **Keep descriptions minimal.** Describe a slot or token only when its name doesn't explain it.

## Adding the Style API to a component

### 1. Declare slots in `styles.scss`

Use the wrapper in [`src/internal/styles/style-api.scss`](../src/internal/styles/style-api.scss). It turns the Style
API off for the console system, so components need no gating of their own.

```scss
@use '../internal/styles/style-api' as style-api;

// Properties only.
@include style-api.docs('root', $properties: (color, background, border, border-radius, padding));

// Tokens: resolve the names once, register them, and read them with a fallback.
$control-tokens: style-api.resolve((fill-color, border-color), carrier);
@include style-api.register($control-tokens);
@include style-api.docs('control', $control-tokens);

.control {
  @include style-api.carriers($control-tokens);
}

.control-icon {
  fill: style-api.value($control-tokens, fill-color, awsui.$color-background-control-default);
}

// A nested component.
@include style-api.docs-forward('dismissButton', 'button', 'root');
```

Allowlists name shorthands (`border`, `padding`, `border-radius`); the generated mixins expand them into longhand
arguments. For an existing component, wrap the current value reads with `style-api.value(...)` instead of restructuring
its state rules. This keeps the diff small and the default rendering identical.

### 2. Apply the classes in the component

Put each slot class on the element that paints the slot. For a forward, pass the class to the nested component's
`styleClassNames`.

When consumers need per-item or per-state classes they can't get from CSS (for example, a table row's `selected`
state), type the slot with `StyleSlot<Args>` from `src/types/utils.ts` and resolve it with `getStyleClassName`
from `src/internal/utils/style-slot.ts`. Don't add callback arguments that consumers can derive from a parent slot or from their own state.

### 3. Add a dev page

Add `pages/<component>/style-api-v2.page.tsx` with a `style-api-v2.scss` that uses the generated mixins through
`@use '~components/styling/<component>'`. Show the main variants and states and keep text contrast readable in
light and dark mode.

### 4. Test

- Add a unit test that checks the classes land on the right elements.
- Update the style API docs snapshot: build, then run
  `TZ=UTC npx jest -c jest.unit.config.js --testPathPattern snapshot-tests/style-docs -u`, and review the diff as the
  public API change it is.
- Add the dev page to the component's visual regression definition in `test/definitions/visual/<component>.ts`.
  Add a setup step that opens popovers or dropdowns when their styles are only visible when open.
