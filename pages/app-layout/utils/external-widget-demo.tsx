// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import { Alert, BarChart, Box, ColumnLayout, FormField, Input, SpaceBetween, Textarea, Tiles } from '~components';
import awsuiPlugins from '~components/internal/plugins';

function Details() {
  const [value, setValue] = React.useState('item1');
  const [inputValue, setInputValue] = React.useState('');
  const [valueText, setValueText] = React.useState('');
  return (
    <SpaceBetween size="xl">
      <Tiles
        onChange={({ detail }) => setValue(detail.value)}
        value={value}
        items={[
          {
            label: 'Start a new investigation',
            value: 'item1',
          },
          {
            label: 'Add to an existing investigation',
            value: 'item2',
          },
        ]}
      />
      <ColumnLayout borders="horizontal">
        <SpaceBetween size="xs">
          <Box variant="h4">Investigation details</Box>
          <Box padding={{ bottom: 's' }}>
            <FormField label="Investigation name" description="Enter a unique name for this investigation">
              <Input
                value={inputValue}
                onChange={event => setInputValue(event.detail.value)}
                placeholder="Enter name of investigation"
                ariaLabel="Investigation name input"
              />
            </FormField>
          </Box>
        </SpaceBetween>
        <SpaceBetween size="xs">
          <Box variant="h4">New finding details</Box>
          <BarChart
            series={[
              {
                title: 'Site 1',
                type: 'bar',
                data: [
                  { x: new Date(1601071200000), y: 34503 },
                  { x: new Date(1601078400000), y: 25832 },
                  { x: new Date(1601085600000), y: 4012 },
                  { x: new Date(1601092800000), y: -5602 },
                  { x: new Date(1601100000000), y: 17839 },
                ],
                valueFormatter: e =>
                  '$' +
                  e.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                title: 'Average revenue',
                type: 'threshold',
                y: 19104,
                valueFormatter: e =>
                  '$' +
                  e.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
            ]}
            xDomain={[
              new Date(1601071200000),
              new Date(1601078400000),
              new Date(1601085600000),
              new Date(1601092800000),
              new Date(1601100000000),
            ]}
            yDomain={[-10000, 40000]}
            i18nStrings={{
              xTickFormatter: e =>
                e
                  .toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: !1,
                  })
                  .split(',')
                  .join('\n'),
              yTickFormatter: function o(e) {
                return Math.abs(e) >= 1e9
                  ? (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
                  : Math.abs(e) >= 1e6
                    ? (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                    : Math.abs(e) >= 1e3
                      ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                      : e.toFixed(2);
              },
            }}
            ariaLabel="Revenue chart showing Site 1 performance and average revenue threshold"
            height={300}
            hideFilter={true}
            hideLegend={true}
            xTitle="Time (UTC)"
            yTitle="Revenue (USD)"
          />
          <Box padding={{ bottom: 's' }}>
            <FormField label="Finding details" description="Provide detailed information about the finding">
              <Textarea
                onChange={({ detail }) => setValueText(detail.value)}
                value={valueText}
                placeholder="Enter detailed information about the finding"
                ariaLabel="Finding details input"
              />
            </FormField>
          </Box>
        </SpaceBetween>
      </ColumnLayout>
    </SpaceBetween>
  );
}

function Chats() {
  return (
    <SpaceBetween size="m">
      <Alert header="Known issues/limitations">
        Review the documentation to learn about potential compatibility issues with specific database versions.
      </Alert>
    </SpaceBetween>
  );
}
awsuiPlugins.appLayout.registerDrawer({
  id: 'bolt-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 350,
  preserveInactiveContent: true,

  isExpandable: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
    expandedModeButton: 'Expanded mode button',
  },
  onToggle: event => {
    console.log('circle-global drawer on toggle', event.detail);
  },

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false" aria-hidden="true" role="presentation">
<path d="M11.5 1H6L2 9.5H6.4L7.4 15L14 6.26923L9 6.26923L11.5 1Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>
`,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(
      <SpaceBetween size="l">
        <div style={{ paddingBlockStart: '15px', paddingInlineStart: '20px', margin: 0 }}>
          <Box variant="h3">Investigate Cold Start Chaser</Box>
        </div>
        <Box padding={{ left: 'l', right: 'l' }}>
          <Details />
        </Box>
      </SpaceBetween>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'q-global',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 350,
  preserveInactiveContent: true,

  isExpandable: true,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button',
    resizeHandle: 'Resize handle',
    expandedModeButton: 'Expanded mode button',
  },
  onToggle: event => {
    console.log('g-global drawer on toggle', event.detail);
  },

  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false" aria-hidden="true" role="presentation"><path d="m14.22,3.41L8.87.32c-.24-.14-.55-.21-.87-.21s-.63.07-.87.21L1.78,3.41c-.48.27-.87.95-.87,1.5v6.18c0,.55.39,1.22.87,1.5l5.36,3.09c.24.14.55.21.87.21s.63-.07.87-.21l5.36-3.09c.48-.28.87-.95.87-1.5v-6.18c0-.55-.39-1.23-.87-1.5Zm-6.22,10.47l-5.09-2.94v-5.88l5.09-2.94,5.09,2.94v4.72l-3.09-1.78v-.74c0-.26-.14-.49-.36-.62l-1.28-.74c-.11-.06-.24-.1-.36-.1s-.25.03-.36.1l-1.28.74c-.22.13-.36.37-.36.62v1.48c0,.26.14.49.36.62l1.28.74c.11.06.24.1.36.1s.25-.03.36-.1l.64-.37,3.09,1.78-4.09,2.36Z" fill="currentColor" stroke-width="0"></path></svg>
`,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(
      <SpaceBetween size="l">
        <div style={{ paddingBlockStart: '15px', paddingInlineStart: '20px', margin: 0 }}>
          <Box variant="h3">Amazon Q</Box>
        </div>
        <Box padding={{ left: 'l', right: 'l' }}>
          <Chats />
        </Box>
      </SpaceBetween>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});
