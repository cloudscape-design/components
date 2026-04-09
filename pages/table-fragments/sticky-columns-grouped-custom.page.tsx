// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Custom table using useStickyColumns + useStickyGroupHeaderStyles directly,
 * without relying on the Cloudscape Table component.
 *
 * Header layout (uneven hierarchy):
 *
 * Row 0: | ID (rs=3) | Name (rs=3) | Configuration (cs=3)       | Metrics (cs=4)                          | Cost (rs=3) |
 * Row 1: |           |             | Type (rs=2) | AZ (rs=2) | State (rs=2) | Performance (cs=2) | Network (cs=2) |             |
 * Row 2: |           |             |             |            |              | CPU     | Memory   | In   | Out     |             |
 *
 * - "ID", "Name", "Cost" are ungrouped leaves spanning all 3 rows
 * - "Configuration" is a single-level group (depth 1)
 * - "Metrics" is a nested group (depth 2) containing "Performance" and "Network" sub-groups
 * - Tree heights: ID=0, Configuration=1, Metrics=2 — uneven
 */
import React, { useContext } from 'react';
import clsx from 'clsx';

import { Box, Checkbox, Container, Input } from '~components';
import SpaceBetween from '~components/space-between';
import {
  GroupHierarchyInfo,
  StickyColumnsGroupHeaderState,
  StickyColumnsModel,
  useStickyCellStyles,
  useStickyColumns,
  useStickyGroupHeaderStyles,
} from '~components/table/sticky-columns';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './styles.scss';

type PageContext = React.Context<
  AppContextType<{
    stickyFirst: number;
    stickyLast: number;
    wrapperPaddings: boolean;
  }>
>;

// --- Data ---
interface Instance {
  id: string;
  name: string;
  type: string;
  az: string;
  state: string;
  cpu: string;
  memory: string;
  netIn: number;
  netOut: number;
  cost: string;
}

const items: Instance[] = Array.from({ length: 20 }, (_, i) => ({
  id: `i-${String(i + 1).padStart(3, '0')}`,
  name: `server-${i + 1}`,
  type: i % 3 === 0 ? 't3.medium' : i % 3 === 1 ? 'r5.xlarge' : 'c5.large',
  az: `us-east-1${'abcd'[i % 4]}`,
  state: i % 5 === 0 ? 'stopped' : 'running',
  cpu: `${(Math.random() * 100).toFixed(1)}%`,
  memory: `${(Math.random() * 100).toFixed(1)}%`,
  netIn: Math.floor(Math.random() * 5000),
  netOut: Math.floor(Math.random() * 5000),
  cost: `$${(Math.random() * 500).toFixed(2)}`,
}));

// --- Column + group definitions ---
const leafColumns = [
  { key: 'id', label: 'ID', render: (item: Instance) => item.id },
  { key: 'name', label: 'Name', render: (item: Instance) => item.name },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
  { key: 'az', label: 'AZ', render: (item: Instance) => item.az },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  { key: 'cpu', label: 'CPU (%)', render: (item: Instance) => item.cpu },
  { key: 'memory', label: 'Memory (%)', render: (item: Instance) => item.memory },
  { key: 'netIn', label: 'Net in', render: (item: Instance) => String(item.netIn) },
  { key: 'netOut', label: 'Net out', render: (item: Instance) => String(item.netOut) },
  { key: 'cost', label: 'Cost', render: (item: Instance) => item.cost },
];

// Group hierarchy: each group maps to its leaf column descendants.
// "metrics" spans cpu, memory, netIn, netOut (depth 2)
// "performance" spans cpu, memory (depth 1, child of metrics)
// "network" spans netIn, netOut (depth 1, child of metrics)
// "configuration" spans type, az, state (depth 1)
const groupHierarchy: GroupHierarchyInfo[] = [
  {
    groupId: 'configuration',
    childColumnIds: ['type', 'az', 'state'],
    firstChildColumnId: 'type',
    lastChildColumnId: 'state',
  },
  {
    groupId: 'metrics',
    childColumnIds: ['cpu', 'memory', 'netIn', 'netOut'],
    firstChildColumnId: 'cpu',
    lastChildColumnId: 'netOut',
  },
  { groupId: 'performance', childColumnIds: ['cpu', 'memory'], firstChildColumnId: 'cpu', lastChildColumnId: 'memory' },
  { groupId: 'network', childColumnIds: ['netIn', 'netOut'], firstChildColumnId: 'netIn', lastChildColumnId: 'netOut' },
];

// --- Page ---
export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const stickyFirst = urlParams.stickyFirst ?? 2;
  const stickyLast = urlParams.stickyLast ?? 1;
  const useWrapperPaddings = urlParams.wrapperPaddings ?? false;

  const stickyColumns = useStickyColumns({
    visibleColumns: leafColumns.map(c => c.key),
    stickyColumnsFirst: stickyFirst,
    stickyColumnsLast: stickyLast,
    groupHierarchy,
  });

  return (
    <Box margin="l">
      <SpaceBetween size="l">
        <h1>Sticky grouped columns — custom table (uneven hierarchy)</h1>
        <SpaceBetween size="m" direction="horizontal">
          <label>
            Sticky first:{' '}
            <Input
              value={String(stickyFirst)}
              type="number"
              inputMode="numeric"
              onChange={({ detail }) => setUrlParams({ stickyFirst: Number(detail.value) })}
            />
          </label>
          <label>
            Sticky last:{' '}
            <Input
              value={String(stickyLast)}
              type="number"
              inputMode="numeric"
              onChange={({ detail }) => setUrlParams({ stickyLast: Number(detail.value) })}
            />
          </label>
        </SpaceBetween>

        <Checkbox
          checked={useWrapperPaddings}
          onChange={event => setUrlParams({ wrapperPaddings: event.detail.checked })}
        >
          Use wrapper paddings
        </Checkbox>

        <Container disableContentPaddings={true}>
          <div
            ref={stickyColumns.refs.wrapper}
            className={clsx(styles['custom-table'], useWrapperPaddings && styles['use-wrapper-paddings'])}
            style={stickyColumns.style.wrapper}
          >
            <table
              ref={stickyColumns.refs.table}
              className={clsx(styles['custom-table-table'], useWrapperPaddings && styles['use-wrapper-paddings'])}
            >
              <thead>
                {/* Row 0: top-level groups + ungrouped leaves with rowSpan=3 */}
                <tr>
                  <LeafHeaderCell columnId="id" rowSpan={3} colIndex={0} stickyColumns={stickyColumns}>
                    ID
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="name" rowSpan={3} colIndex={1} stickyColumns={stickyColumns}>
                    Name
                  </LeafHeaderCell>
                  <GroupHeaderCell groupId="configuration" colSpan={3} colIndex={2} stickyColumns={stickyColumns}>
                    Configuration
                  </GroupHeaderCell>
                  <GroupHeaderCell groupId="metrics" colSpan={4} colIndex={5} stickyColumns={stickyColumns}>
                    Metrics
                  </GroupHeaderCell>
                  <LeafHeaderCell columnId="cost" rowSpan={3} colIndex={9} stickyColumns={stickyColumns}>
                    Cost
                  </LeafHeaderCell>
                </tr>
                {/* Row 1: config leaves (rowSpan=2) + metrics sub-groups */}
                <tr>
                  <LeafHeaderCell columnId="type" rowSpan={2} colIndex={2} stickyColumns={stickyColumns}>
                    Type
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="az" rowSpan={2} colIndex={3} stickyColumns={stickyColumns}>
                    AZ
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="state" rowSpan={2} colIndex={4} stickyColumns={stickyColumns}>
                    State
                  </LeafHeaderCell>
                  <GroupHeaderCell groupId="performance" colSpan={2} colIndex={5} stickyColumns={stickyColumns}>
                    Performance
                  </GroupHeaderCell>
                  <GroupHeaderCell groupId="network" colSpan={2} colIndex={7} stickyColumns={stickyColumns}>
                    Network
                  </GroupHeaderCell>
                </tr>
                {/* Row 2: performance + network leaves */}
                <tr>
                  <LeafHeaderCell columnId="cpu" colIndex={5} stickyColumns={stickyColumns}>
                    CPU (%)
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="memory" colIndex={6} stickyColumns={stickyColumns}>
                    Memory (%)
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="netIn" colIndex={7} stickyColumns={stickyColumns}>
                    Net in
                  </LeafHeaderCell>
                  <LeafHeaderCell columnId="netOut" colIndex={8} stickyColumns={stickyColumns}>
                    Net out
                  </LeafHeaderCell>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    {leafColumns.map((col, colIndex) => (
                      <BodyCell key={col.key} columnId={col.key} colIndex={colIndex} stickyColumns={stickyColumns}>
                        {col.render(item)}
                      </BodyCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </SpaceBetween>
    </Box>
  );
}

// --- Reusable cell components ---

function LeafHeaderCell({
  columnId,
  stickyColumns,
  children,
  rowSpan,
  colIndex,
}: {
  columnId: string;
  stickyColumns: StickyColumnsModel;
  children: React.ReactNode;
  rowSpan?: number;
  colIndex?: number;
}) {
  const stickyStyles = useStickyCellStyles({
    columnId,
    stickyColumns,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-last-left']]: !!props?.lastInsetInlineStart,
      [styles['sticky-cell-last-right']]: !!props?.lastInsetInlineEnd,
    }),
  });
  return (
    <th
      ref={stickyStyles.ref}
      style={stickyStyles.style}
      className={clsx(styles['custom-table-cell'], stickyStyles.className)}
      rowSpan={rowSpan}
      data-col-index={colIndex}
    >
      {children}
    </th>
  );
}

function GroupHeaderCell({
  groupId,
  colSpan,
  stickyColumns,
  children,
  colIndex,
}: {
  groupId: string;
  colSpan: number;
  stickyColumns: StickyColumnsModel;
  children: React.ReactNode;
  colIndex?: number;
}) {
  const getStickyClassName = (state: StickyColumnsGroupHeaderState | null) => ({
    // [styles['sticky-cell']]: !!state?.isStuck,
    [styles['sticky-cell']]: !!state?.isClamped,
    [styles['sticky-cell-last-left']]: !!state?.isClamped && !!state?.lastInsetInlineStart,
    [styles['sticky-cell-last-right']]: !!state?.isClamped && !!state?.lastInsetInlineEnd,
  });

  const { ref, innerRef, className } = useStickyGroupHeaderStyles({
    stickyColumns,
    groupId,
    getClassName: getStickyClassName,
  });

  return (
    <th ref={ref} colSpan={colSpan} className={clsx(styles['custom-table-cell'], className)} data-col-index={colIndex}>
      <div
        ref={innerRef}
        style={{
          overflow: 'hidden',
          position: 'sticky',
          insetInlineStart: 0,
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        {children}
      </div>
    </th>
  );
}

function BodyCell({
  columnId,
  colIndex,
  stickyColumns,
  children,
}: {
  columnId: string;
  colIndex: number;
  stickyColumns: StickyColumnsModel;
  children: React.ReactNode;
}) {
  const stickyStyles = useStickyCellStyles({
    columnId,
    stickyColumns,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-last-left']]: !!props?.lastInsetInlineStart,
      [styles['sticky-cell-last-right']]: !!props?.lastInsetInlineEnd,
    }),
  });
  return (
    <td
      ref={stickyStyles.ref}
      style={stickyStyles.style}
      className={clsx(styles['custom-table-cell'], stickyStyles.className)}
      data-col-index={colIndex}
    >
      {children}
    </td>
  );
}
