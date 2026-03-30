# Human Evaluation for AI Instructions / AGENTS.MD

## Table A — Knowledge / Q&A Prompts

| Test | Prompt | Was the response helpful? | Was the response Accurate? (1-5) | What was missing? | Token cost / Credits Used | Response time | Notes | Response |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | How do I style a component in this repo? What's the right way to apply spacing, colors, and typography? | Yes | 4.8 | — | 3.64 | 1m 56s | Claude Opus 4.6. Read relevant files, included practical examples with design tokens, logical CSS, RTL support, and typography mixins. It's more structured compared to the without AGENTS.md file. | [response](responses/with/A1.md) |
| A2 | How do I write tests for a component? What patterns and utilities should I use? How do I run tests? | Yes | 4.8 | Didn't mention screenshot/visual regression tests initially. | 2.41 + 1.50 | 41s + 27s | Claude Opus 4.6. Better structured than without AGENTS.md, explicitly guides on how to run tests more clearly. Follow-up on visual regression was solid but used ScreenshotArea directly instead of SimplePage. | [response](responses/with/A2.md) |
| A3 | How do I test components in the browser. | Yes | 4 | No mention of automated browser tests (integration/integ tests). | 0.27 | 5s | Claude Opus 4.6. Concise, mentions React 18 variant. Only covered manual dev server testing, not integration test automation. | [response](responses/with/A3.md) |
| A4 | How is a component organized in this repo? What should I consider when implementing new component? | Yes | 4.8 | — | 1.83 | 33s | Claude Opus 4.6. Read 8 files. Comprehensive overview covering file structure, public/internal split, props, events, styling, i18n, testing, and browser support. Good general response that enables deeper dives. | [response](responses/with/A4.md) |
| A5 | How do I build and run this project locally? What commands should I use? | Yes | 4.8 | — | 0.32 | 6s | Claude Opus 4.6. Very concise and helpful, covered all build commands including React 18 variants. | [response](responses/with/A5.md) |

## Table B — Implementation / Code Generation Prompts

| Test | Prompt | Was the response helpful? | Was the response Accurate? (1-5) | What was missing? | Token cost / Credits Used | Response time | Notes | Response |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Create a dev page for the badge component using app context to control color | Yes | 5 | — | 4.77 | 1m 22s | Claude Opus 4.6. Working solution, uses SimplePage template, typed AppContext, all 9 color options. Read ~8 files to match conventions. | [response](responses/with/B1.md) |
| B2 | Write a style API for the token component | Somewhat | 4 | No tests, required follow-up for SCSS/build-tools wiring. Similar to without AGENTS.md. | 23.45 | 6m 8s | Claude Opus 4.6. Needed 2 prompts. First created style.tsx + interfaces, second wired SCSS custom props and build-tools. No tests included. | [response](responses/with/B2.md) |
| B3 | Add a size prop to badge component | Somewhat | 3 | No tests, no permutation page update. Implementation not close to good, would need follow-up prompts. General prompt so it underperformed. | 6.64 | 3m 10s | Claude Opus 4.6. Build passed but tests failed (pre-existing config issue). Similar quality to without AGENTS.md. | [response](responses/with/B3.md) |
| B4 (optional if the AI didn't implement it in B3) | Write a unit test for the new size prop in badge | | | | | | | |
