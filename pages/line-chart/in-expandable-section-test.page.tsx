// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import LineChart from '~components/line-chart';
import ExpandableSection from '~components/expandable-section';

import { MixedLineBarChartProps } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

import { data1, data2, commonProps, lineChartInstructions } from '../mixed-line-bar-chart/common';

type ExpectedSeries = MixedLineBarChartProps.LineDataSeries<number> | MixedLineBarChartProps.ThresholdSeries;

const series: ReadonlyArray<ExpectedSeries> = [
  { title: 'Series 1', type: 'line', data: data1 },
  { title: 'Series 2', type: 'line', data: data2 },
  { title: 'Threshold', type: 'threshold', y: 150 },
];

export default function () {
  return (
    <ScreenshotArea>
      <h1>Line chart integration tests</h1>
      <Box padding="l">
        <ExpandableSection
          id="expandable-section"
          variant="container"
          headerText="Line Chart inside Expandable Section"
        >
          <LineChart
            {...commonProps}
            id="chart"
            height={130}
            series={series}
            xDomain={[0, 32]}
            yDomain={[0, 300]}
            xTickFormatter={x =>
              'Very long label that should not overlap with the next one nor overflow the chart. Tick:' + x
            }
            xTitle="Time"
            yTitle="Latency (ms)"
            xScaleType="linear"
            ariaLabel="Line chart"
            ariaDescription={lineChartInstructions}
          />
        </ExpandableSection>
      </Box>
    </ScreenshotArea>
  );
}
