// Flat schema approaches — comparison for Table and Checkbox
// This file is for design discussion only, not used in production.

// =============================================================================
// OPTION A: description (no structural relationship encoded)
// =============================================================================

const table_optionA = {
  root: { className: 'awsui-style-table-root', description: 'Outermost table container', attributes: { 'data-awsui-style-variant': ['container', 'embedded', 'stacked', 'full-page', 'borderless'] } },
  wrapper: { className: 'awsui-style-table-wrapper', description: 'Scrollable content area' },
  table: { className: 'awsui-style-table-table', description: 'The <table> element' },
  headerCell: { className: 'awsui-style-table-header-cell', description: 'Column header <th>' },
  row: { className: 'awsui-style-table-row', description: 'Data row <tr>', attributes: { 'data-awsui-style-selected': ['true', 'false'] } },
  bodyCell: { className: 'awsui-style-table-body-cell', description: 'Data cell <td>' },
  selectionCell: { className: 'awsui-style-table-selection-cell', description: 'Selection checkbox cell <td>' },
};

const checkbox_optionA = {
  root: { className: 'awsui-style-checkbox-root', description: 'Outermost checkbox wrapper' },
  control: { className: 'awsui-style-checkbox-control', description: 'Wrapper around native input and visual indicator', attributes: { ':has(input:checked)': 'checked', ':has(input:indeterminate)': 'indeterminate', ':has(input:disabled)': 'disabled' } },
  label: { className: 'awsui-style-checkbox-label', description: 'Text label' },
  svg: { className: 'awsui-style-checkbox-svg', description: 'Visual indicator container' },
  box: { className: 'awsui-style-checkbox-box', description: 'Checkbox box shape', type: 'svg:rect' as const },
  checkmark: { className: 'awsui-style-checkbox-checkmark', description: 'Check or indeterminate mark', type: 'svg:polyline' as const },
};

// =============================================================================
// OPTION B: containedIn (flat with parent reference)
// =============================================================================

const table_optionB = {
  root: { className: 'awsui-style-table-root', attributes: { 'data-awsui-style-variant': ['container', 'embedded', 'stacked', 'full-page', 'borderless'] } },
  wrapper: { className: 'awsui-style-table-wrapper', containedIn: 'root' },
  table: { className: 'awsui-style-table-table', containedIn: 'wrapper' },
  headerCell: { className: 'awsui-style-table-header-cell', containedIn: 'table' },
  row: { className: 'awsui-style-table-row', containedIn: 'table', attributes: { 'data-awsui-style-selected': ['true', 'false'] } },
  bodyCell: { className: 'awsui-style-table-body-cell', containedIn: 'row' },
  selectionCell: { className: 'awsui-style-table-selection-cell', containedIn: 'row' },
};

const checkbox_optionB = {
  root: { className: 'awsui-style-checkbox-root' },
  control: { className: 'awsui-style-checkbox-control', containedIn: 'root', attributes: { ':has(input:checked)': 'checked', ':has(input:indeterminate)': 'indeterminate', ':has(input:disabled)': 'disabled' } },
  label: { className: 'awsui-style-checkbox-label', containedIn: 'root' },
  svg: { className: 'awsui-style-checkbox-svg', containedIn: 'control' },
  box: { className: 'awsui-style-checkbox-box', containedIn: 'svg', type: 'svg:rect' as const },
  checkmark: { className: 'awsui-style-checkbox-checkmark', containedIn: 'svg', type: 'svg:polyline' as const },
};

// =============================================================================
// Comparison
// =============================================================================
//
// | Dimension                  | Option A (description)         | Option B (containedIn)          |
// |----------------------------|--------------------------------|---------------------------------|
// | Structural commitment      | None — prose only              | Encodes parent-child pairs      |
// | Doc generator tree view    | Not possible automatically     | Can reconstruct full tree       |
// | Selector path generation   | Not possible automatically     | Can build ancestor chains       |
// | Refactoring freedom        | Maximum — descriptions are     | Moderate — changing a parent    |
// |                            | informational, not contractual | requires updating containedIn   |
// | Verbosity                  | Slightly more (descriptions)   | Slightly more (containedIn)     |
// | TypeScript validation      | None for structure             | Could validate with string      |
// |                            |                                | literal union of sibling keys   |
// | Risk of stale info         | Descriptions can drift from    | containedIn can drift from      |
// |                            | reality silently               | reality silently                |
// | Internal use (className)   | Direct: api.box.className      | Direct: api.box.className       |
//
// Recommendation:
// Option A is safest if the goal is to avoid structural commitment entirely.
// Option B is a good middle ground if the doc generator needs to produce tree views
// or selector examples, without the verbosity of nested children.
// Both are significantly simpler than the nested children approach for component authors.

export { table_optionA, checkbox_optionA, table_optionB, checkbox_optionB };
