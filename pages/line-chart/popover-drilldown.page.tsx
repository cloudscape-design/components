// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import LineChart from '~components/line-chart';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import rawCostsData from '../common/popover-drilldown-sample-data';

interface LineDataSeries {
  type: 'line';
  title: string;
  data: MixedLineBarChartProps.Datum<string>[];
  valueFormatter?: MixedLineBarChartProps.ValueFormatter<number, string>;
}
const costsDataSeries: LineDataSeries[] = [];

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

const otherSeries: LineDataSeries = {
  title: 'Others',
  type: 'line',
  valueFormatter: dollarFormatter,
  data: otherData,
};

const allSeries: ReadonlyArray<LineDataSeries> = [...slicedSeries, otherSeries];

function Chart({ expandableSubItems }: { expandableSubItems: boolean }) {
  const [highlightedSeries, setHighlightedSeries] = useState<LineDataSeries | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<LineDataSeries[] | null>(null);
  return (
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
      onHighlightChange={({ detail }) => setHighlightedSeries(detail.highlightedSeries as LineDataSeries)}
      onFilterChange={({ detail }) => setVisibleSeries(detail.visibleSeries as LineDataSeries[])}
      detailPopoverSeriesContent={({ series, x, y }) => {
        const isOtherSeries = series === otherSeries;
        return {
          expandable: expandableSubItems && isOtherSeries,
          key: isOtherSeries ? (
            series.title
          ) : (
            <Link external={true} href="#">
              {series.title}
            </Link>
          ),
          value: dollarFormatter(y),
          subItems: isOtherSeries
            ? (groupedSeries
                .map(childSeries => {
                  const datum = childSeries.data.find(item => item.x === x);
                  if (datum && datum.y >= 0.005) {
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
      detailPopoverFooter={x => {
        if (highlightedSeries || (visibleSeries && visibleSeries.length === 1)) {
          return null;
        }
        const sum = (visibleSeries || allSeries).reduce((previousValue, currentSeries) => {
          const datum = currentSeries.data.find(item => item.x === x);
          if (datum) {
            return previousValue + datum.y;
          }
          return previousValue;
        }, 0);
        return (
          <>
            <hr />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Total</span>
              <span>{dollarFormatter(sum)}</span>
            </div>
          </>
        );
      }}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea>
      <h1>Chart popover explorations</h1>
      <SpaceBetween direction="vertical" size="l">
        <Container header={<Header variant="h2">Line chart with expandable sub-items</Header>}>
          <Chart expandableSubItems={true} />
        </Container>
        <Container header={<Header variant="h2">Line chart with non-expandable sub-items</Header>}>
          <Chart expandableSubItems={false} />
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
