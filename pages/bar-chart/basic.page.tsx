// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Grid from '~components/grid';
import Box from '~components/box';
import BarChart from '~components/bar-chart';
import ScreenshotArea from '../utils/screenshot-area';

import {
  data3,
  commonProps,
  latencyData,
  dateTimeFormatter,
  logarithmicData,
  barTimeData,
  barTimeSeries,
  barChartInstructions,
  multipleNegativeBarsDataWithThreshold,
  multipleBarsDataWithThreshold,
} from '../mixed-line-bar-chart/common';

const timeData = latencyData.slice(0, 10);

export default function () {
  return (
    <ScreenshotArea>
      <h1>Bar charts</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 6 } },
            { colspan: { default: 12 } },
          ]}
        >
          <Container header={<Header variant="h2">Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'bar', data: data3 },
                { title: 'Threshold', type: 'threshold', y: 400 },
              ]}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart"
              ariaDescription={barChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Bar Chart with gaps</Header>}>
            <BarChart
              {...commonProps}
              height={250}
              series={[
                { title: 'Calories', type: 'bar', data: data3 },
                { title: 'Threshold', type: 'threshold', y: 400 },
              ]}
              xDomain={data3.map(d => d.x)}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart with gaps"
              ariaDescription={barChartInstructions}
            />
          </Container>

          <Container header={<Header variant="h2">Stacked Bar Chart with negative values</Header>}>
            <BarChart
              {...commonProps}
              height={400}
              series={multipleNegativeBarsDataWithThreshold}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[-6, 10]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              stackedBars={true}
              ariaLabel="Stacked Bar Chart with negative values"
              ariaDescription={barChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Horizontal Bar Chart with negative values</Header>}>
            <BarChart
              {...commonProps}
              height={400}
              series={multipleNegativeBarsDataWithThreshold}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[-4, 8]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              horizontalBars={true}
              ariaLabel="Horizontal Bar Chart with negative values"
              ariaDescription={barChartInstructions}
            />
          </Container>

          <Container header={<Header variant="h2">Time-based Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={250}
              ariaLabel="Time-based bar chart"
              series={[
                { title: 'Series 1', type: 'bar', data: timeData.map(({ time, p90 }) => ({ x: time, y: p90 })) },
              ]}
              xDomain={timeData.map(({ time }) => time)}
              yDomain={[100, 300]}
              xScaleType="categorical"
              xTitle="X value"
              yTitle="Y value"
              hideFilter={true}
              i18nStrings={{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }}
              ariaDescription={barChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Logarithmic Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={250}
              ariaLabel="Logarithmic bar chart"
              series={[{ title: 'Series 1', type: 'bar', data: logarithmicData }]}
              xDomain={logarithmicData.map(({ x }) => x)}
              yDomain={[100, 1000000]}
              xTitle="X value"
              yTitle="Y value"
              xScaleType="categorical"
              yScaleType="log"
              hideFilter={true}
              ariaDescription={barChartInstructions}
            />
          </Container>

          <Container header={<Header variant="h2">Horizontal Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={400}
              series={[{ title: 'Calories', type: 'bar', data: data3 }]}
              horizontalBars={true}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Horizontal Bar Chart"
              ariaDescription={barChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Horizontal Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={400}
              series={multipleBarsDataWithThreshold}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 12]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              ariaLabel="Horizontal Bar Chart"
              stackedBars={true}
              horizontalBars={true}
              ariaDescription={barChartInstructions}
            />
          </Container>

          <Container header={<Header variant="h2">Horizontal Bar Chart</Header>}>
            <BarChart
              {...commonProps}
              height={300}
              series={barTimeSeries}
              xDomain={barTimeData.map(({ x }) => new Date(x.getTime()))}
              yDomain={[0, 500000]}
              xTitle="Time (UTC)"
              yTitle="Bytes transferred"
              xScaleType="categorical"
              ariaLabel="Horizontal Bar Chart"
              i18nStrings={{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }}
              ariaDescription={barChartInstructions}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
