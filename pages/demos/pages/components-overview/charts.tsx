// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import LineChart from '@cloudscape-design/components/line-chart';
import PieChart from '@cloudscape-design/components/pie-chart';

import { Section, SubSection } from './utils';

const formatLargeNumber = (value: number): string => {
  if (Math.abs(value) >= 1e9) {
    return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'G';
  }
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
  { x: new Date(1600985700000), y: 102402 },
  { x: new Date(1600986600000), y: 104920 },
  { x: new Date(1600987500000), y: 94031 },
  { x: new Date(1600988400000), y: 125021 },
  { x: new Date(1600989300000), y: 159219 },
  { x: new Date(1600990200000), y: 193082 },
  { x: new Date(1600991100000), y: 162592 },
  { x: new Date(1600992000000), y: 274021 },
  { x: new Date(1600992900000), y: 264286 },
  { x: new Date(1600993800000), y: 289210 },
  { x: new Date(1600994700000), y: 256362 },
  { x: new Date(1600995600000), y: 257306 },
  { x: new Date(1600996500000), y: 186776 },
  { x: new Date(1600997400000), y: 294020 },
  { x: new Date(1600998300000), y: 385975 },
  { x: new Date(1600999200000), y: 486039 },
  { x: new Date(1601000100000), y: 490447 },
  { x: new Date(1601001000000), y: 361845 },
  { x: new Date(1601001900000), y: 339058 },
  { x: new Date(1601002800000), y: 298028 },
  { x: new Date(1601003700000), y: 231902 },
  { x: new Date(1601004600000), y: 224558 },
  { x: new Date(1601005500000), y: 253901 },
  { x: new Date(1601006400000), y: 102839 },
  { x: new Date(1601007300000), y: 234943 },
  { x: new Date(1601008200000), y: 204405 },
  { x: new Date(1601009100000), y: 190391 },
  { x: new Date(1601010000000), y: 183570 },
  { x: new Date(1601010900000), y: 162592 },
  { x: new Date(1601011800000), y: 148910 },
  { x: new Date(1601012700000), y: 229492 },
  { x: new Date(1601013600000), y: 293910 },
];

const lineChartSite2 = [
  { x: new Date(1600984800000), y: 151023 },
  { x: new Date(1600985700000), y: 169975 },
  { x: new Date(1600986600000), y: 176980 },
  { x: new Date(1600987500000), y: 168852 },
  { x: new Date(1600988400000), y: 149130 },
  { x: new Date(1600989300000), y: 147299 },
  { x: new Date(1600990200000), y: 169552 },
  { x: new Date(1600991100000), y: 163401 },
  { x: new Date(1600992000000), y: 154091 },
  { x: new Date(1600992900000), y: 199516 },
  { x: new Date(1600993800000), y: 195503 },
  { x: new Date(1600994700000), y: 189953 },
  { x: new Date(1600995600000), y: 181635 },
  { x: new Date(1600996500000), y: 192975 },
  { x: new Date(1600997400000), y: 205951 },
  { x: new Date(1600998300000), y: 218958 },
  { x: new Date(1600999200000), y: 220516 },
  { x: new Date(1601000100000), y: 213557 },
  { x: new Date(1601001000000), y: 165899 },
  { x: new Date(1601001900000), y: 173557 },
  { x: new Date(1601002800000), y: 172331 },
  { x: new Date(1601003700000), y: 186492 },
  { x: new Date(1601004600000), y: 131541 },
  { x: new Date(1601005500000), y: 142262 },
  { x: new Date(1601006400000), y: 194091 },
  { x: new Date(1601007300000), y: 185899 },
  { x: new Date(1601008200000), y: 173401 },
  { x: new Date(1601009100000), y: 171635 },
  { x: new Date(1601010000000), y: 179130 },
  { x: new Date(1601010900000), y: 185951 },
  { x: new Date(1601011800000), y: 144091 },
  { x: new Date(1601012700000), y: 152975 },
  { x: new Date(1601013600000), y: 157299 },
];

export default function Charts() {
  return (
    <Section header="Charts" level="h2">
      <>
        <ColumnLayout columns={3}>
          <SubSection header="Stacked bar chart">
            <BarChart
              series={[
                {
                  title: 'Severe',
                  type: 'bar',
                  data: barChartDates.map((x, i) => ({ x, y: [12, 18, 15, 9, 18][i] })),
                },
                {
                  title: 'Moderate',
                  type: 'bar',
                  data: barChartDates.map((x, i) => ({ x, y: [8, 11, 12, 11, 13][i] })),
                },
                {
                  title: 'Low',
                  type: 'bar',
                  data: barChartDates.map((x, i) => ({ x, y: [7, 9, 8, 7, 5][i] })),
                },
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
              ariaDescription="Pie chart showing how many resources are currently in which state."
              ariaLabel="Pie chart"
              empty={emptyState}
              noMatch={noMatchState}
            />
          </SubSection>
        </ColumnLayout>
      </>
    </Section>
  );
}
