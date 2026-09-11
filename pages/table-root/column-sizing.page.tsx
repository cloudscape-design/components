// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableCell from '~components/table-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableHeaderRow from '~components/table-header-row';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { Item, makeItems } from './common';

// Column-sizing playground (grid layout). Adjust each column's sizing mode, value, and min/max width on
// the page to explore how `columnLayout: 'grid'` compiles `ColumnDefinition`s into a grid-template-columns
// track list. A CSS grid track can't be both weighted and hard-capped, so a column with a maxWidth grows
// only up to its cap while the flex weights share the remaining space among the uncapped columns.

type Mode = 'fixed' | 'flex';
interface ColConfig {
  label: string;
  field: keyof Item;
  mode: Mode;
  value: number; // pixels when fixed, flex weight when flex
  minWidth: string; // raw input text; '' means unset
  maxWidth: string;
}

const MODE_OPTIONS: ReadonlyArray<SelectProps.Option> = [
  { value: 'fixed', label: 'Fixed (px)' },
  { value: 'flex', label: 'Flex (weight)' },
];

const INITIAL: ColConfig[] = [
  { label: 'Name', field: 'name', mode: 'flex', value: 2, minWidth: '160', maxWidth: '' },
  { label: 'Type', field: 'type', mode: 'flex', value: 1, minWidth: '', maxWidth: '' },
  { label: 'Size', field: 'size', mode: 'fixed', value: 120, minWidth: '', maxWidth: '' },
  { label: 'Status', field: 'status', mode: 'flex', value: 1, minWidth: '', maxWidth: '200' },
];

const ITEM_COUNT = 8;

function toColumnDefinition(config: ColConfig): TableRootProps.ColumnDefinition {
  if (config.mode === 'fixed') {
    return { size: config.value };
  }
  const definition: TableRootProps.ColumnDefinition = { size: { flex: config.value } };
  const min = parseInt(config.minWidth, 10);
  const max = parseInt(config.maxWidth, 10);
  if (!Number.isNaN(min)) {
    definition.minWidth = min;
  }
  if (!Number.isNaN(max)) {
    definition.maxWidth = max;
  }
  return definition;
}

export default function TableColumnSizingPlaygroundPage() {
  const items = makeItems(ITEM_COUNT);
  const [configs, setConfigs] = useState<ColConfig[]>(INITIAL);

  const update = (index: number, patch: Partial<ColConfig>) =>
    setConfigs(prev => prev.map((config, i) => (i === index ? { ...config, ...patch } : config)));

  const columns = useMemo(() => configs.map(toColumnDefinition), [configs]);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — column-sizing playground (grid layout)</Box>
        <Box color="text-body-secondary">
          Adjust each column below and watch the table re-lay out. A CSS grid track can&apos;t be both weighted and
          hard-capped, so a column with a maxWidth grows only up to its cap while the flex weights share the remaining
          space among the uncapped columns.
        </Box>

        <ColumnLayout columns={configs.length}>
          {configs.map((config, index) => (
            <SpaceBetween key={config.label} size="xs">
              <Box variant="h3">{config.label}</Box>
              <FormField label="Mode">
                <Select
                  selectedOption={MODE_OPTIONS.find(option => option.value === config.mode) ?? MODE_OPTIONS[0]}
                  options={MODE_OPTIONS}
                  onChange={({ detail }) => update(index, { mode: detail.selectedOption.value as Mode })}
                />
              </FormField>
              <FormField label={config.mode === 'fixed' ? 'Width (px)' : 'Flex weight'}>
                <Input
                  type="number"
                  value={String(config.value)}
                  onChange={({ detail }) => update(index, { value: Number(detail.value) || 0 })}
                />
              </FormField>
              <FormField label="minWidth (px)" description="Flex only">
                <Input
                  type="number"
                  value={config.minWidth}
                  disabled={config.mode === 'fixed'}
                  onChange={({ detail }) => update(index, { minWidth: detail.value })}
                />
              </FormField>
              <FormField label="maxWidth (px)" description="Flex only">
                <Input
                  type="number"
                  value={config.maxWidth}
                  disabled={config.mode === 'fixed'}
                  onChange={({ detail }) => update(index, { maxWidth: detail.value })}
                />
              </FormField>
            </SpaceBetween>
          ))}
        </ColumnLayout>

        <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
          {`columnLayout = { type: 'grid', columns: ${JSON.stringify(columns)} }`}
        </pre>

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <TableRoot columnLayout={{ type: 'grid', columns }} ariaLabel="Resources">
            <TableHead>
              <TableHeaderRow>
                {configs.map(config => (
                  <TableHeaderCell key={config.label}>{config.label}</TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {items.map((item: Item) => (
                <TableRow key={item.id}>
                  {configs.map(config => (
                    <TableCell key={config.label}>{item[config.field]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
