---
applyTo: "src/test-utils/**"
---
# Test-utils (public contract) conventions
- Selector methods must generate a STATIC CSS selector with no access to query results — they
  can't branch on `nth-child` conditionally. Design the DOM (e.g. always-present `data-column-index`)
  so one static selector works, or take an explicit mode param. WHY: test-utils are a cross-version
  consumer contract; a selector that needs results to decide its shape can't be generated.
- Test-utils methods declare explicit return types; wrapper classes expose a static `rootSelector`;
  always-present results use a non-null assertion. WHY: documented public-contract conventions.
