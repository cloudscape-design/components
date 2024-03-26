// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';

import Box from '~components/box';
import Button from '~components/button';

type BarSeries<T> = MixedLineBarChartProps.BarDataSeries<T> | MixedLineBarChartProps.ThresholdSeries;
type LineSeries<T> = MixedLineBarChartProps.LineDataSeries<T> | MixedLineBarChartProps.ThresholdSeries;
type MixedSeries<T> = BarSeries<T> | LineSeries<T>;

function withThreshold<T, S extends BarSeries<T> | LineSeries<T> | MixedSeries<T>>(
  series: S[],
  title: string,
  value: number
): S[] {
  const threshold: MixedLineBarChartProps.ThresholdSeries = { type: 'threshold', title, y: value };
  return [...series, threshold as any];
}

export const numberFormatter = (value: number): string => {
  if (Math.abs(value) >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return '' + value;
};

export const dateTimeFormatter = (date: Date) =>
  date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
    .replace(', ', ',\n');

export const lineChartInstructions =
  'Use up/down arrow keys to navigate between series, and left/right arrow keys to navigate within a series.';

export const barChartInstructions = 'Use left/right arrow keys to navigate between data groups.';

export const commonProps = {
  loadingText: 'Loading chart data...',
  errorText: 'Error loading chart data.',
  recoveryText: 'Retry',
  empty: (
    <Box textAlign="center" color="inherit">
      <b>No data</b>
      <Box variant="p" color="inherit">
        There is no data to display
      </Box>
    </Box>
  ),
  noMatch: (
    <Box textAlign="center" color="inherit">
      <b>No matching data</b>
      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        There is no data to display
      </Box>
      <Button>Clear filter</Button>
    </Box>
  ),
  i18nStrings: {
    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    filterSelectedAriaLabel: '(selected)',
    detailPopoverDismissAriaLabel: 'Dismiss',

    yTickFormatter: numberFormatter,

    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'mixed chart',
    xAxisAriaRoleDescription: 'x axis',
    yAxisAriaRoleDescription: 'y axis',
  },
} as const;

export const latencyData = [
  { time: new Date('2020/06/14 13:00 PDT'), p50: 30.900842101210984, p90: 203.04975569665118 },
  { time: new Date('2020/06/14 14:00 PDT'), p50: 30.806913255493544, p90: 221.5319473792054 },
  { time: new Date('2020/06/14 15:00 PDT'), p50: 30.67364554010133, p90: 203.38726547841011 },
  { time: new Date('2020/06/14 16:00 PDT'), p50: 30.840023199811988, p90: 215.03343577362222 },
  { time: new Date('2020/06/14 17:00 PDT'), p50: 31.281572768385722, p90: 221.6097963627112 },
  { time: new Date('2020/06/14 18:00 PDT'), p50: 31.33438620696768, p90: 239.64459222193125 },
  { time: new Date('2020/06/14 19:00 PDT'), p50: 31.21089476194283, p90: 231.8846796008602 },
  { time: new Date('2020/06/14 20:00 PDT'), p50: 30.540987905161238, p90: 232.64160647370326 },
  { time: new Date('2020/06/14 21:00 PDT'), p50: 30.196245236746595, p90: 230.4540132377279 },
  { time: new Date('2020/06/14 22:00 PDT'), p50: 30.025196631721023, p90: 234.37711375344995 },
  { time: new Date('2020/06/14 23:00 PDT'), p50: 30.200708247638264, p90: 254.66375058988982 },
  { time: new Date('2020/06/15 00:00 PDT'), p50: 29.923785332561636, p90: 258.31938193666366 },
  { time: new Date('2020/06/15 01:00 PDT'), p50: 29.947736620958512, p90: 267.41261453195165 },
  { time: new Date('2020/06/15 02:00 PDT'), p50: 30.30702887486527, p90: 274.50030549554685 },
  { time: new Date('2020/06/15 03:00 PDT'), p50: 30.122046479916794, p90: 269.2692821485401 },
  { time: new Date('2020/06/15 04:00 PDT'), p50: 30.33491686164723, p90: 265.13392180531304 },
  { time: new Date('2020/06/15 05:00 PDT'), p50: 31.349869720646808, p90: 281.33240992338204 },
  { time: new Date('2020/06/15 06:00 PDT'), p50: 31.824038830491347, p90: 282.6117365304653 },
  { time: new Date('2020/06/15 07:00 PDT'), p50: 32.01198315513287, p90: 279.0321636824558 },
  { time: new Date('2020/06/15 08:00 PDT'), p50: 32.17521748657055, p90: 283.21408099707395 },
  { time: new Date('2020/06/15 09:00 PDT'), p50: 32.32986207002094, p90: 280.79366641229484 },
  { time: new Date('2020/06/15 10:00 PDT'), p50: 32.26599833770275, p90: 275.9987999376288 },
  { time: new Date('2020/06/15 11:00 PDT'), p50: 32.471157833766526, p90: 279.9444421427136 },
  { time: new Date('2020/06/15 12:00 PDT'), p50: 32.58660574014751, p90: 275.15144951288465 },
  { time: new Date('2020/06/15 13:00 PDT'), p50: 32.45526308763972, p90: 270.3001332671992 },
  { time: new Date('2020/06/15 14:00 PDT'), p50: 32.35753056083145, p90: 277.9773662353918 },
  { time: new Date('2020/06/15 15:00 PDT'), p50: 31.689663803627802, p90: 259.1703378752082 },
  { time: new Date('2020/06/15 16:00 PDT'), p50: 31.374820794796012, p90: 262.03109127502296 },
  { time: new Date('2020/06/15 17:00 PDT'), p50: 31.53317967202597, p90: 258.0051915074543 },
  { time: new Date('2020/06/15 18:00 PDT'), p50: 31.531269223836222, p90: 260.37445748756755 },
  { time: new Date('2020/06/15 19:00 PDT'), p50: 31.388097454526914, p90: 261.9397256881929 },
  { time: new Date('2020/06/15 20:00 PDT'), p50: 31.03654653814296, p90: 252.8073100176461 },
];

export const data1 = latencyData.slice(0, 50).map((d, i) => ({ x: i, y: d.p50 }));
export const data2 = latencyData.slice(0, 50).map((d, i) => ({ x: i, y: d.p90 }));

export const data3 = [
  { x: 'Potatoes', y: 77 },
  { x: 'Chocolate', y: 546 },
  { x: 'Apples', y: 52 },
  { x: 'Oranges', y: 47 },
];

export const data4 = [
  { x: 'Potatoes', y: 300 },
  { x: 'Apples', y: 100 },
  { x: 'Chocolate', y: 280 },
  { x: 'Oranges', y: 180 },
];

export const data5 = [
  { x: 'Apples', y: 100 },
  { x: 'Oranges', y: 180 },
  { x: 'Potatoes', y: 300 },
  { x: 'Chocolate', y: 280 },
];

export const data6: { x: number; y: number }[] = [];

for (let i = 0; i < 120; i++) {
  data6.push({ x: i, y: Math.abs(((i - 75) * 1.5 * ((i % 6) + 1)) / 3 + 3) });
}

export const logarithmicData = [
  { x: 1, y: 300 },
  { x: 2, y: 20040 },
  { x: 3, y: 60000 },
  { x: 4, y: 1000 },
  { x: 5, y: 600030 },
  { x: 6, y: 300 },
  { x: 7, y: 20040 },
  { x: 8, y: 60000 },
  { x: 9, y: 1000 },
];

export const negativeData = [
  { x: new Date(1601071200000), y: 34503 },
  { x: new Date(1601078400000), y: 25832 },
  { x: new Date(1601085600000), y: 4012 },
  { x: new Date(1601092800000), y: -5602 },
  { x: new Date(1601100000000), y: 17839 },
];

export const multipleBarsData = [
  {
    title: 'John',
    type: 'bar' as const,
    data: [
      { x: 'Apples', y: 5 },
      { x: 'Oranges', y: 3 },
      { x: 'Pears', y: 4 },
      { x: 'Grapes', y: 7 },
      { x: 'Bananas', y: 2 },
    ],
  },
  {
    title: 'Jane',
    type: 'bar' as const,
    data: [
      { x: 'Apples', y: 2 },
      { x: 'Oranges', y: 2 },
      { x: 'Pears', y: 3 },
      { x: 'Grapes', y: 2 },
      { x: 'Bananas', y: 1 },
    ],
  },
  {
    title: 'Joe',
    type: 'bar' as const,
    data: [
      { x: 'Apples', y: 3 },
      { x: 'Oranges', y: 4 },
      { x: 'Pears', y: 4 },
      { x: 'Grapes', y: 2 },
      { x: 'Bananas', y: 2 },
    ],
  },
];

export const multipleBarsDataWithThreshold = withThreshold(multipleBarsData, 'Limit', 4);

export const multipleNegativeBarsData: BarSeries<string>[] = multipleBarsData.map(series => ({
  ...series,
  data: series.data.map(({ x, y }) => ({ x, y: series.title === 'Jane' || y === 3 ? -y : y })),
}));

export const multipleNegativeBarsDataWithThreshold = withThreshold(multipleNegativeBarsData, 'Limit', 4);

export const barTimeData = [
  {
    x: new Date(2020, 8, 26, 0),
    site1: 470319,
    site2: 452301,
    site3: 301030,
    site4: 91394,
    site5: 102032,
    site6: 45029,
  },
  {
    x: new Date(2020, 8, 26, 2),
    site1: 374991,
    site2: 432909,
    site3: 352920,
    site4: 56012,
    site5: 84201,
    site6: 99291,
  },
  {
    x: new Date(2020, 8, 26, 4),
    site1: 430357,
    site2: 463349,
    site3: 368204,
    site4: 156204,
    site5: 173002,
    site6: 90325,
  },
  {
    x: new Date(2020, 8, 26, 6),
    site1: 440773,
    site2: 470328,
    site3: 358290,
    site4: 98349,
    site5: 103283,
    site6: 23940,
  },
  {
    x: new Date(2020, 8, 26, 8),
    site1: 464442,
    site2: 485630,
    site3: 210720,
    site4: 99249,
    site5: 95382,
    site6: 59321,
  },
];

export const barTimeSeries = [
  {
    title: 'Site 1',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site1 }) => ({ x, y: site1 })),
  },
  {
    title: 'Site 2',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site2 }) => ({ x, y: site2 })),
  },
  {
    title: 'Site 3',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site3 }) => ({ x, y: site3 })),
  },
  {
    title: 'Site 4',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site4 }) => ({ x, y: site4 })),
  },
  {
    title: 'Site 5',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site5 }) => ({ x, y: site5 })),
  },
  {
    title: 'Site 6',
    type: 'bar' as const,
    data: barTimeData.map(({ x, site6 }) => ({ x, y: site6 })),
  },
];
