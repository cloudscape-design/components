// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Box from '~components/box';
import LineChart from '~components/line-chart';
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
  const [highlightedSeries, setHighlightedSeries] = useState<ExpectedSeries | null>(null);
  return (
    <ScreenshotArea>
      <h1>Line chart integration tests</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Line Chart</Header>}>
          <LineChart
            {...commonProps}
            id="chart"
            height={130}
            series={series}
            highlightedSeries={highlightedSeries}
            xDomain={[0, 32]}
            yDomain={[0, 300]}
            xTitle="Time"
            yTitle="Latency (ms)"
            xScaleType="linear"
            ariaLabel="Line chart"
            ariaDescription={lineChartInstructions}
            onHighlightChange={({ detail }) => setHighlightedSeries(detail.highlightedSeries as ExpectedSeries)}
            detailPopoverFooter={() =>
              highlightedSeries ? (
                <>
                  <hr />
                  Footer content
                </>
              ) : null
            }
          />
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
