// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart from '~components/bar-chart';
import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import LineChart from '~components/line-chart';
import PieChart from '~components/pie-chart';

import { Section, SubSection } from './utils';

const formatLargeNumber = (value: number): string => {
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value.toFixed(2);
};

const formatDateTick = (date: Date): string =>
  date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })
    .split(',')
    .join('\n');

const emptyState = (
  <Box textAlign="center" color="inherit">
    <b>No data available</b>
    <Box variant="p" color="inherit">
      There is no data available
    </Box>
  </Box>
);

const noMatchState = (
  <Box textAlign="center" color="inherit">
    <b>No matching data</b>
    <Box variant="p" color="inherit">
      There is no matching data to display
    </Box>
    <Button>Clear filter</Button>
  </Box>
);

const barChartDates = [
  new Date(1601071200000),
  new Date(1601078400000),
  new Date(1601085600000),
  new Date(1601092800000),
  new Date(1601100000000),
];

const lineChartDomain: [Date, Date] = [new Date(1600984800000), new Date(1601013600000)];

const lineChartSite1 = [
  { x: new Date(1600984800000), y: 58020 },
  { x: new Date(1600988400000), y: 125021 },
  { x: new Date(1600992000000), y: 274021 },
  { x: new Date(1600995600000), y: 257306 },
  { x: new Date(1600999200000), y: 486039 },
  { x: new Date(1601002800000), y: 298028 },
  { x: new Date(1601006400000), y: 102839 },
  { x: new Date(1601010000000), y: 183570 },
  { x: new Date(1601013600000), y: 293910 },
];

const lineChartSite2 = [
  { x: new Date(1600984800000), y: 151023 },
  { x: new Date(1600988400000), y: 149130 },
  { x: new Date(1600992000000), y: 154091 },
  { x: new Date(1600995600000), y: 181635 },
  { x: new Date(1600999200000), y: 220516 },
  { x: new Date(1601002800000), y: 172331 },
  { x: new Date(1601006400000), y: 194091 },
  { x: new Date(1601010000000), y: 179130 },
  { x: new Date(1601013600000), y: 157299 },
];

export default function Charts() {
  return (
    <Section header="Charts" level="h2">
      <ColumnLayout columns={3}>
        <SubSection header="Stacked bar chart">
          <BarChart
            series={[
              { title: 'Severe', type: 'bar', data: barChartDates.map((x, i) => ({ x, y: [12, 18, 15, 9, 18][i] })) },
              { title: 'Moderate', type: 'bar', data: barChartDates.map((x, i) => ({ x, y: [8, 11, 12, 11, 13][i] })) },
              { title: 'Low', type: 'bar', data: barChartDates.map((x, i) => ({ x, y: [7, 9, 8, 7, 5][i] })) },
              {
                title: 'Unclassified',
                type: 'bar',
                data: barChartDates.map((x, i) => ({ x, y: [14, 8, 6, 4, 6][i] })),
              },
            ]}
            xDomain={barChartDates}
            yDomain={[0, 50]}
            i18nStrings={{ xTickFormatter: formatDateTick }}
            ariaLabel="Stacked bar chart"
            height={300}
            stackedBars={true}
            xTitle="Time (UTC)"
            yTitle="Error count"
            empty={emptyState}
            noMatch={noMatchState}
          />
        </SubSection>

        <SubSection header="Line chart">
          <LineChart
            series={[
              { title: 'Site 1', type: 'line', data: lineChartSite1, valueFormatter: formatLargeNumber },
              { title: 'Site 2', type: 'line', data: lineChartSite2, valueFormatter: formatLargeNumber },
              { title: 'Performance goal', type: 'threshold', y: 250000, valueFormatter: formatLargeNumber },
            ]}
            xDomain={lineChartDomain}
            yDomain={[0, 500000]}
            i18nStrings={{ xTickFormatter: formatDateTick, yTickFormatter: formatLargeNumber }}
            ariaLabel="Multiple data series line chart"
            height={300}
            xScaleType="time"
            xTitle="Time (UTC)"
            yTitle="Bytes transferred"
            empty={emptyState}
            noMatch={noMatchState}
          />
        </SubSection>

        <SubSection header="Pie chart">
          <PieChart
            data={[
              { title: 'Running', value: 60, lastUpdate: 'Dec 7, 2020' },
              { title: 'Failed', value: 30, lastUpdate: 'Dec 6, 2020' },
              { title: 'In-progress', value: 10, lastUpdate: 'Dec 6, 2020' },
              { title: 'Pending', value: 0, lastUpdate: 'Dec 7, 2020' },
            ]}
            detailPopoverContent={(datum, sum) => [
              { key: 'Resource count', value: datum.value },
              { key: 'Percentage', value: `${((datum.value / sum) * 100).toFixed(0)}%` },
              { key: 'Last update on', value: datum.lastUpdate },
            ]}
            segmentDescription={(datum, sum) => `${datum.value} units, ${((datum.value / sum) * 100).toFixed(0)}%`}
            ariaDescription="Pie chart showing resource states."
            ariaLabel="Pie chart"
            empty={emptyState}
            noMatch={noMatchState}
          />
        </SubSection>
      </ColumnLayout>
    </Section>
  );
}
