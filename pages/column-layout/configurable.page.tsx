// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Checkbox,
  ColumnLayout,
  ColumnLayoutProps,
  FormField,
  Input,
  KeyValuePairs,
  Select,
  SelectProps,
  SpaceBetween,
} from '~components';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageUrlParams =
  | 'columns'
  | 'items'
  | 'borders'
  | 'variant'
  | 'disableGutters'
  | 'minColumnWidth'
  | 'containerWidth'
  | 'keyValuePairs';

const borderOptions: ReadonlyArray<SelectProps.Option> = (
  ['none', 'vertical', 'horizontal', 'all'] satisfies ColumnLayoutProps.Borders[]
).map(value => ({ value, label: value }));

const variantOptions: ReadonlyArray<SelectProps.Option> = (
  ['default', 'text-grid'] satisfies ColumnLayoutProps.Variant[]
).map(value => ({ value, label: value }));

/** Resolved facts read back from the DOM, so the readout reflects the rendering rather than repeating its inputs. */
interface ResolvedLayout {
  renderer: string;
  columnsPerRow: number;
  rows: number;
}

function measureLayout(root: HTMLElement): ResolvedLayout | null {
  // ColumnLayout renders a `column-layout` wrapper div, and the chosen renderer's root inside it.
  const renderer = root.firstElementChild?.firstElementChild as HTMLElement | undefined;
  const items = renderer ? (Array.from(renderer.children) as HTMLElement[]) : [];
  if (!renderer || items.length === 0) {
    return null;
  }

  // Items in the same row share an offsetTop, which works for both renderers regardless of how
  // they arrive at their column count.
  const rowTops = new Set(items.map(item => item.offsetTop));
  return {
    // Only FlexibleColumnLayout sets gridTemplateColumns, and it sets it inline.
    renderer: renderer.style.gridTemplateColumns ? 'FlexibleColumnLayout (CSS grid)' : 'GridColumnLayout (12-column)',
    columnsPerRow: items.filter(item => item.offsetTop === items[0].offsetTop).length,
    rows: rowTops.size,
  };
}

export default function ColumnLayoutConfigurablePage() {
  const { urlParams, setUrlParams } = useAppContext<PageUrlParams>();

  const columns = Number(urlParams.columns) || 6;
  const itemCount = Number(urlParams.items) || 14;
  const borders = (String(urlParams.borders || 'none') as ColumnLayoutProps.Borders) ?? 'none';
  const variant = (String(urlParams.variant || 'default') as ColumnLayoutProps.Variant) ?? 'default';
  const disableGutters = urlParams.disableGutters === true;
  const minColumnWidth = Number(urlParams.minColumnWidth) || undefined;
  const containerWidth = Number(urlParams.containerWidth) || undefined;
  const showKeyValuePairs = urlParams.keyValuePairs === true;

  const demoRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<ResolvedLayout | null>(null);

  useEffect(() => {
    const root = demoRef.current;
    if (!root) {
      return;
    }

    const measure = () => {
      const next = measureLayout(root);
      setResolved(previous =>
        previous &&
        next &&
        previous.renderer === next.renderer &&
        previous.columnsPerRow === next.columnsPerRow &&
        previous.rows === next.rows
          ? previous
          : next
      );
    };

    // Re-measure on width changes so the responsive collapse can be observed while resizing.
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [columns, itemCount, variant, borders, minColumnWidth, containerWidth, disableGutters]);

  return (
    <SimplePage
      title="Column layout — configurable"
      subtitle="Set any column count and border option, with or without minColumnWidth, and observe how the layout resolves."
      settings={
        <SpaceBetween size="m">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
            <FormField label="Columns" description="Any positive integer.">
              <Input
                type="number"
                value={String(columns)}
                onChange={event => setUrlParams({ columns: event.detail.value })}
              />
            </FormField>

            <FormField label="Items" description="Number of children to render.">
              <Input
                type="number"
                value={String(itemCount)}
                onChange={event => setUrlParams({ items: event.detail.value })}
              />
            </FormField>

            <FormField
              label="Borders"
              description="Only drawn by the 12-column renderer: needs 4 columns or fewer, no minColumnWidth, and the default variant."
            >
              <Select
                selectedOption={borderOptions.find(option => option.value === borders) ?? borderOptions[0]}
                options={[...borderOptions]}
                onChange={event => setUrlParams({ borders: event.detail.selectedOption.value })}
              />
            </FormField>

            <FormField label="Variant">
              <Select
                selectedOption={variantOptions.find(option => option.value === variant) ?? variantOptions[0]}
                options={[...variantOptions]}
                onChange={event => setUrlParams({ variant: event.detail.selectedOption.value })}
              />
            </FormField>

            <FormField label="minColumnWidth (px)" description="Empty to leave unset.">
              <Input
                type="number"
                value={urlParams.minColumnWidth ? String(urlParams.minColumnWidth) : ''}
                onChange={event => setUrlParams({ minColumnWidth: event.detail.value })}
              />
            </FormField>

            <FormField label="Container width (px)" description="Empty for full width.">
              <Input
                type="number"
                value={urlParams.containerWidth ? String(urlParams.containerWidth) : ''}
                onChange={event => setUrlParams({ containerWidth: event.detail.value })}
              />
            </FormField>
          </div>

          <SpaceBetween size="xs">
            <Checkbox
              checked={disableGutters}
              onChange={event => setUrlParams({ disableGutters: event.detail.checked })}
            >
              disableGutters
            </Checkbox>
            <Checkbox
              checked={showKeyValuePairs}
              onChange={event => setUrlParams({ keyValuePairs: event.detail.checked })}
            >
              Also render KeyValuePairs with the same column count
            </Checkbox>
          </SpaceBetween>

          <Box variant="small" data-testid="resolved-layout">
            {resolved
              ? `Renderer: ${resolved.renderer} · resolved columns per row: ${resolved.columnsPerRow} · rows: ${resolved.rows}`
              : 'Nothing rendered.'}
          </Box>
        </SpaceBetween>
      }
      screenshotArea={{ style: { padding: '1rem' } }}
    >
      <div
        style={{
          maxWidth: containerWidth,
          // Marks the container bounds so the collapse behaviour can be attributed to the width.
          outline: '1px dashed currentColor',
        }}
      >
        <div ref={demoRef} data-testid="column-layout">
          <ColumnLayout
            columns={columns}
            borders={borders}
            variant={variant}
            disableGutters={disableGutters}
            minColumnWidth={minColumnWidth}
          >
            {Array.from({ length: itemCount }, (_, index) => (
              <div key={index}>
                <Box variant="awsui-key-label">Label {index + 1}</Box>
                <div>Value {index + 1}</div>
              </div>
            ))}
          </ColumnLayout>
        </div>

        {showKeyValuePairs && (
          <div data-testid="key-value-pairs" style={{ marginBlockStart: '2rem' }}>
            <KeyValuePairs
              columns={columns}
              minColumnWidth={minColumnWidth}
              items={Array.from({ length: itemCount }, (_, index) => ({
                label: `Label ${index + 1}`,
                value: `Value ${index + 1}`,
              }))}
            />
          </div>
        )}
      </div>
    </SimplePage>
  );
}
