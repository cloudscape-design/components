// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import MixedLineBarChart from '~components/mixed-line-bar-chart';
import { colorChartsThresholdInfo } from '~design-tokens';
import ScreenshotArea from '../utils/screenshot-area';

import { barChartInstructions, commonProps, data3, data4 } from './common';

export default function () {
  return (
    <ScreenshotArea>
      <Box variant="h1">Mixed chart with long left labels</Box>
      <Box padding="l">
        <MixedLineBarChart
          {...commonProps}
          horizontalBars={true}
          hideFilter={true}
          id="chart"
          height={250}
          series={[
            { title: 'Happiness', type: 'bar', data: data4.filter(({ x }) => x !== 'Chocolate') },
            { title: 'Threshold', type: 'threshold', y: 420, color: colorChartsThresholdInfo },
          ]}
          xDomain={data3.map(d => d.x)}
          yDomain={[0, 650]}
          xTitle="Dinner"
          yTitle="Calories (kcal)"
          xScaleType="categorical"
          ariaLabel="Dinner chart"
          ariaDescription={barChartInstructions}
          xTickFormatter={value =>
            (() => {
              switch (value) {
                case 'Potatoes':
                  return 'Potatoes (fried, ~400g)';
                case 'Chocolate':
                  return 'Chocolate (none was left)';
                case 'Apples':
                  return 'Apples (1 apple)';
                case 'Oranges':
                  return 'Oranges (fresh orange juice, 300ml)';
                default:
                  return value;
              }
            })()
          }
        />
      </Box>
    </ScreenshotArea>
  );
}
