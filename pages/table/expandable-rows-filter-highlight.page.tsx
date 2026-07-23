// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { Box, Checkbox, Header, Input, SpaceBetween, Table, TableProps } from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

interface Node {
  id: string;
  name: string;
  type: string;
  size: string;
  children?: Node[];
}

// A small static hierarchy so the page does not depend on collection-hooks tree filtering.
const data: Node[] = [
  {
    id: 'eu',
    name: 'eu-west-1',
    type: 'region',
    size: '—',
    children: [
      {
        id: 'eu-prod',
        name: 'production',
        type: 'cluster',
        size: '—',
        children: [
          { id: 'eu-prod-db1', name: 'orders-db', type: 'instance', size: 'r5.large' },
          { id: 'eu-prod-db2', name: 'payments-db', type: 'instance', size: 'r5.xlarge' },
        ],
      },
      {
        id: 'eu-staging',
        name: 'staging',
        type: 'cluster',
        size: '—',
        children: [{ id: 'eu-staging-db1', name: 'orders-db-staging', type: 'instance', size: 't3.medium' }],
      },
    ],
  },
  {
    id: 'us',
    name: 'us-east-1',
    type: 'region',
    size: '—',
    children: [
      {
        id: 'us-prod',
        name: 'production',
        type: 'cluster',
        size: '—',
        children: [
          { id: 'us-prod-db1', name: 'analytics-db', type: 'instance', size: 'r5.2xlarge' },
          { id: 'us-prod-db2', name: 'orders-db', type: 'instance', size: 'r5.large' },
        ],
      },
    ],
  },
];

const columnDefinitions: TableProps.ColumnDefinition<Node>[] = [
  { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
  { id: 'type', header: 'Type', cell: item => item.type },
  { id: 'size', header: 'Size', cell: item => item.size },
];

const getItemChildren = (item: Node) => item.children ?? [];

function subtreeHasMatch(item: Node, isMatched: (item: Node) => boolean): boolean {
  return isMatched(item) || getItemChildren(item).some(child => subtreeHasMatch(child, isMatched));
}

export default function ExpandableFilterHighlightPage() {
  const [filteringText, setFilteringText] = useState('');
  const [expandedItems, setExpandedItems] = useState<ReadonlyArray<Node>>([]);
  const [highlightMatched, setHighlightMatched] = useState(true);

  const isItemMatched = useMemo(() => {
    const query = filteringText.trim().toLowerCase();
    return (item: Node) => query.length > 0 && item.name.toLowerCase().includes(query);
  }, [filteringText]);

  // Keep parent rows of matching descendants visible: only surface roots whose subtree contains a match.
  const items = useMemo(() => {
    if (filteringText.trim().length === 0) {
      return data;
    }
    return data.filter(root => subtreeHasMatch(root, isItemMatched));
  }, [filteringText, isItemMatched]);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <Box padding="l">
        <SpaceBetween size="l">
          <Header
            variant="h1"
            description="AWSUI-61158: keep and auto-expand ancestor rows when filtering expandable tables"
          >
            Expandable table filter highlight
          </Header>

          <SpaceBetween size="s" direction="horizontal">
            <div style={{ width: 320 }}>
              <Input
                value={filteringText}
                onChange={e => setFilteringText(e.detail.value)}
                placeholder="Filter by name (e.g. orders-db)"
                ariaLabel="Filter databases"
                type="search"
              />
            </div>
            <Checkbox checked={highlightMatched} onChange={e => setHighlightMatched(e.detail.checked)}>
              Highlight & auto-expand matches
            </Checkbox>
          </SpaceBetween>

          <Table
            columnDefinitions={columnDefinitions}
            items={items}
            trackBy="id"
            variant="container"
            header={<Header>Databases</Header>}
            ariaLabels={{
              tableLabel: 'Databases',
              expandButtonLabel: () => 'Expand row',
              collapseButtonLabel: () => 'Collapse row',
            }}
            expandableRows={{
              getItemChildren,
              isItemExpandable: item => getItemChildren(item).length > 0,
              expandedItems,
              onExpandableItemToggle: ({ detail }) =>
                setExpandedItems(prev =>
                  detail.expanded ? [...prev, detail.item] : prev.filter(i => i.id !== detail.item.id)
                ),
              highlightMatched,
              isItemMatched,
            }}
            empty={<Box textAlign="center">No matches</Box>}
          />
        </SpaceBetween>
      </Box>
    </I18nProvider>
  );
}
