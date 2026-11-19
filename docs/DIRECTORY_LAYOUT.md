# Directory Layout

```
├── __mocks__                   - jest mocks for external dependencies
│
├── build-tools                 - build tasks and configuration for gulp
│
├── pages                       - react pages for development, scenario and permutation testing
│   └── <page>.page.tsx
│
├── src
│   ├── __a11y__                - global a11y tests for all components
│   ├── __integ__               - global integ tests for all components
│   ├── __tests__               - global unit tests for all components
│   │
│   ├── <component-dir>
│   │   ├── __tests__           - jest unit tests
│   │   ├── __integ__           - jest integration tests
│   │   ├── __motion__          - jest motion tests
│   │   ├── index.tsx           - main component file (imports other files and styles)
│   │   └── styles.scss         - main SCSS file
│   │
│   ├── test-utils              - test utils for components
│   │   ├── dom                 - main source code for test utils
│   │   └── selectors           - utils for integration testing, generated from the code in `dom` folder
│   │
│   ├── i18n                    - internationalization: messages, providers, and the useInternalI18n hook
│   │
│   └── internal                - library internals
│       ├── base-component      - necessary declarations for every public component
│       ├── components          - internal utility components
│       ├── events              - utilities for firing public events
│       ├── hooks               - internal utility hooks
│       ├── generated           - generated code from style-dictionary
│       └── styles              - base styles and SCSS-mixins
│
├── lib                         - build output
│   ├── components              - the primary components package
│   ├── components-definitions  - generated metadata for components
│   └── design-tokens           - exported design tokens
│
└── style-dictionary            - design token definitions (colors, spacing, typography, etc.) 
```
