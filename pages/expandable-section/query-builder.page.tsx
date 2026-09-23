// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Header } from '~components';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import ColumnLayout from '~components/column-layout';
import ExpandableSection from '~components/expandable-section';
import FormField from '~components/form-field';
import Input from '~components/input';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import TreeView, { TreeViewProps } from '~components/tree-view';

import ScreenshotArea from '../utils/screenshot-area';

// ── Clause node data model ────────────────────────────────────────────────────
interface ClauseNode {
  id: string;
  type: 'aggregation' | 'function' | 'metric' | 'range';
  children?: ClauseNode[];
}

const INITIAL_TREE: ClauseNode[] = [
  {
    id: 'agg',
    type: 'aggregation',
    children: [
      {
        id: 'fn',
        type: 'function',
        children: [
          {
            id: 'metric',
            type: 'metric',
            children: [{ id: 'range', type: 'range', children: [] }],
          },
        ],
      },
    ],
  },
];

export default function QueryBuilderPage() {
  const [expanded, setExpanded] = useState(true);
  const [lang, setLang] = useState({ label: 'PromQL', value: 'promql' });

  // Tree expansion state — all open by default
  const [expandedItems, setExpandedItems] = useState(['agg', 'fn', 'metric']);

  // Clause field state
  const [aggByLabel] = useState({ label: 'By labels', value: 'by' });

  // Options state
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [labelOption, setLabelOption] = useState({ label: 'Auto', value: 'auto' });
  const [stepValue, setStepValue] = useState('60');

  function renderClauseContent(node: ClauseNode): React.ReactNode {
    switch (node.type) {
      case 'aggregation':
        return (
          <Select
            selectedOption={aggByLabel}
            options={[{ label: 'By labels', value: 'by' }]}
            onChange={() => {}}
            ariaLabel="Grouping"
          />
        );
      case 'function':
        return (
          <Select
            selectedOption={aggByLabel}
            options={[{ label: 'By labels', value: 'by' }]}
            onChange={() => {}}
            ariaLabel="Grouping"
          />
        );
      case 'metric':
        return (
          <Select
            selectedOption={aggByLabel}
            options={[{ label: 'By labels', value: 'by' }]}
            onChange={() => {}}
            ariaLabel="Grouping"
          />
        );
      case 'range':
        return (
          <Select
            selectedOption={aggByLabel}
            options={[{ label: 'By labels', value: 'by' }]}
            onChange={() => {}}
            ariaLabel="Grouping"
          />
        );
      default:
        return null;
    }
  }

  const renderItem = (node: ClauseNode): TreeViewProps.TreeItem => ({
    content: renderClauseContent(node),
    announcementLabel: node.type,
  });

  return (
    <article>
      <h1>Query Builder — ExpandableSection exploration</h1>
      <ScreenshotArea>
        <SpaceBetween size="s">
          {/* ── Row 1: expanded by default, no collapsed summary ── */}
          <ExpandableSection
            variant="container"
            expanded={expanded}
            onChange={({ detail }) => setExpanded(detail.expanded)}
            disableHeaderExpand={true}
            header={
              <Header
                variant="h1"
                actions={
                  expanded ? (
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                      <ButtonGroup
                        variant="icon"
                        ariaLabel="View mode"
                        items={[
                          {
                            type: 'icon-toggle-button',
                            id: 'visual',
                            iconName: 'view-full',
                            text: 'Visual',
                            pressed: true,
                          },
                          {
                            type: 'icon-toggle-button',
                            id: 'code',
                            iconName: 'script',
                            text: 'Code',
                            pressed: false,
                          },
                          { type: 'icon-toggle-button', id: 'ai', iconName: 'gen-ai', text: 'AI', pressed: false },
                        ]}
                      />
                      <ButtonDropdown variant="normal" items={[{ id: 'save-as', text: 'Save as…' }]}>
                        Save
                      </ButtonDropdown>
                      <Button variant="normal">Clear</Button>
                      <ButtonDropdown
                        variant="icon"
                        items={[{ id: 'reset', text: 'Reset to default' }]}
                        ariaLabel="Refresh options"
                        expandToViewport={true}
                      >
                        Refresh
                      </ButtonDropdown>
                      <ButtonDropdown variant="normal" items={[{ id: 'run-all', text: 'Run all queries' }]}>
                        Run
                      </ButtonDropdown>
                    </SpaceBetween>
                  ) : (
                    <ButtonDropdown variant="normal" items={[{ id: 'run-all', text: 'Run all queries' }]}>
                      Run
                    </ButtonDropdown>
                  )
                }
              >
                <SpaceBetween size={'s'} direction={'horizontal'} alignItems={'center'}>
                  Create Query
                  <Select
                    selectedOption={lang}
                    options={[
                      { label: 'PromQL', value: 'promql' },
                      { label: 'LogQL', value: 'logql' },
                      { label: 'SQL', value: 'sql' },
                    ]}
                    onChange={({ detail }) => setLang(detail.selectedOption as typeof lang)}
                    ariaLabel="Query language"
                  />
                </SpaceBetween>
              </Header>
            }
          >
            <SpaceBetween size="s">
              <TreeView
                items={INITIAL_TREE}
                getItemId={node => node.id}
                getItemChildren={node => (node.children?.length ? node.children : undefined)}
                renderItem={renderItem}
                expandedItems={expandedItems}
                onItemToggle={({ detail }) => {
                  setExpandedItems(prev =>
                    detail.expanded ? [...prev, detail.id] : prev.filter(id => id !== detail.id)
                  );
                }}
                connectorLines="vertical"
                ariaLabel="Query clause tree"
              />
              <ExpandableSection
                variant="footer"
                disableHeaderExpand={true}
                header={
                  <Header variant="h3">
                    <SpaceBetween size={'s'} direction={'horizontal'} alignItems={'center'}>
                      Options {!optionsExpanded && <small>{`Label: ${labelOption.value}, Step: ${stepValue}`}</small>}
                    </SpaceBetween>
                  </Header>
                }
                expanded={optionsExpanded}
                onChange={({ detail }) => setOptionsExpanded(detail.expanded)}
              >
                <ColumnLayout columns={2}>
                  <FormField label="Label">
                    <Select
                      selectedOption={labelOption}
                      options={[
                        { label: 'Auto', value: 'auto' },
                        { label: 'Custom', value: 'custom' },
                      ]}
                      onChange={({ detail }) => setLabelOption(detail.selectedOption as typeof labelOption)}
                      ariaLabel="Label"
                    />
                  </FormField>
                  <FormField label="Step">
                    <Input value={stepValue} onChange={({ detail }) => setStepValue(detail.value)} ariaLabel="Step" />
                  </FormField>
                </ColumnLayout>
              </ExpandableSection>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
