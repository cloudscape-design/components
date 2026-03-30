# Testing Without AGENTS.MD

Evaluation of AI assistant responses when no AGENTS.MD file is present in the repository.
This serves as the baseline to compare against results with AGENTS.MD.

## Instructions

1. Ensure there is no `AGENTS.MD` file in the repository root before running these tests.
2. Start a fresh AI session for each prompt to avoid context carryover.
3. Record results in the tables below.
4. Full responses are saved in [`responses/without/`](responses/without/).

## Table A — Knowledge / Q&A Prompts

| Test | Prompt | Response | Was the response helpful? | Was the response Accurate? (1-5) | What was missing? | Token cost / Credits Used | Response time | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | How do I style a component in this repo? What's the right way to apply spacing, colors, and typography? | [A1](responses/without/A1.md) | Yes | 4 | Missed `border-radius` and `border-style` in disallowed shorthand list. Didn't mention `selector-max-universal` or license header stylelint rules. No mention of `styles-reset` mixin origin. | 4.03 | 1m 4s | Verbose but thorough. Correctly identified token imports, typography mixins, spacing tokens, color tokens, and key stylelint constraints. Read stylelint config which helped accuracy. |
| A2 | How do I write tests for a component? What patterns and utilities should I use? How do I run tests? | [A2](responses/without/A2.md) | Yes | 4 | "How to run tests" section could be more detailed (e.g., running individual test files, watch mode). Didn't mention dev pages. | 3.23 / 3.62 | 1m 22s / 1m 29s | Content is accurate but less well-structured compared to A1. Initial response covered unit and integ patterns with correct code. Follow-up accurately described permutations/screenshot pattern |
| A3 | How do I test components in the browser? | [A3](responses/without/A3.md) | Yes | 3.5 | No mention of `start:integ` or `start:react18` commands. Didn't mention needing `quick-build` before first `npm start`. No explanation of URL pattern structure (`#/light\|dark/<component>/<page>`). Assumed port 8080 without verifying. No mention of React 18 testing support. | 0.98 | 21s | Short and to the point but shallow. Got the basics right (`npm start`, gulp watch + webpack serve, hash routing, pages directory). Missed important dev workflows like integ pages and React 18 mode. |
| A4 | How is a component organized in this repo? What should I consider when implementing a new component? | [A4](responses/without/A4.md) | Yes | 4 | No mention of RTL (right-to-left) support considerations. Didn't cover styling conventions (design tokens, stylelint rules, disallowed shorthands). Mentioned `warnOnce` which is a minor detail not essential for the overview. No mention of i18n/internationalization patterns. Didn't discuss the `selectors` test-utils (for integ tests) alongside `dom` test-utils. | 3.95 | 1m 50s | File structure explanation was well done with good simple/complex examples. Read ~15 files to build context. Covered key patterns (index/internal split, interfaces, styles, test-utils, pages) accurately. Slightly over-detailed on niche topics (warnOnce, analytics) while missing broader concerns (RTL, styling rules, i18n). |
| A5 | How do I build and run this project locally? What commands should I use? | [A5](responses/without/A5.md) | Yes | 4.5 | No mention of React 18 build (`npm run build:react18` / `REACT_VERSION=18`). Didn't mention theme-specific builds. | 0.91 | 13s | Good, concise response. Correctly identified `npm install`, `npm run build`, `npm start`, `quick-build`, test commands, and lint. Mentioned Windows caveat from CONTRIBUTING.md. Could be better with React 18 info. |


## Table B — Implementation / Code Generation Prompts

| Test | Prompt | Response | Was the response helpful? | Was the response Accurate? (1-5) | What was missing? | Token cost / Credits Used | Response time | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Create a dev page for the badge component using app context to control color | [B1](responses/without/B1.md) | | | | | | |
| B2 | Write a style API for the token component | [B2](responses/without/B2.md) | | | | | | |
| B3 | Add a size prop to badge component | [B3](responses/without/B3.md) | | | | | | |
| B4 | Write a unit test for the new size prop in badge | [B4](responses/without/B4.md) | | | | | | |
