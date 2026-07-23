// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { Box, Checkbox, Header, SpaceBetween, Table, TableProps } from '~components';

// v0 dev page for AWSUI-59346 — Hierarchical sticky rows.
// Demonstrates: expanded ancestor rows stay pinned below the sticky header while
// scrolling through their descendants, stacking by hierarchy level.

interface Node {
  id: string;
  name: string;
  type: string;
  size: number;
  children?: Node[];
}

// Build a deep, wide tree so the page is scrollable and the sticky behavior is visible.
function makeTree(): Node[] {
  const roots: Node[] = [];
  for (let a = 1; a <= 4; a++) {
    const level1: Node = { id: `A${a}`, name: `Region ${a}`, type: 'region', size: 0, children: [] };
    for (let b = 1; b <= 4; b++) {
      const level2: Node = {
        id: `A${a}-B${b}`,
        name: `Availability zone ${a}.${b}`,
        type: 'az',
        size: 0,
        children: [],
      };
      for (let c = 1; c <= 6; c++) {
        const level3: Node = {
          id: `A${a}-B${b}-C${c}`,
          name: `Cluster ${a}.${b}.${c}`,
          type: 'cluster',
          size: 0,
          children: [],
        };
        for (let d = 1; d <= 6; d++) {
          level3.children!.push({
            id: `A${a}-B${b}-C${c}-D${d}`,
            name: `Instance ${a}.${b}.${c}.${d}`,
            type: 'instance',
            size: d * 8,
          });
        }
        level2.children!.push(level3);
      }
      level1.children!.push(level2);
    }
    roots.push(level1);
  }
  return roots;
}

function flattenExpanded(nodes: Node[]): Node[] {
  return nodes.reduce<Node[]>(
    (acc, node) => [...acc, node, ...(node.children ? flattenExpanded(node.children) : [])],
    []
  );
}

export default function HierarchicalStickyRowsPage() {
  const tree = useMemo(makeTree, []);
  const allNodes = useMemo(() => flattenExpanded(tree), [tree]);
  const [enabled, setEnabled] = useState(true);
  // Start fully expanded so the sticky stacking is immediately visible.
  const [expandedItems, setExpandedItems] = useState<Node[]>(() =>
    allNodes.filter(n => n.children && n.children.length)
  );

  const expandableRows: TableProps.ExpandableRows<Node> = {
    getItemChildren: item => item.children ?? [],
    isItemExpandable: item => !!item.children && item.children.length > 0,
    expandedItems,
    onExpandableItemToggle: ({ detail }) => {
      setExpandedItems(prev =>
        detail.expanded ? [...prev, detail.item] : prev.filter(item => item.id !== detail.item.id)
      );
    },
    stickyAncestorRows: enabled,
  };

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header
          variant="h1"
          description="AWSUI-59346 v0 — expanded parent rows stick below the sticky header while scrolling."
        >
          Hierarchical sticky rows
        </Header>
        <Checkbox checked={enabled} onChange={({ detail }) => setEnabled(detail.checked)}>
          Enable hierarchical sticky rows (stickyAncestorRows)
        </Checkbox>

        <Table
          stickyHeader={true}
          variant="container"
          trackBy="id"
          items={tree}
          expandableRows={expandableRows}
          columnDefinitions={[
            { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
            { id: 'type', header: 'Type', cell: item => item.type },
            { id: 'size', header: 'Size', cell: item => item.size },
          ]}
          header={<Header counter={`(${allNodes.length})`}>Resources</Header>}
        />
      </SpaceBetween>
    </Box>
  );
}
