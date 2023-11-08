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

const costsData = rawCostsData.map(series => ({
  ...series,
  type: 'line',
})) as MixedLineBarChartProps.LineDataSeries<string>[];

const xDomain = costsData[0].data.map(datum => datum.x);

const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const maxSeries = 9;

const slicedSeries = costsData.slice(0, maxSeries - 1);
const groupedSeries = costsData.slice(maxSeries, costsData.length - 2);
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

const otherSeries: MixedLineBarChartProps.LineDataSeries<string> = {
  title: 'Others',
  type: 'line',
  valueFormatter: dollarFormatter,
  data: otherData,
};

const allSeries: ReadonlyArray<MixedLineBarChartProps.LineDataSeries<string>> = [...slicedSeries, otherSeries];

function Chart({ expandableSubItems }: { expandableSubItems: boolean }) {
  const [highlightedSeries, setHighlightedSeries] = useState<MixedLineBarChartProps.LineDataSeries<string> | null>(
    null
  );
  const [visibleSeries, setVisibleSeries] = useState<MixedLineBarChartProps.LineDataSeries<string>[] | null>(null);
  return (
    <LineChart
      {...commonProps}
      series={allSeries}
      xDomain={xDomain}
      xTitle="Time"
      yTitle="Costs"
      ariaLabel="Costs chart"
      xScaleType="categorical"
      ariaDescription={barChartInstructions}
      xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      onHighlightChange={({ detail }) =>
        setHighlightedSeries(detail.highlightedSeries as MixedLineBarChartProps.LineDataSeries<string>)
      }
      onFilterChange={({ detail }) =>
        setVisibleSeries(detail.visibleSeries as MixedLineBarChartProps.LineDataSeries<string>[])
      }
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
                        <Link external={true} ariaLabel={`${series.title}: ${childSeries.title}`} href="#">
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
