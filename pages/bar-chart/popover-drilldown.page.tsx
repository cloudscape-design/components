// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Box from '~components/box';
import BarChart from '~components/bar-chart';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';
import rawCostsData from './popover-drilldown-sample-data';
import { MixedLineBarChartProps } from '~components';
import Link from '~components/link';

interface BarDataSeries<T, Y> {
  type: 'bar';
  title: string;
  data: MixedLineBarChartProps.Datum<T>[];
  valueFormatter?: MixedLineBarChartProps.ValueFormatter<Y, T>;
}
const costsDataSeries: BarDataSeries<string, number>[] = [];

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
        type: 'bar',
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
const groupedSeries = sortedCostsDataSeries.slice(maxSeries, sortedCostsDataSeries.length - 2);
const otherData: MixedLineBarChartProps.Datum<string>[] = [];
for (const series of groupedSeries) {
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

const otherSeries: BarDataSeries<string, number> = {
  title: 'Others',
  type: 'bar',
  valueFormatter: dollarFormatter,
  data: otherData,
};

const allSeries: ReadonlyArray<BarDataSeries<string, number>> = [...slicedSeries, otherSeries];

export default function () {
  return (
    <ScreenshotArea>
      <h1>Chart popover explorations</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Costs bar chart</Header>}>
          <BarChart
            {...commonProps}
            stackedBars={true}
            series={allSeries}
            xDomain={rawCostsData.ResultsByTime.map(({ TimePeriod }) => TimePeriod.Start)}
            xTitle="Time"
            yTitle="Costs"
            ariaLabel="Costs chart"
            ariaDescription={barChartInstructions}
            xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            detailPopoverSeriesContent={({ series, x, y }) => {
              const isOtherSeries = series === otherSeries;
              return {
                expandable: isOtherSeries,
                key: isOtherSeries ? (
                  series.title
                ) : (
                  <Link external={true} href="#">
                    {series.title}
                  </Link>
                ),
                value: dollarFormatter(y),
                details: isOtherSeries
                  ? (groupedSeries
                      .map(childSeries => {
                        const datum = childSeries.data.find(item => item.x === x);
                        if (datum) {
                          return {
                            key: (
                              <Link external={true} href="#">
                                {childSeries.title}
                              </Link>
                            ),
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
