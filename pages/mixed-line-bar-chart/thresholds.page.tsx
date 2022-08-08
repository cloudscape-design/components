// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Grid from '~components/grid';
import Box from '~components/box';
import MixedLineBarChart from '~components/mixed-line-bar-chart';
import ScreenshotArea from '../utils/screenshot-area';
import { colorChartsThresholdInfo, colorChartsThresholdPositive, colorChartsThresholdNegative } from '~design-tokens';

import {
  data1,
  data2,
  data3,
  data5,
  data6,
  multipleBarsData,
  commonProps,
  barChartInstructions,
  lineChartInstructions,
} from './common';

export default function () {
  return (
    <ScreenshotArea>
      <Box variant="h1">Mixed charts with different thresholds</Box>
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
            { colspan: { default: 12, s: 6 } },
          ]}
        >
          <Container header={<Header variant="h2">Line chart </Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Series 1', type: 'line', data: data1 },
                { title: 'Series 2', type: 'line', data: data2 },
                { title: 'Threshold', type: 'threshold', y: 150 },
                { title: 'Negative', type: 'threshold', x: 7, color: colorChartsThresholdNegative },
                { title: 'Info', type: 'threshold', x: 8.5, color: colorChartsThresholdInfo },
                { title: 'Positive', type: 'threshold', x: 9.3, color: colorChartsThresholdPositive },
              ]}
              xDomain={[0, data1.length]}
              yDomain={[-30, 300]}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              ariaDescription={`Arbitrary line chart about latency. ${lineChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Mixed chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'bar', data: data3 },
                { title: 'Happiness', type: 'line', data: data5 },
                { title: 'Careful', type: 'threshold', x: 'Chocolate', color: colorChartsThresholdNegative },
                { title: 'Yellow', type: 'threshold', x: 'Bananas', color: '#eebb01' },
                { title: 'Threshold', type: 'threshold', y: 300 },
              ]}
              xDomain={['Apples', 'Oranges', 'Potatoes', 'Bananas', 'Chocolate']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Mixed chart"
              ariaDescription={`Arbitrary mixed chart about food. ${barChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Bar chart horizontal</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'bar', data: data3 },
                { title: 'Careful', type: 'threshold', x: 'Chocolate', color: colorChartsThresholdNegative },
                { title: 'Yellow', type: 'threshold', x: 'Bananas', color: '#eebb01' },
                { title: 'Threshold', type: 'threshold', y: 300 },
              ]}
              xDomain={['Apples', 'Oranges', 'Potatoes', 'Bananas', 'Chocolate']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart horizontal"
              ariaDescription={`Arbitrary bar chart about food. ${barChartInstructions}`}
              horizontalBars={true}
            />
          </Container>

          <Container header={<Header variant="h2">Stacked bar chart</Header>}>
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
                { type: 'threshold', title: 'citrus', x: 'Oranges' },
                { title: 'Threshold', type: 'threshold', y: 6 },
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

          <Container header={<Header variant="h2">Stacked bar chart horizontal</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                ...multipleBarsData,
                { type: 'threshold', title: 'citrus', x: 'Oranges' },
                { title: 'Threshold', type: 'threshold', y: 6 },
              ]}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              stackedBars={true}
              ariaLabel="Stacked bar chart horizontal"
              ariaDescription={`Arbitrary stacked bar chart. ${barChartInstructions}`}
              horizontalBars={true}
            />
          </Container>

          <Container header={<Header variant="h2">Grouped bar chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                ...multipleBarsData,
                { type: 'threshold', title: 'citrus', x: 'Oranges' },
                { title: 'Threshold', type: 'threshold', y: 6 },
              ]}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              ariaLabel="Grouped bar chart"
              ariaDescription={`Arbitrary mixed chart about food. ${barChartInstructions}`}
            />
          </Container>

          <Container header={<Header variant="h2">Grouped bar chart horizontal</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                ...multipleBarsData,
                { type: 'threshold', title: 'citrus', x: 'Oranges' },
                { title: 'Threshold', type: 'threshold', y: 6 },
              ]}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              ariaLabel="Grouped bar chart"
              ariaDescription={`Arbitrary mixed chart about food. ${barChartInstructions}`}
              horizontalBars={true}
            />
          </Container>

          <Container header={<Header variant="h2">Dense bar chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Values', type: 'bar', data: data6 },
                { title: 'Upper limit', type: 'threshold', y: 150 },
                { title: 'Left', type: 'threshold', x: 50.5, color: colorChartsThresholdNegative },
                { title: 'Center', type: 'threshold', x: 52.5, color: colorChartsThresholdInfo },
                { title: 'Right', type: 'threshold', x: 55, color: colorChartsThresholdNegative },
              ]}
              xDomain={[...data6.map(d => d.x), 50.5, 52.5].sort()}
              xTitle="Index"
              yTitle="Value"
              xScaleType="categorical"
              ariaLabel="Dense bar chart"
              ariaDescription={`Dense bar chart. ${barChartInstructions}`}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
