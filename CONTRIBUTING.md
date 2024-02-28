# Contributing Guidelines

## Support

Use this repository to [create bug reports or feature requests](https://github.com/cloudscape-design/components/issues/new/choose). You can also [start a discussion](https://github.com/cloudscape-design/components/discussions) to ask a question. We will do our best to reply. To minimize duplicates, we recommend that you search for existing bug reports, feature requests, or discussions before initiating a new thread.

## Versioning

We release patch versions on a daily basis to release bug fixes and new features and components. Patch versions do not contain breaking changes.

### Public APIs

Our public API consists of

- [Components APIs](https://cloudscape.design/components) (properties, slots, events, functions)
- [Test utilities](https://cloudscape.design/get-started/testing/introduction/)
- Typescript definitions
- [Design tokens](https://cloudscape.design/foundation/visual-foundation/design-tokens)

The inner HTML structure and class names of our components are not part of our APIs. Modifications to those are not considered breaking changes.

## Frameworks support

We support

- React 16.8+
- Jest 25+

## Browsers support

We support the latest 3 major versions of these browsers for desktop.

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari for macOS

We do not support Microsoft Internet Explorer or mobile browsers. We support all viewport sizes across desktop browsers.

## How to contribute code

Currently we only accept code contributions for bug fixes. Follow the steps below to clone, build, test, and open a pull request. A code owner will review the pull request and merge it. Once we merge a pull request, we run additional testing internally before publishing artifacts to npm.

Before sending us a pull request, ensure that:

1. You are working against the latest source on the _main_ branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request:

1. Fork the repository.
2. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Commit to your fork using clear commit messages.
5. Send us a pull request, answering any default questions in the pull request interface.
6. Pay attention to any automated CI failures reported in the pull request, and stay involved in the conversation.

GitHub provides additional documentation on [forking a repository](https://help.github.com/articles/fork-a-repo/) and [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

Please note that we do not guarantee that this project can be built on Windows machines.

### First steps

Clone this repository and install the dependencies:

```
git clone git@github.com:cloudscape-design/components.git
cd components
npm install
```

To generate the build artifacts, run the following command:

```
npm run build
```

Then, start the dev-server by running:

```
npm start
```

This will open a webpack-dev-server at http://localhost:8080 and watch
for file changes.

### Quick rebuild

To quickly rebuild this package, run `npm run quick-build`. This runs only the source code build, skipping
documentation and screenshot testing builds.

### Running tests

The package contains three types of tests:

- **Build-tool tests** test the build-tools code in a NodeJS context.
- **Unit tests** emulate a browser environment using JSDOM.
- **Integration tests** test against real browser behavior on Chrome, with motion disabled.
- **Motion tests** run a specific set of tests on Chrome, with motion enabled.

#### Run all tests:

```
npm test
```

#### Run build tool and unit tests:

```
npm run test:unit
```

#### Run integration tests:

If you're running integration tests on a Mac, make sure you have ChromeDriver:

```
npm i -g chromedriver
```

Then, run the dev server and integration tests in separate terminals:

```
npm start
```

```
npm run test:integ
```

#### Run motion tests:

As in integration tests, make sure you have ChromeDriver installed and start the dev server:

```
npm i -g chromedriver
npm start
```

Then, run the motion tests in a separate terminal:

```
npm test:motion
```

#### Run a single test suite

To run a single test suite, you can call Jest directly using the appropriate config:

```
# Run a single button unit test suite
npx jest -c jest.unit.config.js src/button/__tests__/button.test.tsx

# Run all input integration tests
npx jest -c jest.integ.config.js src/input

# Run motion tests for the flashbar component
npx jest -c jest.motion.config.js src/flashbar

# Test all stylelint rules
npx jest -c jest.build-tools.config.js build-tools/stylelint
```

### Run visual regression tests

Visual regression tests for the permutation pages are automatically run when opening a pull request in GitHub.

#### Checking results in a pull requests

To look at the results of the tests, check the details of the "Visual Regression Tests" action in the pull request.
The logs of the "Test for regressions" step should indicate what pages failed the regression tests.

To check the full report in a browser, go to the action summary and download the `visual-regression-results` artifacts.
Unzip the downloaded archive and open the `html_report/index.html` file in your browser.

If there are unexpected regressions, fix your pull request.
If the changes are expected, call this out in your pull request comments.

#### Running visual tests locally

The visual tests use `backstopjs`, which is installed in the `backstop` folder to keep the dependencies separate from the main dependencies.
Install it from inside the `backstop` folder with: `cd backstop && npm install`.

As a first step, generate the reference images for comparison.
Checkout a version of the package before your changes were applied, build the components, and generate the reference images:

```bash
git checkout main
npx gulp quick-build
npm run start:integ
npm run test:visual reference # from a different shell session
```

Afterwards, repeat the process with your changes, but run the backstop `test` command instead:

```bash
git checkout branch/with-your-changes
npx gulp quick-build
npm run start:integ
npm run test:visual test # from a different shell session
```

After the test is done, you can find a report in `backstop/html_report/index.html` or open it using `npm run test:visual openReport`.

### Directory layout

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
|   |
│   ├── <component-dir>
│   │   ├── __tests__           - jest unit tests
│   │   ├── __integ__           - jest integration tests
│   │   ├── __motion__          - jest motion tests
│   │   ├── index.tsx           - main component file (imports other files and styles)
│   │   └── styles.scss         - main SCSS file
|   │
|   ├── test-utils              - test utils for components
│   │   ├── dom                 - main source code for test utils
│   │   └── selectors           - utils for integration testing, generated from the code in `dom` folder
|   |
|   └── internal                - library internals
|       ├── base-component      - necessary declarations for every public component
|       ├── components          - internal utility components
|       ├── events              - utilities for firing public events
|       ├── hooks               - internal utility hooks
|       └── generated           - generated code from style-dictionary
|       └── styles              - base styles and SCSS-mixins
│
├── lib                         - build output
|   ├── components              - the primary components package
|   ├── components-definitions  – generated metadata for components
|   └── design-tokens           - exported design tokens
|
└── style-dictionary            - style dictionary tokens and roles
```

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
