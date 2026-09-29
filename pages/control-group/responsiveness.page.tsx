// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import ControlGroup from '~components/control-group';
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
      ariaLabel="Metric"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove metric' }}
    >
      <Input
        ariaLabel="Metric"
        inlineLabelText="Metric"
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
      ariaLabel="Aggregation"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove aggregation' }}
    >
      <Select
        ariaLabel="Aggregation"
        inlineLabelText="Aggregation"
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
      ariaLabel="Label matcher"
      dismissible={true}
      onDismiss={onDismiss}
      i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove label matcher' }}
    >
      <Input
        ariaLabel="Label name"
        inlineLabelText="Label"
        value={name}
        placeholder="Label name"
        onChange={e => setName(e.detail.value)}
      />
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

export default function () {
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="A query builder built from ControlGroup clauses of different widths. Resize the container (drag the handle) to see whole clauses wrap to new lines, and individual clauses stack their controls only when a single clause no longer fits its line."
    >
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          inlineSize: 950,
          minInlineSize: 240,
          maxInlineSize: '100%',
          padding: 16,
          border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
          borderRadius: 8,
        }}
      >
        <QueryBuilder />
      </div>
    </SimplePage>
  );
}
