// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import BarChart from '~components/bar-chart';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';

const series1 = [
  {
    title: 'John',
    type: 'bar' as const,
    data: [
      { x: 'Apples\nare\ngood', y: 5 },
      { x: 'Oranges\nare\ngood', y: 3 },
      { x: 'Pears\nare\ngood', y: 4 },
      { x: 'Grapes\nare\ngood', y: 7 },
      { x: 'Bananas\nare\ngood', y: 2 },
    ],
  },
  {
    title: 'Jane',
    type: 'bar' as const,
    data: [
      { x: 'Apples\nare\ngood', y: 2 },
      { x: 'Oranges\nare\ngood', y: 2 },
      { x: 'Pears\nare\ngood', y: 3 },
      { x: 'Grapes\nare\ngood', y: 2 },
      { x: 'Bananas\nare\ngood', y: 1 },
    ],
  },
  {
    title: 'Joe',
    type: 'bar' as const,
    data: [
      { x: 'Apples\nare\ngood', y: 3 },
      { x: 'Oranges\nare\ngood', y: 4 },
      { x: 'Pears\nare\ngood', y: 4 },
      { x: 'Grapes\nare\ngood', y: 2 },
      { x: 'Bananas\nare\ngood', y: 2 },
    ],
  },
];

const series2 = [
  {
    title: 'Conformance Packs',
    type: 'bar' as const,
    data: [{ x: 'AWS-QuickSetup-Operational\n-Best-Practices-for-AWS-Well-\nArchitected-Security-Pillar', y: 5 }],
  },
];

export default function () {
  return (
    <ScreenshotArea>
      <h1>Bar chart integration test</h1>
      <Box padding="l">
        <BarChart
          {...commonProps}
          id="chart-horizontal"
          height={300}
          series={series1}
          xDomain={[
            'Apples\nare\ngood',
            'Oranges\nare\ngood',
            'Pears\nare\ngood',
            'Grapes\nare\ngood',
            'Bananas\nare\ngood',
          ]}
          yDomain={[0, 8]}
          xTitle="Conformance Packs"
          yTitle="Number of rules"
          xScaleType="categorical"
          horizontalBars={true}
          ariaLabel="Horizontal bar chart"
          ariaDescription={barChartInstructions}
        />
        <BarChart
          {...commonProps}
          id="chart-horizontal"
          height={300}
          series={series2}
          xDomain={['AWS-QuickSetup-Operational\n-Best-Practices-for-AWS-Well-\nArchitected-Security-Pillar']}
          yDomain={[0, 8]}
          xTitle="Food"
          yTitle="Consumption"
          xScaleType="categorical"
          horizontalBars={true}
          ariaLabel="Horizontal bar chart"
          ariaDescription={barChartInstructions}
        />
      </Box>
    </ScreenshotArea>
  );
}
