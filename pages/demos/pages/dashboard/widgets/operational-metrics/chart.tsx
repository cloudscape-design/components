// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart, { BarChartProps } from '@cloudscape-design/components/bar-chart';

const costs: BarChartProps<string>['series'] = [
  {
    type: 'bar',
    title: 'Value',
    data: [
      { x: 'A', y: 170.25 },
      { x: 'B', y: 116.07 },
      { x: 'C', y: 54.19 },
      { x: 'D', y: 15.18 },
      { x: 'E', y: 15.03 },
      { x: 'F', y: 49.85 },
    ],
  },
];

export function BreakdownChart() {
  return (
    <BarChart
      hideFilter={true}
      hideLegend={true}
      fitHeight={true}
      height={25}
      xScaleType="categorical"
      xTitle="Chars"
      yTitle="Numbers"
      series={costs}
    />
  );
}
