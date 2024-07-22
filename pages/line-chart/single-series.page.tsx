// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import LineChart from '~components/line-chart';

import { commonProps, data1, lineChartInstructions } from '../mixed-line-bar-chart/common';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Line chart integration tests</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Line Chart</Header>}>
          <LineChart
            {...commonProps}
            id="chart"
            height={130}
            series={[{ title: 'Series 1', type: 'line', data: data1 }]}
            xDomain={[0, 32]}
            yDomain={[0, 50]}
            xTitle="Time"
            yTitle="Latency (ms)"
            xScaleType="linear"
            ariaLabel="Line chart"
            ariaDescription={lineChartInstructions}
          />
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
