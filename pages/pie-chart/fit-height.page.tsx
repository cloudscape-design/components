// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Box, Button, Checkbox, PieChart, SpaceBetween } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { FoodData, commonProps, data1 } from './common';

type DemoContext = React.Context<AppContextType<{ hideFilter: boolean; hideLegend: boolean; minHeight: number }>>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const minHeight = parseInt(urlParams.minHeight?.toString() || '0');
  const heights = [800, 600, 400, 300, 200, 100];
  return (
    <Box padding="m">
      <h1>Pie chart fit height</h1>

      <Box>
        <Checkbox checked={urlParams.hideFilter} onChange={e => setUrlParams({ hideFilter: e.detail.checked })}>
          hide filter
        </Checkbox>
        <Checkbox checked={urlParams.hideLegend} onChange={e => setUrlParams({ hideLegend: e.detail.checked })}>
          hide legend
        </Checkbox>
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <input
            id="min-height-input"
            type="number"
            value={minHeight}
            onChange={e => setUrlParams({ minHeight: parseInt(e.target.value) })}
          />
          <label htmlFor="min-height-input">min height</label>
        </SpaceBetween>
      </Box>

      <ScreenshotArea>
        <SpaceBetween size="l">
          {heights.map(height => (
            <Box key={height}>
              <Box>{height}px</Box>
              <div
                style={{ boxSizing: 'border-box', width: '100%', padding: '8px', border: '2px solid black', height }}
              >
                <PieChart<FoodData>
                  {...commonProps}
                  fitHeight={true}
                  hideFilter={urlParams.hideFilter}
                  hideLegend={urlParams.hideLegend}
                  data={data1}
                  ariaLabel="Food facts"
                  size="medium"
                  detailPopoverFooter={segment => <Button>Filter by {segment.title}</Button>}
                />
              </div>
            </Box>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
