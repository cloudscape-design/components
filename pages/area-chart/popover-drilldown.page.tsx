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

const costsData = rawCostsData.map(series => ({
  ...series,
  type: 'area',
})) as AreaChartProps.AreaSeries<string>[];

const xDomain = costsData[0].data.map(datum => datum.x);

const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const maxSeries = 9;

const slicedSeries = costsData.slice(0, maxSeries - 1);
const groupedSeries = costsData.slice(maxSeries, costsData.length - 2);
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

const otherSeries: AreaChartProps.AreaSeries<string> = {
  title: 'Others',
  type: 'area',
  valueFormatter: dollarFormatter,
  data: otherData,
};

const allSeries: ReadonlyArray<AreaChartProps.AreaSeries<string>> = [...slicedSeries, otherSeries];

function Chart({ expandableSubItems }: { expandableSubItems: boolean }) {
  return (
    <AreaChart
      {...commonProps}
      series={allSeries}
      xDomain={xDomain}
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
