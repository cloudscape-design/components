// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Regression test page for GitHub issue #4111:
 * "Table header ignores container-level dark mode"
 *
 * Verifies that the table's sticky header and <thead> background-color tokens
 * resolve correctly when `.awsui-dark-mode` is applied to a container ancestor
 * rather than to <body>.
 *
 * Expected behaviour: the sticky header background matches the table body
 * background in both light and dark mode regardless of where `.awsui-dark-mode`
 * is placed in the DOM hierarchy.
 */
import React from 'react';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

const columns: TableProps.ColumnDefinition<{ id: string; name: string; type: string }>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'type', header: 'Type', cell: item => item.type },
];

const items = [
  { id: '1', name: 'Alpha', type: 'A' },
  { id: '2', name: 'Beta', type: 'B' },
  { id: '3', name: 'Gamma', type: 'C' },
  { id: '4', name: 'Delta', type: 'D' },
  { id: '5', name: 'Epsilon', type: 'E' },
];

/**
 * Wrapper that applies `.awsui-dark-mode` at the container level (not body).
 * This is the scenario that was broken by #4111.
 */
function ContainerDarkMode({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="awsui-dark-mode awsui-visual-refresh"
      style={{ padding: 16, background: '#232f3e' /* approximate dark bg */ }}
    >
      {children}
    </div>
  );
}

export default function DarkModeContainerPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <SpaceBetween size="l">
        <h1>Table header — container-level dark mode (issue #4111)</h1>

        <section>
          <h2>1. Dark mode on &lt;body&gt; (baseline — should always work)</h2>
          <p>The table below is inside a light-mode page. The sticky header should show the light background token.</p>
          <Table
            header={<Header>Light mode table (baseline)</Header>}
            columnDefinitions={columns}
            items={items}
            stickyHeader={true}
          />
        </section>

        <section>
          <h2>2. Dark mode on a container ancestor (regression test for #4111)</h2>
          <p>
            The <code>.awsui-dark-mode</code> class is on the wrapper div, not on <code>&lt;body&gt;</code>. The sticky
            header and <code>&lt;thead&gt;</code> background should match the dark token, not fall back to the light{' '}
            <code>#fafafa</code> value.
          </p>
          <ContainerDarkMode>
            <Table
              header={<Header>Container-level dark mode table</Header>}
              columnDefinitions={columns}
              items={items}
              stickyHeader={true}
            />
          </ContainerDarkMode>
        </section>

        <section>
          <h2>3. Sticky columns — container-level dark mode</h2>
          <p>
            Sticky column header cells also use <code>color-background-table-header</code>. They should also respect
            container-level dark mode.
          </p>
          <ContainerDarkMode>
            <Table
              header={<Header>Container dark mode — sticky columns</Header>}
              columnDefinitions={[
                { id: 'id', header: 'ID', cell: item => item.id, width: 80, isRowHeader: true },
                { id: 'name', header: 'Name', cell: item => item.name, width: 200 },
                { id: 'type', header: 'Type', cell: item => item.type, width: 200 },
                { id: 'extra1', header: 'Extra 1', cell: () => '—', width: 200 },
                { id: 'extra2', header: 'Extra 2', cell: () => '—', width: 200 },
              ]}
              items={items}
              stickyHeader={true}
              stickyColumns={{ first: 1 }}
            />
          </ContainerDarkMode>
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
