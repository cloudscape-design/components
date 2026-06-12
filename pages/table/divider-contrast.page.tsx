// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Mode } from '@cloudscape-design/global-styles';

import {
  Box,
  CollectionPreferences,
  CollectionPreferencesProps,
  ColumnLayout,
  FormField,
  Header,
  Input,
  Link,
  Select,
  SpaceBetween,
  StatusIndicator,
  Table,
  TableProps,
  Toggle,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

// ---------------------------------------------------------------------------
// Token reference values (read from design-tokens visual-refresh).
// Hard-coded so the prototype can show the contrast number for "the real
// token" even when the user has overridden it. If tokens change, update here.
// ---------------------------------------------------------------------------
// Resolved from style-dictionary/visual-refresh + style-dictionary/core/color-palette.ts:
//   colorBorderDividerDefault             → colorNeutral350 (light) / colorNeutral650 (dark)
//   colorBorderDividerInteractiveDefault  → colorNeutral500 (light) / colorNeutral300 (dark)
//   colorBackgroundTableHeader            → colorBackgroundContainerHeader
//                                         → colorWhite (light) / colorNeutral850 (dark)
//   neutral{N} maps to colorGrey{N} in core/color-palette.ts.
const TOKEN_VALUES = {
  light: {
    'color-border-divider-default': '#c6c6cd', // colorGrey350
    'color-border-divider-interactive-default': '#8c8c94', // colorGrey500
    'color-background-table-header': '#ffffff', // colorWhite
  },
  dark: {
    'color-border-divider-default': '#424650', // colorGrey650
    'color-border-divider-interactive-default': '#dedee3', // colorGrey300
    'color-background-table-header': '#161d26', // colorGrey850
  },
};

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------
interface Instance {
  id: string;
  name: string;
  type: string;
  az: string;
  state: string;
  cpu: number;
  memory: number;
  netIn: number;
  netOut: number;
  cost: number;
}

const allInstances: Instance[] = Array.from({ length: 12 }, (_, i) => ({
  id: `i-${String(i + 1).padStart(3, '0')}`,
  name: `instance-${i + 1}`,
  type: ['t3.medium', 't3.large', 'r5.xlarge'][i % 3],
  az: ['us-east-1a', 'us-east-1b'][i % 2],
  state: ['running', 'stopped'][i % 2],
  cpu: +(40 + ((i * 7) % 60)).toFixed(1),
  memory: +(30 + ((i * 11) % 70)).toFixed(1),
  netIn: 1000 + i * 437,
  netOut: 800 + i * 311,
  cost: +(20 + i * 13.7).toFixed(2),
}));

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  { id: 'id', header: 'Instance ID', cell: item => <Link href="#">{item.id}</Link>, isRowHeader: true },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'type', header: 'Type', cell: item => item.type },
  { id: 'az', header: 'AZ', cell: item => item.az },
  { id: 'state', header: 'State', cell: item => item.state },
  { id: 'cpu', header: 'CPU (%)', cell: item => `${item.cpu}%` },
  { id: 'memory', header: 'Memory (%)', cell: item => `${item.memory}%` },
  { id: 'netIn', header: 'Network in', cell: item => item.netIn.toLocaleString() },
  { id: 'netOut', header: 'Network out', cell: item => item.netOut.toLocaleString() },
  { id: 'cost', header: 'Cost ($)', cell: item => `$${item.cost}` },
];

const groupDefinitions: TableProps.GroupDefinition[] = [
  { id: 'config', header: 'Configuration' },
  { id: 'performance', header: 'Performance' },
  { id: 'network', header: 'Network' },
  { id: 'metrics', header: 'Metrics' },
];

type DepthPreset = 'depth-2' | 'depth-3' | 'flat';

const columnDisplayPresets: Record<DepthPreset, TableProps.ColumnDisplayProperties[]> = {
  flat: columnDefinitions.map(c => ({ id: c.id!, visible: true })),
  'depth-2': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'config',
      visible: true,
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
        { id: 'state', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'performance',
      visible: true,
      children: [
        { id: 'cpu', visible: true },
        { id: 'memory', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'network',
      visible: true,
      children: [
        { id: 'netIn', visible: true },
        { id: 'netOut', visible: true },
      ],
    },
    { id: 'cost', visible: true },
  ],
  'depth-3': [
    { id: 'id', visible: true },
    { id: 'name', visible: true },
    {
      type: 'group',
      id: 'config',
      visible: true,
      children: [
        { id: 'type', visible: true },
        { id: 'az', visible: true },
        { id: 'state', visible: true },
      ],
    },
    {
      type: 'group',
      id: 'metrics',
      visible: true,
      children: [
        {
          type: 'group',
          id: 'performance',
          visible: true,
          children: [
            { id: 'cpu', visible: true },
            { id: 'memory', visible: true },
          ],
        },
        {
          type: 'group',
          id: 'network',
          visible: true,
          children: [
            { id: 'netIn', visible: true },
            { id: 'netOut', visible: true },
          ],
        },
      ],
    },
    { id: 'cost', visible: true },
  ],
};

const depthOptions = [
  { value: 'depth-3', label: 'Depth 3 (nested groups)' },
  { value: 'depth-2', label: 'Depth 2 (single-level groups)' },
  { value: 'flat', label: 'Flat (no groups)' },
];

// ---------------------------------------------------------------------------
// Color presets (the actual question on the table).
// ---------------------------------------------------------------------------
type TokenPreset = 'default' | 'interactive';

const presetOptions = [
  { value: 'default', label: 'colorBorderDividerDefault' },
  { value: 'interactive', label: 'colorBorderDividerInteractiveDefault' },
];

// ---------------------------------------------------------------------------
// Contrast helpers (WCAG 2.x relative luminance).
// ---------------------------------------------------------------------------
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return null;
  }
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) {
    return null;
  }
  const [l1, l2] = [relativeLuminance(fgRgb), relativeLuminance(bgRgb)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

function ContrastIndicator({ ratio }: { ratio: number | null }) {
  if (ratio === null) {
    return <StatusIndicator type="warning">Invalid hex</StatusIndicator>;
  }
  const passes = ratio >= 3;
  return (
    <StatusIndicator type={passes ? 'success' : 'error'}>
      {ratio.toFixed(2)}:1 {passes ? '— passes 3:1' : '— below 3:1'}
    </StatusIndicator>
  );
}

// ---------------------------------------------------------------------------
// Resolve the hex value for a token preset in the given mode. The Select acts
// as a "load preset" action — the editable Input is always the source of
// truth for what gets applied to the table.
// ---------------------------------------------------------------------------
function presetHex(preset: 'default' | 'interactive', mode: 'light' | 'dark'): string {
  const tokenName = preset === 'default' ? 'color-border-divider-default' : 'color-border-divider-interactive-default';
  return TOKEN_VALUES[mode][tokenName];
}

// Reverse lookup: which preset (if any) matches `hex` in the active mode?
function matchingPresetOption(hex: string, mode: 'light' | 'dark') {
  const normalized = hex.trim().toLowerCase();
  return presetOptions.find(opt => presetHex(opt.value as TokenPreset, mode).toLowerCase() === normalized) ?? null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
type DemoContext = React.Context<
  AppContextType<{
    depth: DepthPreset;
    horizontalHex: string;
    verticalHex: string;
    resizable: boolean;
    stickyHeader: boolean;
    firstSticky: number;
    lastSticky: number;
  }>
>;

export default function DividerContrastPage() {
  const {
    mode,
    setMode,
    urlParams: {
      depth = 'depth-3' as DepthPreset,
      // Initialised from the current-mode interactive-default token so the
      // initial render matches production. Edit freely or use the preset
      // dropdown to overwrite with another token's hex.
      horizontalHex = TOKEN_VALUES.light['color-border-divider-interactive-default'],
      verticalHex = TOKEN_VALUES.light['color-border-divider-interactive-default'],
      resizable = true,
      stickyHeader = true,
      firstSticky = 1,
      lastSticky = 1,
    },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [columnDisplay, setColumnDisplay] = useState<TableProps.ColumnDisplayProperties[]>(columnDisplayPresets[depth]);

  // CollectionPreferences-driven settings. Initial sticky values come from the URL
  // so deep-linking still works; further changes flow through the preferences modal.
  const [tablePrefs, setTablePrefs] = useState<CollectionPreferencesProps.Preferences>({
    wrapLines: false,
    stripedRows: false,
    contentDensity: 'comfortable',
    stickyColumns: { first: firstSticky, last: lastSticky },
  });

  const modeKey: 'light' | 'dark' = mode === Mode.Dark ? 'dark' : 'light';
  const horizontalColor = horizontalHex;
  const verticalColor = verticalHex;
  const headerBg = TOKEN_VALUES[modeKey]['color-background-table-header'];

  const horizontalRatio = contrastRatio(horizontalColor, headerBg);
  const verticalRatio = contrastRatio(verticalColor, headerBg);

  // The override drives two CSS custom properties consumed inside the
  // table source (header-cell + resizer SCSS). The properties have the
  // production tokens as fallbacks, so this prototype is invisible when
  // these styles aren't set.
  const overrideStyle = {
    '--awsui-table-divider-horizontal-prototype': horizontalColor,
    '--awsui-table-divider-vertical-prototype': verticalColor,
  } as React.CSSProperties;

  const tableItems = allInstances;

  // Effective sticky-column counts: the preferences value wins, with a URL-param fallback.
  const effectiveFirst = tablePrefs.stickyColumns?.first ?? firstSticky;
  const effectiveLast = tablePrefs.stickyColumns?.last ?? lastSticky;

  return (
    <SimplePage
      title="Table divider contrast"
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SpaceBetween size="m">
          <ColumnLayout columns={2}>
            <FormField label="Horizontal dividers" description="Header bottom border + multi-row group separators.">
              <SpaceBetween size="xs">
                <Select
                  selectedOption={matchingPresetOption(horizontalHex, modeKey)}
                  placeholder="Options"
                  options={presetOptions}
                  onChange={({ detail }) =>
                    setUrlParams({
                      horizontalHex: presetHex(detail.selectedOption.value as TokenPreset, modeKey),
                    })
                  }
                  ariaLabel="Horizontal divider preset"
                />
                <Input
                  ariaLabel="Horizontal divider hex"
                  value={horizontalHex}
                  onChange={({ detail }) => setUrlParams({ horizontalHex: detail.value })}
                />
                <Box fontSize="body-s">
                  <code>{horizontalColor}</code> on <code>{headerBg}</code> &mdash;{' '}
                  <ContrastIndicator ratio={horizontalRatio} />
                </Box>
              </SpaceBetween>
            </FormField>

            <FormField label="Vertical dividers" description="Column resizers and separators.">
              <SpaceBetween size="xs">
                <Select
                  selectedOption={matchingPresetOption(verticalHex, modeKey)}
                  placeholder="Options"
                  options={presetOptions}
                  onChange={({ detail }) =>
                    setUrlParams({
                      verticalHex: presetHex(detail.selectedOption.value as TokenPreset, modeKey),
                    })
                  }
                  ariaLabel="Vertical divider preset"
                />
                <Input
                  ariaLabel="Vertical divider hex"
                  value={verticalHex}
                  onChange={({ detail }) => setUrlParams({ verticalHex: detail.value })}
                />
                <Box fontSize="body-s">
                  <code>{verticalColor}</code> on <code>{headerBg}</code> &mdash;{' '}
                  <ContrastIndicator ratio={verticalRatio} />
                </Box>
              </SpaceBetween>
            </FormField>
          </ColumnLayout>

          <Box variant="h3">Layout & sticky</Box>
          <ColumnLayout columns={4}>
            <FormField label="Header depth">
              <Select
                selectedOption={depthOptions.find(o => o.value === depth) ?? depthOptions[0]}
                options={depthOptions}
                onChange={({ detail }) => {
                  const next = detail.selectedOption.value as DepthPreset;
                  setUrlParams({ depth: next });
                  setColumnDisplay(columnDisplayPresets[next]);
                }}
                ariaLabel="Header depth"
              />
            </FormField>
            <FormField label="Color mode">
              <Select
                selectedOption={{ value: modeKey, label: modeKey === 'light' ? 'Light' : 'Dark' }}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                onChange={({ detail }) => setMode(detail.selectedOption.value === 'dark' ? Mode.Dark : Mode.Light)}
                ariaLabel="Color mode"
              />
            </FormField>
            <SpaceBetween size="xs" direction="horizontal">
              <Toggle checked={resizable} onChange={({ detail }) => setUrlParams({ resizable: detail.checked })}>
                Resizable
              </Toggle>
              <Toggle checked={stickyHeader} onChange={({ detail }) => setUrlParams({ stickyHeader: detail.checked })}>
                Sticky header
              </Toggle>
            </SpaceBetween>
          </ColumnLayout>
        </SpaceBetween>
      }
    >
      <div style={overrideStyle}>
        <Table
          columnDefinitions={columnDefinitions}
          groupDefinitions={depth === 'flat' ? undefined : groupDefinitions}
          columnDisplay={columnDisplay}
          items={tableItems}
          trackBy="id"
          resizableColumns={resizable}
          stickyHeader={stickyHeader}
          stickyColumns={{ first: effectiveFirst, last: effectiveLast }}
          wrapLines={tablePrefs.wrapLines}
          stripedRows={tablePrefs.stripedRows}
          contentDensity={tablePrefs.contentDensity}
          variant="container"
          ariaLabels={{
            tableLabel: 'Instances',
          }}
          header={<Header counter={`(${tableItems.length})`}>Instances</Header>}
          empty={<Box textAlign="center">No instances</Box>}
          preferences={
            <CollectionPreferences
              title="Table preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{ ...tablePrefs, contentDisplay: columnDisplay }}
              onConfirm={({ detail }) => {
                if (detail.contentDisplay) {
                  setColumnDisplay([...detail.contentDisplay]);
                }
                setTablePrefs({
                  wrapLines: detail.wrapLines ?? false,
                  stripedRows: detail.stripedRows ?? false,
                  contentDensity: detail.contentDensity ?? 'comfortable',
                  stickyColumns: detail.stickyColumns ?? { first: 0, last: 0 },
                });
                if (detail.stickyColumns) {
                  setUrlParams({
                    firstSticky: detail.stickyColumns.first ?? 0,
                    lastSticky: detail.stickyColumns.last ?? 0,
                  });
                }
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Show all the text on multiple lines instead of truncating it.',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Add alternating shaded rows for readability.',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Reduce vertical spacing between rows.',
              }}
              stickyColumnsPreference={{
                firstColumns: {
                  title: 'Stick first columns',
                  description: 'Keep leading columns visible while horizontally scrolling.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'First column', value: 1 },
                    { label: 'First two columns', value: 2 },
                  ],
                },
                lastColumns: {
                  title: 'Stick last columns',
                  description: 'Keep trailing columns visible while horizontally scrolling.',
                  options: [
                    { label: 'None', value: 0 },
                    { label: 'Last column', value: 1 },
                    { label: 'Last two columns', value: 2 },
                    { label: 'Last three columns', value: 3 },
                  ],
                },
              }}
              contentDisplayPreference={{
                title: 'Column preferences',
                description: 'Reorder, show, and hide columns. Drag a column to a different group.',
                options: [
                  { id: 'id', label: 'Instance ID', alwaysVisible: true },
                  { id: 'name', label: 'Name' },
                  { id: 'type', label: 'Type' },
                  { id: 'az', label: 'AZ' },
                  { id: 'state', label: 'State' },
                  { id: 'cpu', label: 'CPU (%)' },
                  { id: 'memory', label: 'Memory (%)' },
                  { id: 'netIn', label: 'Network in' },
                  { id: 'netOut', label: 'Network out' },
                  { id: 'cost', label: 'Cost ($)' },
                ],
                groups:
                  depth === 'flat'
                    ? undefined
                    : [
                        { id: 'config', label: 'Configuration' },
                        { id: 'performance', label: 'Performance' },
                        { id: 'network', label: 'Network' },
                        { id: 'metrics', label: 'Metrics' },
                      ],
              }}
            />
          }
        />
      </div>
    </SimplePage>
  );
}
