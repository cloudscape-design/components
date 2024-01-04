// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useContext, useState } from 'react';

import MixedLineBarChart, { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from './common';
import rawCostsData from '../common/popover-drilldown-sample-data';
import SpaceBetween from '~components/space-between';
import Link from '~components/link';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<
  AppContextType<{
    useLinks: 'keys' | 'values' | null;
    expandableSubItems: boolean;
  }>
>;

const maxUngroupedSeries = 2;
const group1Items = 2;

const xDomainSet = new Set<string>();
for (const series of rawCostsData) {
  for (const datum of series.data) {
    xDomainSet.add(datum.x);
  }
}

const xDomain = Array.from(xDomainSet).sort();

const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ungroupedSeries = rawCostsData
  .slice(0, maxUngroupedSeries)
  .map(series => ({ ...series, type: 'bar' })) as MixedLineBarChartProps.DataSeries<string>[];

const otherSeries1 = getGroupedSeries({
  ungroupedSeries: rawCostsData,
  from: maxUngroupedSeries,
  to: maxUngroupedSeries + group1Items,
  type: 'bar',
  title: 'Group 1',
});

const otherSeries2 = getGroupedSeries({
  ungroupedSeries: rawCostsData,
  from: maxUngroupedSeries + group1Items,
  type: 'line',
  title: 'Group 2',
});

const allSeries: ReadonlyArray<MixedLineBarChartProps.DataSeries<string>> = [
  ...ungroupedSeries,
  otherSeries1.groupedSeries,
  otherSeries2.groupedSeries,
];

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [visibleSeries, setVisibleSeries] = useState<MixedLineBarChartProps.DataSeries<string>[] | null>(null);

  return (
    <>
      {' '}
      <h1>Mixed chart drilldown</h1>
      <SpaceBetween direction="horizontal" size="xxl">
        <SpaceBetween direction="horizontal" size="s">
          <label>
            <input
              type="checkbox"
              checked={urlParams.expandableSubItems || false}
              onChange={event => setUrlParams({ expandableSubItems: event.target.checked })}
            />{' '}
            Expandable sub-items
          </label>
        </SpaceBetween>
        <SpaceBetween direction="horizontal" size="s">
          <label>
            <input
              type="radio"
              name="links"
              value="keys"
              onChange={() => setUrlParams({ useLinks: 'keys' })}
              checked={urlParams.useLinks === 'keys'}
            />{' '}
            Links in keys
          </label>
          <label>
            <input
              type="radio"
              name="links"
              value="values"
              onChange={() => setUrlParams({ useLinks: 'values' })}
              checked={urlParams.useLinks === 'values'}
            />{' '}
            Links in values
          </label>
          <label>
            <input
              type="radio"
              name="links"
              value="none"
              onChange={() => setUrlParams({ useLinks: undefined })}
              checked={!urlParams.useLinks}
            />{' '}
            No links
          </label>
        </SpaceBetween>
      </SpaceBetween>
      <ScreenshotArea>
        <MixedLineBarChart
          {...commonProps}
          hideFilter={true}
          stackedBars={true}
          series={allSeries}
          xDomain={xDomain}
          xTitle="Time"
          yTitle="Costs"
          ariaLabel="Costs chart"
          ariaDescription={barChartInstructions}
          xTickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          xScaleType="categorical"
          onFilterChange={({ detail }) =>
            setVisibleSeries(detail.visibleSeries as MixedLineBarChartProps.DataSeries<string>[])
          }
          detailPopoverSeriesContent={({ series, x, y }) => {
            const isGroupedSeries = series === otherSeries1.groupedSeries || series === otherSeries2.groupedSeries;
            const originalSeries =
              isGroupedSeries && series === otherSeries1.groupedSeries
                ? otherSeries1.originalSeries
                : otherSeries2.originalSeries;
            const formattedValue = dollarFormatter(y);
            return {
              expandable: urlParams.expandableSubItems && isGroupedSeries,
              key:
                urlParams.useLinks === 'keys' && !isGroupedSeries ? (
                  <Link external={true} href="#">
                    {series.title}
                  </Link>
                ) : (
                  series.title
                ),
              value:
                urlParams.useLinks === 'values' ? (
                  <Link external={true} ariaLabel={`${series.title}: ${formattedValue}`} href="#">
                    {formattedValue}
                  </Link>
                ) : (
                  formattedValue
                ),
              subItems: isGroupedSeries
                ? (originalSeries
                    .map(childSeries => {
                      const datum = childSeries.data.find(item => item.x === x);
                      if (datum) {
                        const formattedValue = dollarFormatter(datum.y);
                        return {
                          key:
                            urlParams.useLinks === 'keys' ? (
                              <Link external={true} ariaLabel={`${series.title}: ${childSeries.title}`} href="#">
                                {childSeries.title}
                              </Link>
                            ) : (
                              childSeries.title
                            ),
                          value:
                            urlParams.useLinks === 'values' ? (
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
      </ScreenshotArea>
    </>
  );
}

function getGroupedSeries({
  ungroupedSeries,
  from,
  to,
  title,
  type,
}: {
  ungroupedSeries: ReadonlyArray<Omit<MixedLineBarChartProps.DataSeries<string>, 'type'>>;
  from: number;
  to?: number;
  title: string;
  type: 'bar' | 'line';
}) {
  const seriesSlice = ungroupedSeries.slice(from, to);
  const groupedData: MixedLineBarChartProps.Datum<string>[] = [];
  for (const series of seriesSlice) {
    for (const { x, y } of series.data) {
      let data = groupedData.find(item => item.x === x);
      if (data) {
        data.y += y;
      } else {
        data = { x, y };
        groupedData.push(data);
      }
    }
  }
  return {
    originalSeries: seriesSlice.map(series => ({ ...series, type })),
    groupedSeries: { title, type, data: groupedData.sort((a, b) => (b.x < a.x ? -1 : 1)) },
  };
}
