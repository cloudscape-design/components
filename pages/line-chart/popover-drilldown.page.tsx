// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useContext, useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import LineChart from '~components/line-chart';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, barChartInstructions } from '../mixed-line-bar-chart/common';
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import rawCostsData from '../common/popover-drilldown-sample-data';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<
  AppContextType<{
    useLinks: 'keys' | 'values' | null;
    expandableSubItems: boolean;
  }>
>;

const costsData = rawCostsData.map(series => ({
  ...series,
  type: 'line',
})) as MixedLineBarChartProps.LineDataSeries<string>[];

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

const otherSeries: MixedLineBarChartProps.LineDataSeries<string> = {
  title: 'Others',
  type: 'line',
  valueFormatter: dollarFormatter,
  data: groupedSeriesData,
};

const allSeries: ReadonlyArray<MixedLineBarChartProps.LineDataSeries<string>> = [...ungroupedSeries, otherSeries];

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [highlightedSeries, setHighlightedSeries] = useState<MixedLineBarChartProps.LineDataSeries<string> | null>(
    null
  );
  const [visibleSeries, setVisibleSeries] = useState<MixedLineBarChartProps.LineDataSeries<string>[] | null>(null);

  return (
    <ScreenshotArea>
      <h1>Chart popover drilldown</h1>

      <Container
        header={
          <Header
            variant="h2"
            actions={
              <SpaceBetween direction="horizontal" size="xxl">
                <label>
                  <input
                    type="checkbox"
                    checked={urlParams.expandableSubItems || false}
                    onChange={event => setUrlParams({ expandableSubItems: event.target.checked })}
                  />{' '}
                  Expandable sub-items
                </label>
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
            }
          >
            Line chart
          </Header>
        }
      >
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
            const formattedValue = dollarFormatter(y);
            return {
              expandable: urlParams.expandableSubItems && isOtherSeries,
              key:
                urlParams.useLinks === 'keys' && !isOtherSeries ? (
                  <Link external={true} href="#">
                    {series.title}
                  </Link>
                ) : (
                  series.title
                ),
              value:
                urlParams.useLinks === 'values' ? (
                  <Link external={true} ariaLabel={`${series.title}: ${formattedValue}`}>
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
                            urlParams.useLinks === 'keys' ? (
                              <Link external={true} ariaLabel={`${series.title}: ${childSeries.title}`} href="#">
                                {childSeries.title}
                              </Link>
                            ) : (
                              childSeries.title
                            ),
                          value:
                            urlParams.useLinks === 'values' ? (
                              <Link external={true} ariaLabel={`${childSeries.title}: ${formattedValue}`}>
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
      </Container>
    </ScreenshotArea>
  );
}
