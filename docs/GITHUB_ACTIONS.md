# GitHub Actions

## Overriding a required check

Some required checks fail on correct changes: an intentional visual change fails the
visual regression comparison, and a coverage drop that cannot be fixed in the PR fails
the Codecov checks. The **Override required check** workflow
(`.github/workflows/override-check.yml`) marks one such check as passed for a single
commit, so the PR can merge without touching branch protection.

Only the checks listed in the workflow can be overridden:

| `<check>` | Status posted | Then |
|---|---|---|
| `visual-regression` | `visual-regression-override` | re-runs the failed jobs of `deploy.yml` so the `Visual regression result` check re-evaluates |
| `codecov` | `codecov/patch`, `codecov/project` | nothing |

Any other check name is refused and nothing is posted. Only users with write, maintain
or admin access can run it.

### How to use it

Confirm the failure is expected first (for visual regression, review the diffs in the
Allure report). Then use either method:

- **From the PR page (recommended):** comment `/override-check <check> <reason>` on the
  pull request, for example `/override-check visual-regression Intentional padding change in Container`.
- **From the Actions tab:** run the **Override required check** workflow manually,
  choosing the check and passing the commit SHA and a reason.

`/override-visual-regression <reason>` is still accepted as an alias for
`/override-check visual-regression <reason>`.

### Scope and limits

- The override is **scoped to a single commit**. It approves the exact SHA you reviewed;
  pushing a new commit produces a new SHA with no override, so the check runs again.
- For `codecov`, the workflow overwrites the statuses Codecov posted. If Codecov uploads
  a report for that commit again afterwards, it overwrites the override and the command
  has to be posted again.
- The reason is recorded in the status description (`Overridden by @<user>: <reason>`)
  and is visible in the PR's checks list.
