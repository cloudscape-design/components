---
applyTo: "src/**/*.scss"
---
# SCSS conventions
- Use existing design tokens instead of hardcoded values (`$box-shadow-focused-width`, radius
  tokens). WHY: keeps theming consistent.
- Put classes that exist only for test selection in `src/<component>/test-classes/styles.scss`.
  WHY: segregated test classes keep integ selectors stable.
- Don't disable lint rules or depend on raw DOM structure / `nth-child` merely as a shortcut — add
  class names to inner elements and target those when possible. When a structural selector or suppression
  is necessary for component behavior, scope it narrowly and document why. WHY: unqualified
  structure-dependent selectors and rule overrides are brittle and re-break as markup changes.
- Choose a token for what the element is, not for the colour it happens to resolve to today: a dropdown
  panel uses dropdown tokens, a form control uses input or button tokens, a container surface uses
  container tokens. Don't borrow another surface's token (for example `$color-background-container-content`
  as a generic "white") for an element that isn't that surface. If the element should show whatever is
  behind it, use `transparent`. WHY: tokens resolve differently per theme, mode, visual context and custom
  theme; a token picked for its current value breaks as soon as those diverge.
