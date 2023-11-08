// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';
import rawCostsData from '../common/popover-drilldown-sample-data';
import AreaChart, { AreaChartProps } from '~components/area-chart';
import Link from '~components/link';

interface AreaDataSeries {
  type: 'area';
  title: string;
  data: AreaChartProps.Datum<string>[];
  valueFormatter?: AreaChartProps.ValueFormatter<number, string>;
}
const costsDataSeries: AreaDataSeries[] = [];

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
        type: 'area',
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
const otherData: AreaChartProps.Datum<string>[] = [];
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

const otherSeries: AreaDataSeries = {
  title: 'Others',
  type: 'area',
  valueFormatter: dollarFormatter,
  data: otherData,
};

const allSeries: ReadonlyArray<AreaDataSeries> = [...slicedSeries, otherSeries];

function Chart({ expandableSubItems }: { expandableSubItems: boolean }) {
  return (
    <AreaChart
      {...commonProps}
      series={allSeries}
      xDomain={rawCostsData.ResultsByTime.map(({ TimePeriod }) => TimePeriod.Start)}
      xTitle="Time"
      yTitle="Costs"
      ariaLabel="Costs chart"
      xScaleType="categorical"
      ariaDescription={barChartInstructions}
      xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      yTickFormatter={dollarFormatter}
      detailPopoverSeriesContent={({ series, x, y }) => {
        const isOtherSeries = series === otherSeries;
        return isOtherSeries
          ? {
              expandable: expandableSubItems,
              key: series.title,
              value: dollarFormatter(y),
              subItems: groupedSeries
                .map(childSeries => {
                  const datum = childSeries.data.find(item => item.x === x);
                  if (datum) {
                    return {
                      key: (
                        <Link external={true} ariaLabel={`${series.title}: ${childSeries.title}`} href="#">
                          {childSeries.title}
                        </Link>
                      ),
                      value: dollarFormatter(datum.y),
                    };
                  }
                })
                .filter(Boolean) as ReadonlyArray<{ key: ReactNode; value: ReactNode }>,
            }
          : {
              key: (
                <Link external={true} href="#">
                  {series.title}
                </Link>
              ),
              value: dollarFormatter(y),
            };
      }}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea>
      <h1>Chart popover explorations</h1>
      <SpaceBetween direction="vertical" size="l">
        <Container header={<Header variant="h2">Area chart with expandable sub-items</Header>}>
          <Chart expandableSubItems={true} />
        </Container>
        <Container header={<Header variant="h2">Area chart with non-expandable sub-items</Header>}>
          <Chart expandableSubItems={false} />
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
