// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Grid from '~components/grid';
import Box from '~components/box';
import BarChart from '~components/bar-chart';
import ScreenshotArea from '../utils/screenshot-area';

import {
  data3,
  commonProps,
  dateTimeFormatter,
  multipleBarsData,
  barTimeSeries,
  barTimeData,
  barChartInstructions,
} from '../mixed-line-bar-chart/common';
import { Button } from '~components';

const months = ['May 2022', 'Jun 2022', 'Jul 2022', 'Aug 2022', 'Sep 2022'];

const valueFormatter = (n: number) => '$' + n.toLocaleString('en-US');

export const barMonthSeries = [
  {
    title: 'EC2',
    type: 'bar' as const,
    data: barTimeData.map(({ site1 }, i) => ({ x: months[i], y: site1 })),
    valueFormatter,
  },
  {
    title: 'Cloudfront',
    type: 'bar' as const,
    data: barTimeData.map(({ site2 }, i) => ({ x: months[i], y: site2 })),
    valueFormatter,
  },
  {
    title: 'ECS',
    type: 'bar' as const,
    data: barTimeData.map(({ site3 }, i) => ({ x: months[i], y: site3 })),
    valueFormatter,
  },
  {
    title: 'Route 53',
    type: 'bar' as const,
    data: barTimeData.map(({ site4 }, i) => ({ x: months[i], y: site4 })),
    valueFormatter,
  },
  {
    title: 'Sagemaker',
    type: 'bar' as const,
    data: barTimeData.map(({ site5 }, i) => ({ x: months[i], y: site5 })),
    valueFormatter,
  },
  {
    title: 'Glue',
    type: 'bar' as const,
    data: barTimeData.map(({ site6 }, i) => ({ x: months[i], y: site6 })),
    valueFormatter,
  },
];

export default function () {
  return (
    <ScreenshotArea>
      <h1>Bar chart integration test</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
          ]}
        >
          <div>
            <BarChart
              {...commonProps}
              height={300}
              series={barMonthSeries}
              xDomain={months}
              yDomain={[0, 2000000]}
              xTitle="Month"
              yTitle="Money spent (USD)"
              xScaleType="categorical"
              yScaleType="linear"
              stackedBars={true}
              ariaLabel="Multiple data series line chart"
              i18nStrings={{ ...commonProps.i18nStrings }}
              ariaDescription={barChartInstructions}
              detailPopoverFooter={xValue => (
                <Box margin={{ top: 'm' }}>
                  <Button variant="normal">View bill for {xValue}</Button>
                </Box>
              )}
            />
          </div>
          <div>
            <input id="focus-target" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart"
              height={250}
              series={[{ title: 'Calories', type: 'bar', data: data3 }]}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart"
              ariaDescription={barChartInstructions}
            />
          </div>
          <BarChart
            {...commonProps}
            id="chart-grouped"
            height={250}
            series={[...multipleBarsData, { title: 'Threshold', type: 'threshold', y: 9 }]}
            xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
            yDomain={[0, 12]}
            xTitle="Food"
            yTitle="Consumption"
            xScaleType="categorical"
            ariaLabel="Grouped bar chart"
            ariaDescription={barChartInstructions}
          />
          <div>
            <input id="focus-target-2" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart-stacked"
              height={300}
              series={barTimeSeries}
              xDomain={barTimeData.map(({ x }) => new Date(x.getTime()))}
              yDomain={[0, 2000000]}
              xTitle="Time (UTC)"
              yTitle="Bytes transferred"
              xScaleType="categorical"
              stackedBars={true}
              ariaLabel="Multiple data series line chart"
              i18nStrings={{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }}
              ariaDescription={barChartInstructions}
            />
          </div>

          <BarChart
            {...commonProps}
            id="chart-horizontal"
            height={300}
            series={multipleBarsData}
            xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
            yDomain={[0, 8]}
            xTitle="Food"
            yTitle="Consumption"
            xScaleType="categorical"
            horizontalBars={true}
            ariaLabel="Horizontal bar chart"
            ariaDescription={barChartInstructions}
          />
          <div>
            <input id="focus-target-3" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart-title-wrapping"
              height={250}
              series={[
                { title: 'An extremely long series title causing wrapping in the popover', type: 'bar', data: data3 },
              ]}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart"
              ariaDescription={barChartInstructions}
            />
          </div>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
