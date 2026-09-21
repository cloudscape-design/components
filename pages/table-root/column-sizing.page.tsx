// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import TableBody from '~components/table-body';
import TableBodyCell from '~components/table-body-cell';
import TableHead from '~components/table-head';
import TableHeaderCell from '~components/table-header-cell';
import TableRoot, { TableRootProps } from '~components/table-root';
import TableRow from '~components/table-row';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { Item, makeItems } from './common';

// Column-sizing playground (grid layout). Adjust each column's sizing mode and widths to explore how
// `columnLayout: 'grid'` compiles `ColumnDefinition`s into a grid-template-columns track list. A CSS grid
// track can't be both fr-weighted and px-capped, so `flex` and `maxWidth` are mutually exclusive in the
// type: use `flex` (weighted, shares free space) or `capped` (grows only up to maxWidth), not both.

type Mode = 'fixed' | 'flex' | 'capped';
interface ColConfig {
  label: string;
  field: keyof Item;
  mode: Mode;
  value: number; // pixels when fixed, flex weight when flex; unused when capped
  minWidth: string; // raw input text; '' means unset
  maxWidth: string;
}

const MODE_OPTIONS: ReadonlyArray<SelectProps.Option> = [
  { value: 'fixed', label: 'Fixed (px)' },
  { value: 'flex', label: 'Flex (weight)' },
  { value: 'capped', label: 'Capped (maxWidth)' },
];

const INITIAL: ColConfig[] = [
  { label: 'Name', field: 'name', mode: 'flex', value: 2, minWidth: '160', maxWidth: '' },
  { label: 'Type', field: 'type', mode: 'flex', value: 1, minWidth: '', maxWidth: '' },
  { label: 'Size', field: 'size', mode: 'fixed', value: 120, minWidth: '', maxWidth: '' },
  { label: 'Status', field: 'status', mode: 'capped', value: 1, minWidth: '', maxWidth: '200' },
];

const ITEM_COUNT = 8;

// The per-column mutable fields persisted to the URL; label/field are fixed and restored from INITIAL.
type StoredCol = Pick<ColConfig, 'mode' | 'value' | 'minWidth' | 'maxWidth'>;

function serializeConfigs(configs: ColConfig[]): string {
  return JSON.stringify(configs.map(({ mode, value, minWidth, maxWidth }) => ({ mode, value, minWidth, maxWidth })));
}

function parseConfigs(raw: string | boolean | undefined): ColConfig[] {
  if (typeof raw === 'string') {
    try {
      const stored = JSON.parse(raw) as Partial<StoredCol>[];
      if (Array.isArray(stored) && stored.length === INITIAL.length) {
        return INITIAL.map((base, index) => ({ ...base, ...stored[index] }));
      }
    } catch {
      // Malformed URL value — fall back to defaults.
    }
  }
  return INITIAL;
}

function toColumnDefinition(config: ColConfig): TableRootProps.ColumnDefinition {
  const min = parseInt(config.minWidth, 10);
  const max = parseInt(config.maxWidth, 10);
  if (config.mode === 'fixed') {
    return { size: config.value };
  }
  if (config.mode === 'capped') {
    // Non-weighted, hard-capped track (grows up to maxWidth). No flex weight.
    return { ...(Number.isNaN(min) ? {} : { minWidth: min }), ...(Number.isNaN(max) ? {} : { maxWidth: max }) };
  }
  // flex: weighted track, optional minWidth (a fr track can carry a min but not a hard cap).
  return { size: { flex: config.value }, ...(Number.isNaN(min) ? {} : { minWidth: min }) };
}

export default function TableColumnSizingPlaygroundPage() {
  const items = makeItems(ITEM_COUNT);
  const { urlParams, setUrlParams } = useAppContext<'columns'>();
  const configs = useMemo(() => parseConfigs(urlParams.columns), [urlParams.columns]);

  const update = (index: number, patch: Partial<ColConfig>) =>
    setUrlParams({
      columns: serializeConfigs(configs.map((config, i) => (i === index ? { ...config, ...patch } : config))),
    });

  const columns = useMemo(() => configs.map(toColumnDefinition), [configs]);

  return (
    <SimplePage title="Table atomics — column-sizing playground (grid layout)" screenshotArea={{}}>
      <SpaceBetween size="l">
        <Box color="text-body-secondary">
          Adjust each column below and watch the table re-lay out. A CSS grid track can&apos;t be both weighted and
          hard-capped, so a column is either <em>flex</em> (shares free space by weight) or <em>capped</em> (grows only
          up to maxWidth) — never both.
        </Box>

        <ColumnLayout columns={configs.length}>
          {configs.map((config, index) => (
            <SpaceBetween key={config.label} size="xs">
              <Box variant="h2">{config.label}</Box>
              <FormField label="Mode">
                <Select
                  selectedOption={MODE_OPTIONS.find(option => option.value === config.mode) ?? MODE_OPTIONS[0]}
                  options={MODE_OPTIONS}
                  onChange={({ detail }) => update(index, { mode: detail.selectedOption.value as Mode })}
                />
              </FormField>
              {config.mode !== 'capped' && (
                <FormField label={config.mode === 'fixed' ? 'Width (px)' : 'Flex weight'}>
                  <Input
                    type="number"
                    value={String(config.value)}
                    onChange={({ detail }) => update(index, { value: Number(detail.value) || 0 })}
                  />
                </FormField>
              )}
              <FormField label="minWidth (px)" description="Flex or capped">
                <Input
                  type="number"
                  value={config.minWidth}
                  disabled={config.mode === 'fixed'}
                  onChange={({ detail }) => update(index, { minWidth: detail.value })}
                />
              </FormField>
              <FormField label="maxWidth (px)" description="Capped mode only">
                <Input
                  type="number"
                  value={config.maxWidth}
                  disabled={config.mode !== 'capped'}
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
              <TableRow>
                {configs.map(config => (
                  <TableHeaderCell key={config.label}>{config.label}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: Item) => (
                <TableRow key={item.id}>
                  {configs.map(config => (
                    <TableBodyCell key={config.label}>{item[config.field]}</TableBodyCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
