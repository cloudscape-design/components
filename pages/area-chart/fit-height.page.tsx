// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { createLinearTimeLatencyProps } from './series';
import { AreaChart, AreaChartProps, Box, Button, Checkbox, SpaceBetween } from '~components';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<AppContextType<{ hideFilter: boolean; hideLegend: boolean; minHeight: number }>>;

const containerStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  padding: '8px',
  border: '2px solid black',
};

const chartProps: AreaChartProps<number> = {
  ariaLabel: 'Linear latency chart',
  ariaDescription:
    'Use up/down arrow keys to navigate between series, and left/right arrow keys to navigate within a series.',
  loadingText: 'Loading chart data...',
  errorText: 'Error loading chart data.',
  recoveryText: 'Retry',
  onRecoveryClick: () => {},
  empty: (
    <Box textAlign="center" color="inherit">
      <b>No data</b>
      <Box variant="p" color="inherit">
        There is no data to display
      </Box>
    </Box>
  ),
  noMatch: (
    <Box textAlign="center" color="inherit">
      <b>No matching data</b>
      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        There is no data to display
      </Box>
      <Button onClick={() => alert('Not implemented in the example')}>Clear filter</Button>
    </Box>
  ),
  i18nStrings: {
    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    filterSelectedAriaLabel: '(selected)',
    detailTotalLabel: 'Total',
    detailPopoverDismissAriaLabel: 'Dismiss',
    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'area chart',
    xAxisAriaRoleDescription: 'x axis',
    yAxisAriaRoleDescription: 'y axis',
  },
  ...createLinearTimeLatencyProps(),
  xDomain: [0, 119],
};

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const minHeight = parseInt(urlParams.minHeight?.toString() || '0');
  return (
    <Box padding="m">
      <h1>Area chart fit height</h1>
      <SpaceBetween size="l">
        <Box>
          <Checkbox checked={urlParams.hideFilter} onChange={e => setUrlParams({ hideFilter: e.detail.checked })}>
            hide filter
          </Checkbox>
          <Checkbox checked={urlParams.hideLegend} onChange={e => setUrlParams({ hideLegend: e.detail.checked })}>
            hide legend
          </Checkbox>
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <input
              type="number"
              value={minHeight}
              onChange={e => setUrlParams({ minHeight: parseInt(e.target.value) })}
            />
            <Box>min height</Box>
          </SpaceBetween>
        </Box>
        <Box>
          <Box>800px</Box>
          <div style={{ ...containerStyle, height: '800px' }}>
            <AreaChart
              fitHeight={true}
              height={minHeight}
              hideFilter={urlParams.hideFilter}
              hideLegend={urlParams.hideLegend}
              {...chartProps}
            />
          </div>
        </Box>
        <Box>
          <Box>400px</Box>
          <div style={{ ...containerStyle, height: '400px' }}>
            <AreaChart
              fitHeight={true}
              height={minHeight}
              hideFilter={urlParams.hideFilter}
              hideLegend={urlParams.hideLegend}
              {...chartProps}
            />
          </div>
        </Box>
        <Box>
          <Box>200px</Box>
          <div style={{ ...containerStyle, height: '200px' }}>
            <AreaChart
              fitHeight={true}
              height={minHeight}
              hideFilter={urlParams.hideFilter}
              hideLegend={urlParams.hideLegend}
              {...chartProps}
            />
          </div>
        </Box>
      </SpaceBetween>
    </Box>
  );
}
