# AGENTS.md

React component library for [Cloudscape Design System](https://cloudscape.design/) — an open source design system for building accessible, inclusive web experiences at scale.

## Getting Started

See [docs/SETUP.md](docs/SETUP.md) for setup, building, and running locally.

## Docs Index

See [docs/CLOUDSCAPE_COMPONENTS_GUIDE.md](docs/CLOUDSCAPE_COMPONENTS_GUIDE.md) for guides on component conventions, styling, writing tests, and more.
For running tests and configs, see [docs/RUNNING_TESTS.md](docs/RUNNING_TESTS.md).

## Conventions to watch

- **Commit and PR titles: `type: subject`, no scope.** The PR-title lint (`cloudscape-design/actions/.github/workflows/lint-pr.yml`) allows exactly these types: `chore`, `feat`, `fix`, `refactor`, `test`, `revert`. The title must start with `type:` followed by the subject (for example `feat: Add multi-column sort`). Scope parentheses are not supported (`feat(table): …` fails the check), and other Conventional Commits types such as `docs` or `style` are not allowed — use `chore:` for documentation and tooling changes.
