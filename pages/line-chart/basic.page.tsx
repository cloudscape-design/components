// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import LineChart from '~components/line-chart';

import {
  barChartInstructions,
  commonProps,
  data1,
  data2,
  data3,
  lineChartInstructions,
} from '../mixed-line-bar-chart/common';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Line charts</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: 12 },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: 12 },
          ]}
        >
          <Container header={<Header variant="h2">Line Chart</Header>}>
            <LineChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Series 1', type: 'line', data: data1 },
                { title: 'Series 2', type: 'line', data: data2 },
                { title: 'Threshold', type: 'threshold', y: 150 },
              ]}
              xDomain={[0, 32]}
              yDomain={[0, 300]}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Line Chart</Header>}>
            <LineChart
              {...commonProps}
              height={250}
              series={[{ title: 'Series 1', type: 'line', data: data1 }]}
              xDomain={[0, 32]}
              yDomain={[0, 40]}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Line Chart</Header>}>
            <LineChart
              {...commonProps}
              height={250}
              series={[{ title: 'Series 2', type: 'line', data: data2 }]}
              xDomain={[0, 32]}
              yDomain={[0, 300]}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Line Chart with categorical axis</Header>}>
            <LineChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'line', data: data3 },
                { title: 'Threshold', type: 'threshold', y: 400 },
              ]}
              xDomain={['Potatoes', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Line chart with categorical axis"
              ariaDescription={barChartInstructions}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
