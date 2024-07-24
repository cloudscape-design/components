// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useState } from 'react';

import BarChart from '~components/bar-chart';
import Link from '~components/link';
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';

import rawCostsData from '../common/popover-drilldown-sample-data';
import { barChartInstructions, commonProps } from '../mixed-line-bar-chart/common';

export interface DrilldownChartProps {
  useLinks: 'keys' | 'values' | null;
  expandableSubItems: boolean;
  horizontalBars: boolean;
}

const costsData = rawCostsData.map(series => ({
  ...series,
  type: 'bar',
})) as MixedLineBarChartProps.BarDataSeries<string>[];

const xDomain = costsData[0].data.map(datum => datum.x);

const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const maxUngroupedSeries = 9;

const ungroupedSeries = costsData.slice(0, maxUngroupedSeries - 1);
const groupedSeries = costsData.slice(maxUngroupedSeries, costsData.length - 2);
const groupedSeriesData: MixedLineBarChartProps.Datum<string>[] = [];
for (const series of groupedSeries) {
  for (const { x, y } of series.data) {
    let data = groupedSeriesData.find(item => item.x === x);
    if (data) {
      data.y += y;
    } else {
      data = { x, y };
      groupedSeriesData.push(data);
    }
  }
}

const otherSeries: MixedLineBarChartProps.BarDataSeries<string> = {
  title: 'Others',
  type: 'bar',
  data: groupedSeriesData,
};

const allSeries: ReadonlyArray<MixedLineBarChartProps.BarDataSeries<string>> = [...ungroupedSeries, otherSeries];

export default function ({ horizontalBars, useLinks, expandableSubItems }: DrilldownChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<MixedLineBarChartProps.BarDataSeries<string>[] | null>(null);

  return (
    <>
      <BarChart
        {...commonProps}
        hideFilter={true}
        stackedBars={true}
        series={allSeries}
        xDomain={xDomain}
        xTitle="Time"
        yTitle="Costs"
        ariaLabel="Costs chart"
        ariaDescription={barChartInstructions}
        horizontalBars={horizontalBars}
        xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        onFilterChange={({ detail }) =>
          setVisibleSeries(detail.visibleSeries as MixedLineBarChartProps.BarDataSeries<string>[])
        }
        detailPopoverSeriesContent={({ series, x, y }) => {
          const isOtherSeries = series === otherSeries;
          const formattedValue = dollarFormatter(y);
          return {
            expandable: expandableSubItems && isOtherSeries,
            key:
              useLinks === 'keys' && !isOtherSeries ? (
                <Link external={true} href="#">
                  {series.title}
                </Link>
              ) : (
                series.title
              ),
            value:
              useLinks === 'values' ? (
                <Link external={true} ariaLabel={`${series.title}: ${formattedValue}`} href="#">
                  {formattedValue}
                </Link>
              ) : (
                formattedValue
              ),
            subItems: isOtherSeries
              ? (groupedSeries
                  .map(childSeries => {
                    const datum = childSeries.data.find(item => item.x === x);
                    if (datum) {
                      const formattedValue = dollarFormatter(datum.y);
                      return {
                        key:
                          useLinks === 'keys' ? (
                            <Link external={true} ariaLabel={`${series.title}: ${childSeries.title}`} href="#">
                              {childSeries.title}
                            </Link>
                          ) : (
                            childSeries.title
                          ),
                        value:
                          useLinks === 'values' ? (
                            <Link external={true} ariaLabel={`${childSeries.title}: ${formattedValue}`} href="#">
                              {formattedValue}
                            </Link>
                          ) : (
                            formattedValue
                          ),
                      };
                    }
                  })
                  .filter(Boolean) as ReadonlyArray<{ key: ReactNode; value: ReactNode }>)
              : undefined,
          };
        }}
        detailPopoverFooter={x => {
          if (visibleSeries && visibleSeries.length === 1) {
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
    </>
  );
}
