// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import Button from '~components/button';
import ControlGroup, { ControlGroupProps } from '~components/control-group';
import Divider from '~components/divider';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const OPERATORS: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '=~', label: '=~' },
  { value: '!~', label: '!~' },
];

const AGGREGATIONS: SelectProps.Option[] = [
  { value: 'count_values', label: 'count_values' },
  { value: 'sum', label: 'sum' },
  { value: 'avg', label: 'avg' },
];

const BY_OPTIONS: SelectProps.Option[] = [
  { value: 'labels', label: 'By labels' },
  { value: 'none', label: 'Without labels' },
];

// A query builder made of several ControlGroup clauses of different widths. Each is
// dismissible; new clauses can be added. Laid out in a horizontal SpaceBetween so the
// groups wrap as whole units when the row is narrow, and stack their own controls only
// when a single group no longer fits its line.
type ClauseKind = 'metric' | 'label' | 'aggregation';

interface Clause {
  id: number;
  kind: ClauseKind;
}

// The three initial clauses deliberately have different natural widths:
//   - metric: one input (narrow)
//   - aggregation: two selects (medium)
//   - label: input + operator select + input (wide)
const INITIAL_CLAUSES: Clause[] = [
  { id: 1, kind: 'metric' },
  { id: 2, kind: 'aggregation' },
  { id: 3, kind: 'label' },
];

function MetricClause({ onDismiss }: { onDismiss: () => void }) {
  const [value, setValue] = useState('http_requests_total');
  return (
    <ControlGroup
      inlineLabelText="Metric"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove metric' }}
    >
      <Input
        ariaLabel="Metric"
        value={value}
        placeholder="Select metric name"
        onChange={e => setValue(e.detail.value)}
      />
    </ControlGroup>
  );
}

function AggregationClause({ onDismiss }: { onDismiss: () => void }) {
  const [aggregation, setAggregation] = useState(AGGREGATIONS[1]);
  const [by, setBy] = useState(BY_OPTIONS[0]);
  return (
    <ControlGroup
      inlineLabelText="Aggregation"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove aggregation' }}
    >
      <Select
        ariaLabel="Aggregation"
        selectedOption={aggregation}
        options={AGGREGATIONS}
        onChange={e => setAggregation(e.detail.selectedOption)}
      />
      <Select ariaLabel="By" selectedOption={by} options={BY_OPTIONS} onChange={e => setBy(e.detail.selectedOption)} />
    </ControlGroup>
  );
}

function LabelClause({ onDismiss }: { onDismiss: () => void }) {
  const [name, setName] = useState('service');
  const [operator, setOperator] = useState(OPERATORS[0]);
  const [value, setValue] = useState('production');
  return (
    <ControlGroup
      inlineLabelText="Label matcher"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove label matcher' }}
    >
      <Input ariaLabel="Label name" value={name} placeholder="Label name" onChange={e => setName(e.detail.value)} />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={e => setOperator(e.detail.selectedOption)}
      />
      <Input ariaLabel="Label value" value={value} placeholder="Label value" onChange={e => setValue(e.detail.value)} />
    </ControlGroup>
  );
}

function renderClause(clause: Clause, onDismiss: () => void) {
  switch (clause.kind) {
    case 'metric':
      return <MetricClause onDismiss={onDismiss} />;
    case 'aggregation':
      return <AggregationClause onDismiss={onDismiss} />;
    case 'label':
      return <LabelClause onDismiss={onDismiss} />;
  }
}

function QueryBuilder() {
  const [clauses, setClauses] = useState<Clause[]>(INITIAL_CLAUSES);
  const [nextId, setNextId] = useState(INITIAL_CLAUSES.length + 1);

  const addClause = (kind: ClauseKind) => {
    setClauses(prev => [...prev, { id: nextId, kind }]);
    setNextId(id => id + 1);
  };

  const removeClause = (id: number) => setClauses(prev => prev.filter(clause => clause.id !== id));

  return (
    <SpaceBetween size="s">
      <SpaceBetween size="xs" direction="horizontal" alignItems="end">
        {clauses.map(clause => (
          <React.Fragment key={clause.id}>{renderClause(clause, () => removeClause(clause.id))}</React.Fragment>
        ))}
      </SpaceBetween>

      <SpaceBetween size="xs" direction="horizontal">
        <Button iconName="add-plus" onClick={() => addClause('metric')}>
          Add metric
        </Button>
        <Button iconName="add-plus" onClick={() => addClause('aggregation')}>
          Add aggregation
        </Button>
        <Button iconName="add-plus" onClick={() => addClause('label')}>
          Add label matcher
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}

// Exploration of the render-prop (function-as-children) API: the callback receives
// `{ wrap }` so the consumer can render different content in a row vs when wrapped.
// Here a wide metric-query clause (several controls in a row) collapses to a smaller,
// compact set of controls once it wraps.
function RenderPropClause() {
  const [metric, setMetric] = useState('http_requests_total');
  const [operator, setOperator] = useState(OPERATORS[0]);
  const [labelValue, setLabelValue] = useState('production');
  const [aggregation, setAggregation] = useState(AGGREGATIONS[1]);
  const [by, setBy] = useState(BY_OPTIONS[0]);
  const [limit, setLimit] = useState('100');

  const metricInput = (
    <Input
      ariaLabel="Metric"
      value={metric}
      placeholder="Select metric name"
      onChange={e => setMetric(e.detail.value)}
    />
  );
  const aggregationSelect = (
    <Select
      ariaLabel="Aggregation"
      selectedOption={aggregation}
      options={AGGREGATIONS}
      onChange={e => setAggregation(e.detail.selectedOption)}
    />
  );

  // Drive the group's validation from the Limit field: empty is an error, a
  // non-numeric value is a warning, otherwise it's valid. When the group wraps, the
  // message renders between the controls and the trailing button.
  const trimmedLimit = limit.trim();
  const errorText = trimmedLimit === '' ? 'Enter a limit for the query.' : undefined;
  const warningText = !errorText && !/^\d+$/.test(trimmedLimit) ? 'Limit should be a whole number.' : undefined;

  return (
    <ControlGroup
      inlineLabelText="Metric query"
      errorText={errorText}
      warningText={warningText}
      // The trailing `actions` slot swaps the remove button by wrap state: a labelled
      // button in a row, a compact icon-only trash button once the group stacks.
      actions={({ wrap }: { wrap: boolean }) =>
        wrap ? (
          <Button onClick={() => window.alert('Remove clause')}>Remove</Button>
        ) : (
          <Button
            iconName="remove"
            variant="icon"
            ariaLabel="Remove clause"
            onClick={() => window.alert('Remove clause')}
          />
        )
      }
    >
      {metricInput}
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={e => setOperator(e.detail.selectedOption)}
      />
      <Input
        ariaLabel="Label value"
        value={labelValue}
        placeholder="Label value"
        onChange={e => setLabelValue(e.detail.value)}
      />
      {aggregationSelect}
      <Select ariaLabel="By" selectedOption={by} options={BY_OPTIONS} onChange={e => setBy(e.detail.selectedOption)} />
      <Input ariaLabel="Limit" value={limit} placeholder="Limit" onChange={e => setLimit(e.detail.value)} />
    </ControlGroup>
  );
}

const resizableContainerStyle: React.CSSProperties = {
  resize: 'horizontal',
  overflow: 'auto',
  inlineSize: 950,
  minInlineSize: 200,
  maxInlineSize: '100%',
  padding: 16,
  border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
  borderRadius: 8,
};

// Below this container width the builder switches to its wrapped presentation. The exact
// value is arbitrary for the demo — it just needs to flip as the container is resized.
const WRAP_THRESHOLD = 640;

// A query builder that wraps based on whether it fits: the builder measures its own
// width and, once it drops below a threshold, switches every clause to the wrapped
// layout (`wrapBehavior="wrap"`) and lays the clauses out vertically with dividers.
// Clauses can be added and removed, and each one validates its own name/value
// combination.
interface ControlledClause {
  id: number;
  name: string;
  operator: SelectProps.Option;
  value: string;
}

const INITIAL_CONTROLLED_CLAUSES: ControlledClause[] = [
  { id: 1, name: 'service', operator: OPERATORS[0], value: 'production' },
];

// True for the regex-match operators, whose value must be a valid regular expression.
function isRegexOperator(operator: SelectProps.Option): boolean {
  return operator.value === '=~' || operator.value === '!~';
}

// Validate the label name / operator / value COMBINATION, so a freshly added (empty)
// clause is valid and validation only fires once the entered combination is inconsistent:
//   - one of name/value filled but not the other -> error (incomplete pair)
//   - a regex operator (=~, !~) with an invalid regex value -> error
//   - a plain (=, !=) value that contains whitespace -> warning (probably needs quoting)
function validateClause({ name, operator, value }: ControlledClause): { errorText?: string; warningText?: string } {
  const hasName = name.trim() !== '';
  const hasValue = value.trim() !== '';
  if (hasName !== hasValue) {
    return { errorText: 'Enter both a label name and value.' };
  }
  if (hasValue && isRegexOperator(operator)) {
    try {
      new RegExp(value);
    } catch {
      return { errorText: 'Value is not a valid regular expression.' };
    }
    return {};
  }
  if (hasValue && /\s/.test(value)) {
    return { warningText: 'Value contains whitespace.' };
  }
  return {};
}

function ControlledQueryBuilder() {
  const [clauses, setClauses] = useState<ControlledClause[]>(INITIAL_CONTROLLED_CLAUSES);
  const [nextId, setNextId] = useState(INITIAL_CONTROLLED_CLAUSES.length + 1);

  // Measure the builder's own width and wrap once it no longer "fits" (below an
  // arbitrary threshold). Start not wrapped until measured.
  const [width, measureRef] = useContainerQuery(entry => entry.contentBoxWidth);
  const wrapped = width !== null && width < WRAP_THRESHOLD;
  // The wrap decision is pushed down to every clause so they all stack together.
  const wrapBehavior: ControlGroupProps.WrapBehavior = wrapped ? 'wrap' : 'nowrap';

  const addClause = () => {
    setClauses(prev => [...prev, { id: nextId, name: '', operator: OPERATORS[0], value: '' }]);
    setNextId(id => id + 1);
  };
  const removeClause = (id: number) => setClauses(prev => prev.filter(clause => clause.id !== id));
  const updateClause = (id: number, patch: Partial<ControlledClause>) =>
    setClauses(prev => prev.map(clause => (clause.id === id ? { ...clause, ...patch } : clause)));

  return (
    <div ref={measureRef}>
      {(() => {
        const clauseGroups = clauses.map(clause => {
          const { errorText, warningText } = validateClause(clause);
          return (
            <ControlGroup
              key={clause.id}
              inlineLabelText="Label"
              wrapBehavior={wrapBehavior}
              errorText={errorText}
              warningText={warningText}
              actions={({ wrap }: { wrap: boolean }) =>
                wrap ? (
                  <Button onClick={() => removeClause(clause.id)}>Remove</Button>
                ) : (
                  <Button
                    iconName="close"
                    variant="icon"
                    ariaLabel="Remove label"
                    onClick={() => removeClause(clause.id)}
                  />
                )
              }
            >
              <Input
                ariaLabel="Label name"
                value={clause.name}
                placeholder="Label name"
                onChange={e => updateClause(clause.id, { name: e.detail.value })}
              />
              <Select
                ariaLabel="Operator"
                selectedOption={clause.operator}
                options={OPERATORS}
                onChange={e => updateClause(clause.id, { operator: e.detail.selectedOption })}
              />
              <Input
                ariaLabel="Label value"
                value={clause.value}
                placeholder="Label value"
                onChange={e => updateClause(clause.id, { value: e.detail.value })}
              />
            </ControlGroup>
          );
        });

        // Default (non-icon) button. It shows only the icon in the row layout, and adds
        // its text label when the builder wraps.
        const addButton = wrapped ? (
          <Button iconName="add-plus" onClick={addClause}>
            Add label
          </Button>
        ) : (
          // <Box margin={{ top: 'm' }}>
          <Button iconName="add-plus" ariaLabel="Add label" onClick={addClause} />
          // </Box>
        );

        // Wrapped: render the groups vertically with a horizontal divider between each
        // (and before the add button), laid out directly in a flex column rather than a
        // SpaceBetween. Row: a horizontal SpaceBetween with the add button inline.
        return wrapped ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
            {clauseGroups.map((group, index) => (
              <React.Fragment key={clauses[index].id}>
                {index > 0 && <Divider />}
                {group}
              </React.Fragment>
            ))}
            <Divider />
            <div>{addButton}</div>
          </div>
        ) : (
          <SpaceBetween size="xs" direction="horizontal" alignItems="end">
            {clauseGroups}
            {addButton}
          </SpaceBetween>
        );
      })()}
    </div>
  );
}

export default function () {
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="A query builder built from ControlGroup clauses of different widths. Resize the container (drag the handle) to see whole clauses wrap to new lines, and individual clauses stack their controls only when a single clause no longer fits its line."
    >
      <SpaceBetween size="xl">
        <div style={resizableContainerStyle}>
          <QueryBuilder />
        </div>

        <SpaceBetween size="s">
          <div>
            Render-prop API exploration: <code>{'<ControlGroup>{({ wrap }) => ...}</ControlGroup>'}</code>. The metric
            query below renders a full set of controls in a row (metric, operator, value, aggregation, by, limit) and
            collapses to a compact subset (metric + aggregation) once it wraps. Drag the handle narrow to see it switch.
          </div>
          <div style={resizableContainerStyle}>
            <RenderPropClause />
          </div>
        </SpaceBetween>

        <SpaceBetween size="s">
          <div>
            Fit-based wrapping driven top-down: the builder measures its own width and, once it no longer fits, pushes{' '}
            <code>wrapBehavior="wrap"</code> down to every clause so they stack together and lay out vertically with
            dividers. Resize the container to cross the threshold; add and remove clauses, and enter an incomplete label
            (name or value only, or a value with whitespace) to see the error and warning states.
          </div>
          <div style={resizableContainerStyle}>
            <ControlledQueryBuilder />
          </div>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
