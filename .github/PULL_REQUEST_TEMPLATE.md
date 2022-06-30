### Changes Done

[_Short description of the changes._]

### Why?

[_Why is this change needed?_]

### Testing

[_How did you test your changes?_]

[_Did you run screenshot tests in the dev-pipeline?_]

[_How can reviewers test these changes efficiently?_]

\[_Check for unexpected visual regressions, see [`CONTRIBUTING.md`](CONTRIBUTING.md) for details._\]

### Writing approval

[*Did you include our UX Writer if there are changes to content that will appear on the website (e.g. API documentation)?*]

### Related Links

[*Ticket IDs (no internal links), related pull requests*]

### Review Checklist

_The following items are to be evaluated by the author(s) and the reviewer(s)._

#### Correctness

- [ ] _Changes are backward-compatible if not indicated._
- [ ] _Changes are covered with automated tests if not indicated._
- [ ] _Changes do not include unsupported browser features._
- [ ] _Changes to UX were approved by the designer._
- [ ] _Changes to UX were manually tested for accessibility._

#### Security

- [ ] _Changes do not include XSS vulnerability._
- [ ] _If the code handles URLs: all URLs are validated through [the `checkSafeUrl` function](https://github.com/cloudscape-design/components/blob/main/src/internal/utils/check-safe-url.ts)._

#### Completeness

- [ ] _All API changes were reviewed by the team and the corresponding doc is linked._
- [ ] _All API doc strings were reviewed by the writer._
- [ ] _If a bug bash was conducted to cover the changes, the corresponding doc is linked._
- [ ] _The code, code comments, readme files, and CR combined provide enough context to understand the changes._
- [ ] _Tickets are created for unresolved TODOs and comments._

#### Testing

- [ ] _Is there enough coverage with new/existing unit tests?_
- [ ] _Is there enough coverage with new/existing integration tests?_
- [ ] _Is there enough coverage with new/existing screenshot tests?_
