---
applyTo: "**/{__tests__,__integ__,__a11y__,__motion__}/**"
---
# Testing conventions
- Assert the observable EFFECT (focus lands on the specific element, value/count/position is
  correct), never `toBeDefined()`/"renders"/"does not crash". A test with no real assertion isn't
  a test. WHY: `toBeDefined()` passes even when focus lands on `document.body`.
- Don't add redundant/duplicate tests; collapse near-duplicates (one test over all item types, not
  one per type). WHY: they add maintenance and integ runtime with no coverage gain.
- Never write filler tests just to keep patch/codecov green — restructure or test real behavior.
  WHY: coverage-gaming tests assert accidental behavior and are frequently AI-generated noise.
- Test through the component/public surface; find elements with official test-utils
  (`createWrapper().findX()`), not raw class-name/DOM selectors. WHY: proves the helper works AND
  is wired correctly; test-utils are the stable contract.
- Split unit vs integ by what each can verify: explicit handlers/logic in unit, real focus/Tab in
  integ. Don't fire an event on an element the user can't focus. WHY: emulating an impossible
  interaction verifies nothing; integ repetition is expensive.
- Don't `istanbul ignore` testable code (e.g. keyboard nav — testable on a plain `<table>`).
  Restructure so the util is reachable. WHY: ignored branches hide real, testable behavior.
- Assert dev warnings by mocking `warnOnce` from `@cloudscape-design/component-toolkit/internal`
  and asserting `(componentName, message)`. WHY: the established deterministic pattern.
- Name tests by user-observable behavior, not internal util names. WHY: internal names in titles
  rot and don't communicate intent.
