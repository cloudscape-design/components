# Internal consumers of Select/Multiselect deep imports: search report

## Method
The search could not be run.
- This step session has no InternalCodeSearch (builder-mcp) tool.
- Shell fallback is blocked. Every shell command, including `ls -la /tmp/cs-search.sh`, was denied by an agent-profile permission rule (the deny list contains a bare `*` entry). That rules out `mcscli curl` and `/tmp/cs-search.sh`.
- The delegated `amzn-builder` agent (and the gpu-research and aws-builder agents it tried) also had no InternalCodeSearch. Their shells were blocked too, and unauthenticated web fetches of code.amazon.com return a 307 redirect to Midway sign-in.

Per the brief ("if neither works, say so and stop"), the search stopped here.

## Queries and result counts
None ran. Every query in the brief is still pending.

## Affected consumers (carried over from the earlier finding, not re-checked)
| Package | File | Reference | Symbol | Prod/test | What breaks |
|---|---|---|---|---|---|
| AgentCore-Console-One-Theme | src/componentOverrides.spec.ts | `readFileSync` of `node_modules/@amzn/awsui-components-console/select/parts/item.js`, asserts it contains `!renderResult && !hasCheckbox && !isParent && selected && (` | select/parts/item, `hasCheckbox` | test | The file moves to listbox/parts/item and `hasCheckbox` is removed, so the read or the assertion fails. |

## Not affected (carried over, not re-checked)
- FCMReactComponents imports from its own vendored copy under `fcm-core/polaris-customized-components/...`.
- Cloudscape copies or forks: AWS-UI-Components-UXDG, AWSConsole-DynamoDB-Cloudscape-Virtual-Table, AWS-UI-Artifacts-Components-React.

## Gaps
The whole search is a gap:
- all package prefixes: `@cloudscape-design/components/`, `@amzn/awsui-components-console/`, `@amzn/awsui-components-react/` (including polaris and uxdg), `@awsui/components-react/`;
- all moved or deleted paths: select/parts/item, multiselect-item, plain-list, select/utils/use-native-search, listbox/parts/render-options, listbox/parts/get-item-props;
- the symbols useNativeSearch, SelectListProps, hasCheckbox and useInteractiveGroups;
- jest.mock, moduleNameMapper and readFileSync patterns.

## Conclusion
There was no working code-search path in this environment, so it is still unknown whether any internal package other than AgentCore-Console-One-Theme depends on the moved or deleted modules. AgentCore-Console-One-Theme's test-only break is the only known impact. To finish the search, do one of the following:
- Run this step in a session with builder-mcp InternalCodeSearch connected.
- Relax the shell deny rule so `mcscli curl` and `/tmp/cs-search.sh` can run.
- Run the narrow queries from the brief by hand in code.amazon.com search, excluding node_modules, build output and lockfiles.
