// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Box from '~components/box';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';
import rawCostsData from './popover-drilldown-sample-data';
import { LineChart, MixedLineBarChartProps } from '~components';

interface LineDataSeries<T, Y> {
  type: 'line';
  title: string;
  data: MixedLineBarChartProps.Datum<T>[];
  valueFormatter?: MixedLineBarChartProps.ValueFormatter<Y, T>;
}
const costsDataSeries: LineDataSeries<string, number>[] = [];

const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

for (const { Groups, TimePeriod } of rawCostsData.ResultsByTime) {
  for (const group of Groups) {
    let series = costsDataSeries.find(({ title }) => title === group.Keys[0]);
    if (series) {
      series.data.push({ x: TimePeriod.Start, y: Number(group.Metrics.UnblendedCost.Amount) });
    } else {
      series = {
        title: group.Keys[0],
        type: 'line',
        data: [{ x: TimePeriod.Start, y: Number(group.Metrics.UnblendedCost.Amount) }],
        valueFormatter: dollarFormatter,
      };
      costsDataSeries.push(series);
    }
  }
}

const sortedCostsDataSeries = [...costsDataSeries].sort((series1, series2) => {
  const total1 = series1.data.reduce((acc, current) => acc + current.y, 0);
  const total2 = series2.data.reduce((acc, current) => acc + current.y, 0);
  return total2 - total1;
});

const maxSeries = 9;

const slicedSeries = sortedCostsDataSeries.slice(0, maxSeries - 1);
const otherSeries = sortedCostsDataSeries.slice(maxSeries, sortedCostsDataSeries.length - 2);
const otherData: MixedLineBarChartProps.Datum<string>[] = [];
for (const series of otherSeries) {
  for (const { x, y } of series.data) {
    let data = otherData.find(item => item.x === x);
    if (data) {
      data.y += y;
    } else {
      data = { x, y };
    }
    otherData.push(data);
  }
}

const allSeries: ReadonlyArray<LineDataSeries<string, number>> = [
  ...slicedSeries,
  { title: 'Others', type: 'line', valueFormatter: dollarFormatter, data: otherData },
];

export default function () {
  return (
    <ScreenshotArea>
      <h1>Chart popover explorations</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Costs line chart</Header>}>
          <LineChart
            {...commonProps}
            series={allSeries}
            xDomain={rawCostsData.ResultsByTime.map(({ TimePeriod }) => TimePeriod.Start)}
            xTitle="Time"
            yTitle="Costs"
            ariaLabel="Costs chart"
            xScaleType="categorical"
            ariaDescription={barChartInstructions}
            xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            detailPopoverSeriesContent={({ series, x, y }) => {
              return {
                expandable: true,
                key: series.title,
                value: dollarFormatter(y),
                details:
                  series.title === 'Others'
                    ? (otherSeries
                        .map(childSeries => {
                          const datum = childSeries.data.find(item => item.x === x);
                          if (datum && datum.y >= 0.005) {
                            return {
                              key: childSeries.title,
                              value: dollarFormatter(datum.y),
                            };
                          }
                        })
                        .filter(Boolean) as ReadonlyArray<{ key: ReactNode; value: ReactNode }>)
                    : undefined,
              };
            }}
          />
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
