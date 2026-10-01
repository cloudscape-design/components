// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import ControlGroup from '~components/control-group';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import TreeView from '~components/tree-view';

import { SimplePage } from '../app/templates';

// A PromQL-style nested query builder. The interesting part is that every clause row is a
// ControlGroup of fused controls (with a trailing remove button), and those groups are
// nested inside a TreeView with connector lines — so the fused input groups compose into a
// tree. Each row's "add" dropdown either WRAPS the clause in a new parent (aggregation,
// function) or NESTS a new argument beneath it (metric, label matcher, range).

// ---- Clause model ---------------------------------------------------------

type ClauseType = 'aggregation' | 'function' | 'metric' | 'filter' | 'range';

interface Clause {
  id: number;
  type: ClauseType;
  data: Record<string, any>;
  children?: Clause[];
}

const CLAUSE_LABEL: Record<ClauseType, string> = {
  aggregation: 'Aggregation',
  function: 'Function',
  metric: 'Metric',
  filter: 'Label matcher',
  range: 'Range',
};

// Clause kinds that nest as a child (an argument); everything else wraps the target.
const CHILD_KINDS: ReadonlySet<ClauseType> = new Set<ClauseType>(['metric', 'filter', 'range']);

const AGGREGATIONS = ['sum', 'avg', 'min', 'max', 'count'];
const FUNCTIONS = ['rate', 'irate', 'increase', 'delta', 'deriv'];
const OPERATORS = ['=', '!=', '=~', '!~'];
const METRICS = ['node_cpu_seconds_total', 'http_requests_total', 'process_resident_memory_bytes'];
const LABELS = ['service', 'namespace', 'instance', 'mode', 'region'];

function defaultData(type: ClauseType): Record<string, any> {
  switch (type) {
    case 'aggregation':
      return { fn: 'sum', by: [] as string[] };
    case 'function':
      return { fn: 'rate' };
    case 'metric':
      return { metric: '' };
    case 'filter':
      return { field: '', operator: '=~', value: '' };
    case 'range':
      return { value: '5m' };
  }
}

let idSeed = 1;
function makeClause(type: ClauseType, data?: Record<string, any>): Clause {
  return { id: ++idSeed, type, data: { ...defaultData(type), ...data } };
}

// A seeded example: sum by (service) ( rate( node_cpu_seconds_total{mode!="idle"}[5m] ) )
function seed(): Clause[] {
  const label = makeClause('filter', { field: 'mode', operator: '!=', value: 'idle' });
  const range = makeClause('range', { value: '5m' });
  const metric: Clause = {
    ...makeClause('metric', { metric: 'node_cpu_seconds_total' }),
    children: [label, range],
  };
  const fn: Clause = { ...makeClause('function', { fn: 'rate' }), children: [metric] };
  const aggregation: Clause = { ...makeClause('aggregation', { fn: 'sum', by: ['service'] }), children: [fn] };
  return [aggregation];
}

// ---- Immutable tree operations --------------------------------------------

function updateClause(clauses: Clause[], id: number, data: Record<string, any>): Clause[] {
  return clauses.map(clause => {
    if (clause.id === id) {
      return { ...clause, data };
    }
    return clause.children ? { ...clause, children: updateClause(clause.children, id, data) } : clause;
  });
}

function removeClause(clauses: Clause[], id: number): Clause[] {
  return clauses
    .filter(clause => clause.id !== id)
    .map(clause => (clause.children ? { ...clause, children: removeClause(clause.children, id) } : clause));
}

// Wrap the target clause (and its subtree) in a new parent clause of `type`.
function wrapClause(clauses: Clause[], targetId: number, type: ClauseType, data?: Record<string, any>): Clause[] {
  return clauses.map(clause => {
    if (clause.id === targetId) {
      return { ...makeClause(type, data), children: [clause] };
    }
    return clause.children ? { ...clause, children: wrapClause(clause.children, targetId, type, data) } : clause;
  });
}

// Nest a new clause of `type` as a child (argument) of `parentId`.
function addChildClause(clauses: Clause[], parentId: number, type: ClauseType, data?: Record<string, any>): Clause[] {
  return clauses.map(clause => {
    if (clause.id === parentId) {
      return { ...clause, children: [...(clause.children ?? []), makeClause(type, data)] };
    }
    return clause.children ? { ...clause, children: addChildClause(clause.children, parentId, type, data) } : clause;
  });
}

function allClauseIds(clauses: Clause[]): string[] {
  return clauses.flatMap(clause => [String(clause.id), ...(clause.children ? allClauseIds(clause.children) : [])]);
}

// ---- Query serialization (for the code preview) ---------------------------

function realFilters(children: Clause[] | undefined): Clause[] {
  return (children ?? []).filter(clause => clause.type === 'filter' && !!clause.data.field);
}

function serialize(clause: Clause): string {
  switch (clause.type) {
    case 'aggregation': {
      const by = clause.data.by.length ? ` by (${clause.data.by.join(', ')})` : '';
      const inner = (clause.children ?? []).map(serialize).filter(Boolean).join(', ');
      return `${clause.data.fn}${by}(${inner})`;
    }
    case 'function': {
      const inner = (clause.children ?? [])
        .filter(c => c.type !== 'filter' && c.type !== 'range')
        .map(serialize)
        .filter(Boolean)
        .join(', ');
      return `${clause.data.fn}(${inner})`;
    }
    case 'metric': {
      const name = clause.data.metric || 'metric';
      const labels = realFilters(clause.children).map(c => `${c.data.field}${c.data.operator}"${c.data.value}"`);
      const range = (clause.children ?? []).find(c => c.type === 'range');
      const selector = labels.length ? `${name}{${labels.join(', ')}}` : name;
      return range ? `${selector}[${range.data.value}]` : selector;
    }
    default:
      return '';
  }
}

// ---- The per-row clause controls (a ControlGroup) -------------------------

const CLAUSE_MENU: ButtonDropdownProps.Items = [
  { text: 'Aggregation', items: AGGREGATIONS.map(a => ({ id: `aggregation:${a}`, text: a })) },
  { text: 'Function', items: FUNCTIONS.map(f => ({ id: `function:${f}`, text: f })) },
  { id: 'metric:selector', text: 'Metric selector' },
  { id: 'filter:matcher', text: 'Label matcher' },
  { id: 'range:vector', text: 'Range' },
];

function toOption(value: string): SelectProps.Option {
  return { value, label: value };
}

function ClauseControls({
  clause,
  onChange,
  onRemove,
}: {
  clause: Clause;
  onChange: (data: Record<string, any>) => void;
  onRemove: () => void;
}) {
  const removeButton = (
    <Button
      iconName="close"
      variant="icon"
      ariaLabel={`Remove ${CLAUSE_LABEL[clause.type].toLowerCase()}`}
      onClick={onRemove}
    />
  );
  const commonProps = {
    inlineLabelText: CLAUSE_LABEL[clause.type],
    actions: removeButton,
  } as const;

  switch (clause.type) {
    case 'aggregation': {
      const by: string[] = clause.data.by;
      const selectedBy: MultiselectProps.Options = by.map(toOption);
      return (
        <ControlGroup {...commonProps} ariaLabel="Aggregation">
          <Select
            ariaLabel="Aggregation function"
            selectedOption={toOption(clause.data.fn)}
            options={AGGREGATIONS.map(toOption)}
            onChange={e => onChange({ ...clause.data, fn: e.detail.selectedOption.value })}
          />
          <Multiselect
            ariaLabel="Group by labels"
            placeholder="by (labels)"
            inlineTokens={true}
            selectedOptions={selectedBy}
            options={LABELS.map(toOption)}
            onChange={e => onChange({ ...clause.data, by: e.detail.selectedOptions.map(o => o.value!) })}
          />
        </ControlGroup>
      );
    }
    case 'function':
      return (
        <ControlGroup {...commonProps} ariaLabel="Function">
          <Select
            ariaLabel="Function"
            selectedOption={toOption(clause.data.fn)}
            options={FUNCTIONS.map(toOption)}
            onChange={e => onChange({ ...clause.data, fn: e.detail.selectedOption.value })}
          />
        </ControlGroup>
      );
    case 'metric':
      return (
        <ControlGroup {...commonProps} ariaLabel="Metric">
          <Select
            ariaLabel="Metric name"
            placeholder="Select metric name"
            selectedOption={clause.data.metric ? toOption(clause.data.metric) : null}
            options={METRICS.map(toOption)}
            onChange={e => onChange({ metric: e.detail.selectedOption.value })}
          />
        </ControlGroup>
      );
    case 'filter':
      return (
        <ControlGroup {...commonProps} ariaLabel="Label matcher">
          <Select
            ariaLabel="Label name"
            placeholder="Label"
            selectedOption={clause.data.field ? toOption(clause.data.field) : null}
            options={LABELS.map(toOption)}
            onChange={e => onChange({ ...clause.data, field: e.detail.selectedOption.value })}
          />
          <Select
            ariaLabel="Operator"
            selectedOption={toOption(clause.data.operator)}
            options={OPERATORS.map(toOption)}
            onChange={e => onChange({ ...clause.data, operator: e.detail.selectedOption.value })}
          />
          <Input
            ariaLabel="Label value"
            placeholder="value"
            value={clause.data.value}
            onChange={e => onChange({ ...clause.data, value: e.detail.value })}
          />
        </ControlGroup>
      );
    case 'range':
      return (
        <ControlGroup {...commonProps} ariaLabel="Range">
          <Input
            ariaLabel="Range duration"
            placeholder="e.g. 5m"
            value={clause.data.value}
            onChange={e => onChange({ value: e.detail.value })}
          />
        </ControlGroup>
      );
  }
}

// ---- The builder ----------------------------------------------------------

function CodePreview({ clauses }: { clauses: Clause[] }) {
  const code = clauses.map(serialize).filter(Boolean).join('\n') || '(empty query)';
  return (
    <Box>
      <Box variant="awsui-key-label">Generated query</Box>
      <pre
        style={{
          margin: 0,
          fontFamily: 'var(--awsui-font-family-monospace, monospace)',
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: 'var(--awsui-color-background-code-editor-gutter-default, #f4f4f4)',
          padding: 12,
          borderRadius: 8,
        }}
      >
        {code}
      </pre>
    </Box>
  );
}

export default function () {
  const [clauses, setClauses] = useState<Clause[]>(seed);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const expandedItems = allClauseIds(clauses).filter(id => !collapsed.has(id));

  const handleAdd = (targetId: number, detailId: string) => {
    const [kind, value] = detailId.split(':');
    const type = kind as ClauseType;
    // Wrappers (aggregation, function) carry the chosen name as `fn`.
    const data = type === 'aggregation' || type === 'function' ? { fn: value } : undefined;
    if (CHILD_KINDS.has(type)) {
      setClauses(prev => addChildClause(prev, targetId, type, data));
    } else {
      setClauses(prev => wrapClause(prev, targetId, type, data));
    }
  };

  return (
    <SimplePage
      title="Control group query builder"
      subtitle="A PromQL-style nested query builder. Each clause is a ControlGroup of fused controls with a trailing remove button, nested inside a TreeView with connector lines. Each row's add menu either wraps the clause in a new parent (aggregation, function) or nests a new argument beneath it (metric, label matcher, range)."
    >
      <SpaceBetween size="l">
        <TreeView<Clause>
          items={clauses}
          connectorLines="vertical"
          expandedItems={expandedItems}
          getItemId={item => String(item.id)}
          // Label matchers and ranges render inline in their parent's row (as fused
          // controls of the metric), not as separate tree rows.
          getItemChildren={item => item.children?.filter(c => c.type !== 'filter' && c.type !== 'range')}
          ariaLabel="Query clauses"
          i18nStrings={{
            expandButtonLabel: item => `Expand ${CLAUSE_LABEL[item.type]}`,
            collapseButtonLabel: item => `Collapse ${CLAUSE_LABEL[item.type]}`,
          }}
          onItemToggle={({ detail }) =>
            setCollapsed(prev => {
              const next = new Set(prev);
              if (detail.expanded) {
                next.delete(detail.id);
              } else {
                next.add(detail.id);
              }
              return next;
            })
          }
          renderItem={item => {
            const inlineChildren = (item.children ?? []).filter(c => c.type === 'filter' || c.type === 'range');
            return {
              announcementLabel: CLAUSE_LABEL[item.type],
              content: (
                <SpaceBetween size="xs" direction="horizontal" alignItems="end">
                  <ClauseControls
                    clause={item}
                    onChange={data => setClauses(prev => updateClause(prev, item.id, data))}
                    onRemove={() => setClauses(prev => removeClause(prev, item.id))}
                  />
                  {/* A metric's label matchers and range fuse beside it as their own groups. */}
                  {inlineChildren.map(child => (
                    <ClauseControls
                      key={child.id}
                      clause={child}
                      onChange={data => setClauses(prev => updateClause(prev, child.id, data))}
                      onRemove={() => setClauses(prev => removeClause(prev, child.id))}
                    />
                  ))}
                </SpaceBetween>
              ),
              // The add menu goes in the TreeView `actions` slot so it is right-aligned at
              // the row's trailing edge. In the structured item the actions render after
              // the content, so it is the LAST focusable in the row — arrow navigation
              // reaches it by pressing Right past the last control.
              actions: (
                <ButtonDropdown
                  variant="inline-icon"
                  ariaLabel={`Add to ${CLAUSE_LABEL[item.type]}`}
                  expandableGroups={true}
                  items={CLAUSE_MENU}
                  onItemClick={({ detail }) => handleAdd(item.id, detail.id)}
                />
              ),
            };
          }}
        />

        <CodePreview clauses={clauses} />
      </SpaceBetween>
    </SimplePage>
  );
}
