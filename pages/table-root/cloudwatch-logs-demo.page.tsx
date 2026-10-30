// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * CloudWatch Logs Insights–style demo exercising R1 atomic table features:
 * - Sticky header with page-scroll pinning and horizontal-scroll alignment
 * - Grid columnLayout with explicit column widths (simulating query results)
 * - Row selection with multi-select checkboxes
 * - Keyboard-accessible horizontal scroll region (role='region' when overflow)
 * - Large dataset (500 rows) simulating query results
 */
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import styles from './styles.scss';

const LOG_LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const LAMBDA_FUNCTIONS = [
  'process-orders-prod',
  'user-auth-handler',
  'payment-gateway-v2',
  'notification-sender',
  'data-aggregator',
  'api-gateway-router',
  'cache-invalidator',
  'metric-collector',
];

const MESSAGES = [
  'Request processed successfully',
  'Lambda execution started',
  'Database connection established',
  'Cache hit for key',
  'Retrying operation attempt',
  'Invalid input parameter',
  'Rate limit exceeded',
  'Connection timeout',
  'Memory usage threshold reached',
  'Authentication token validated',
];

interface LogEntry {
  id: string;
  timestamp: string;
  requestId: string;
  level: LogLevel;
  functionName: string;
  message: string;
  duration: number;
  billedDuration: number;
  memoryUsed: number;
  memoryAllocated: number;
}

const generateLogEntries = (count: number): LogEntry[] => {
  const baseTime = new Date('2026-09-27T10:00:00.000Z').getTime();
  return Array.from({ length: count }, (_, i) => {
    const offset = i * 127; // stagger timestamps
    const level = LOG_LEVELS[i % LOG_LEVELS.length];
    return {
      id: `log-${i}`,
      timestamp: new Date(baseTime + offset).toISOString(),
      requestId: `${crypto.randomUUID().slice(0, 8)}-${String(i).padStart(4, '0')}`,
      level,
      functionName: LAMBDA_FUNCTIONS[i % LAMBDA_FUNCTIONS.length],
      message: MESSAGES[i % MESSAGES.length],
      duration: Math.floor(Math.random() * 2000) + 50,
      billedDuration: Math.ceil((Math.floor(Math.random() * 2000) + 50) / 100) * 100,
      memoryUsed: Math.floor(Math.random() * 200) + 64,
      memoryAllocated: 256,
    };
  });
};

const GRID_COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [
  { size: 40 }, // selection checkbox
  { size: 220 }, // timestamp
  { size: 140 }, // requestId
  { size: 70 }, // level
  { size: 180 }, // functionName
  { size: 280 }, // message
  { size: 100 }, // duration
  { size: 120 }, // billedDuration
  { size: 100 }, // memoryUsed
  { size: 120 }, // memoryAllocated
];

const TOTAL_COLUMNS = GRID_COLUMNS.length;
void TOTAL_COLUMNS; // Column count is used for documentation/validation

function LevelIndicator({ level }: { level: LogLevel }) {
  const typeMap: Record<LogLevel, 'success' | 'warning' | 'error' | 'info'> = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    DEBUG: 'success',
  };
  return <StatusIndicator type={typeMap[level]}>{level}</StatusIndicator>;
}

export default function CloudWatchLogsDemo() {
  const [rowCount, setRowCount] = useState<'100' | '500' | '1000'>('500');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const logs = useMemo(() => generateLogEntries(parseInt(rowCount, 10)), [rowCount]);

  const allSelected = logs.length > 0 && selectedIds.size === logs.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < logs.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(logs.map(l => l.id)));
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const columnLayout: TableRootProps.ColumnLayout = { type: 'grid', columns: GRID_COLUMNS };

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">CloudWatch Logs Insights — R1 Atomic Table Demo</Header>
        <Container
          header={
            <Header
              description="Exercises sticky header, grid layout, row selection, and keyboard-accessible horizontal scroll"
              counter={`(${logs.length} log entries, ${selectedIds.size} selected)`}
            >
              Query results
            </Header>
          }
        >
          <SpaceBetween size="m">
            <SegmentedControl
              selectedId={rowCount}
              onChange={({ detail }) => {
                setRowCount(detail.selectedId as '100' | '500' | '1000');
                setSelectedIds(new Set());
              }}
              label="Row count"
              options={[
                { id: '100', text: '100 rows' },
                { id: '500', text: '500 rows' },
                { id: '1000', text: '1000 rows' },
              ]}
            />
            <Box color="text-body-secondary" fontSize="body-s">
              Scroll down — header pins to page top. Scroll right — pinned header tracks columns. Tab to the table
              region and use arrow keys to scroll horizontally.
            </Box>
          </SpaceBetween>
        </Container>

        <TableRoot
          columnLayout={columnLayout}
          ariaLabel="CloudWatch Logs query results"
          ariaRowcount={logs.length + 1}
          stickyHeader={
            <TableHead>
              <TableRow>
                <TableHeaderCell disablePaddings={true}>
                  <div className={styles['selection-cell']}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={() => handleSelectAll()}
                      ariaLabel="Select all log entries"
                    />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>@timestamp</TableHeaderCell>
                <TableHeaderCell>@requestId</TableHeaderCell>
                <TableHeaderCell>@level</TableHeaderCell>
                <TableHeaderCell>@functionName</TableHeaderCell>
                <TableHeaderCell>@message</TableHeaderCell>
                <TableHeaderCell>@duration (ms)</TableHeaderCell>
                <TableHeaderCell>@billedDuration</TableHeaderCell>
                <TableHeaderCell>@memoryUsed (MB)</TableHeaderCell>
                <TableHeaderCell>@memoryAllocated</TableHeaderCell>
              </TableRow>
            </TableHead>
          }
          stickyHeaderOffset={0}
        >
          <TableBody>
            {logs.map((log, index) => {
              const isSelected = selectedIds.has(log.id);
              return (
                <TableRow key={log.id} selected={isSelected} ariaRowindex={index + 2}>
                  <TableBodyCell disablePaddings={true}>
                    <div className={styles['selection-cell']}>
                      <Checkbox
                        checked={isSelected}
                        onChange={({ detail }) => handleSelectRow(log.id, detail.checked)}
                        ariaLabel={`Select log entry ${log.requestId}`}
                      />
                    </div>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box variant="code" fontSize="body-s">
                      {log.timestamp}
                    </Box>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box variant="code" fontSize="body-s">
                      {log.requestId}
                    </Box>
                  </TableBodyCell>
                  <TableBodyCell>
                    <LevelIndicator level={log.level} />
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box variant="code" fontSize="body-s">
                      {log.functionName}
                    </Box>
                  </TableBodyCell>
                  <TableBodyCell>{log.message}</TableBodyCell>
                  <TableBodyCell>
                    <Box textAlign="right">{log.duration.toLocaleString()}</Box>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box textAlign="right">{log.billedDuration.toLocaleString()} ms</Box>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box textAlign="right">{log.memoryUsed}</Box>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Box textAlign="right">{log.memoryAllocated} MB</Box>
                  </TableBodyCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableRoot>
      </SpaceBetween>
    </Box>
  );
}
