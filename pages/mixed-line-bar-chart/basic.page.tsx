// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import MixedLineBarChart from '~components/mixed-line-bar-chart';

import ScreenshotArea from '../utils/screenshot-area';
import {
  barChartInstructions,
  commonProps,
  data1,
  data2,
  data3,
  data4,
  lineChartInstructions,
  multipleBarsData,
} from './common';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Mixed charts</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 4 } },
            { colspan: { default: 12, s: 4 } },
            { colspan: { default: 12, s: 4 } },
          ]}
        >
          <Container header={<Header variant="h2">Line Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Series 1', type: 'line', data: data1 },
                { title: 'Series 2', type: 'line', data: data2 },
                { title: 'Threshold', type: 'threshold', y: 150 },
              ]}
              xDomain={[0, data1.length]}
              yDomain={[0, 300]}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              ariaDescription={`Arbitrary line chart about latency. ${lineChartInstructions}`}
            />
          </Container>
          <Container header={<Header variant="h2">Mixed Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'bar', data: data3 },
                { title: 'Happiness', type: 'line', data: data4 },
              ]}
              xDomain={data3.map(d => d.x)}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Mixed Chart"
              ariaDescription={`Arbitrary mixed chart about food. ${barChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Stacked Bar Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                ...multipleBarsData,
                {
                  type: 'line',
                  title: 'foo',
                  data: [
                    { x: 'Apples', y: 7 },
                    { x: 'Oranges', y: 5 },
                  ],
                },
              ]}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              stackedBars={true}
              ariaLabel="Stacked Bar Chart"
              ariaDescription={`Arbitrary stacked bar chart. ${barChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Grouped Bar Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={multipleBarsData}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              ariaLabel="Grouped Bar Chart"
              ariaDescription={`Arbitrary mixed chart about food. ${barChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Mixed Chart</Header>}>
            <MixedLineBarChart {...commonProps} ariaLabel="Mixed chart" series={[]} height={250} />
          </Container>
          <Container header={<Header variant="h2">Mixed Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              ariaLabel="Loading chart"
              series={[{ title: 'Series 1', type: 'line', data: data1 }]}
              statusType="loading"
              height={250}
            />
          </Container>
          <Container header={<Header variant="h2">Mixed Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              ariaLabel="Broken mixed chart"
              series={[{ title: 'Series 1', type: 'line', data: data1 }]}
              statusType="error"
              height={250}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
