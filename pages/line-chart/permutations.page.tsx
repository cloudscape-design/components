// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Toggle } from '~components';
import LineChart, { LineChartProps } from '~components/line-chart';
import {
  colorChartsThresholdNegative,
  colorChartsThresholdPositive,
  colorChartsThresholdNeutral,
  colorChartsThresholdInfo,
  colorChartsStatusHigh,
} from '~design-tokens';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import {
  data1,
  data2,
  commonProps,
  logarithmicData,
  latencyData,
  dateTimeFormatter,
  multipleBarsData,
  negativeData,
} from '../mixed-line-bar-chart/common';

const timeLatencyData = latencyData.map(({ time, p90 }) => ({ x: time, y: p90 }));
const multipleStringSeries = multipleBarsData.map(series => ({ ...series, type: 'line' as const }));
const negativeNumericData = negativeData.map(({ y }, x) => ({ y, x }));

/* eslint-disable react/jsx-key */
const numericPermutations = createPermutations<LineChartProps<number>>([
  // Loading state
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [50],
    series: [[]],
    statusType: ['loading'],
    hideFilter: [false, true],
    hideLegend: [false, true],
    loadingText: ['Loading chart data...'],
  },
  // Empty state
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [50],
    series: [[]],
    statusType: ['finished'],
    hideFilter: [false, true],
    hideLegend: [false, true],
    empty: [
      <Box textAlign="center" color="inherit">
        <b>No data</b>
        <Box variant="p" color="inherit">
          There is no data to display
        </Box>
      </Box>,
    ],
  },
  // No match state
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [50],
    series: [[{ title: 'Series 1', type: 'threshold', y: 10 }]],
    visibleSeries: [[]],
    statusType: ['finished'],
    hideFilter: [false, true],
    hideLegend: [false, true],
    empty: ['Empty'],
    noMatch: [
      <Box textAlign="center" color="inherit">
        <b>No matches</b>
        <Box variant="p" color="inherit">
          There is no data to display
        </Box>
      </Box>,
    ],
  },
  // Error state
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [50],
    series: [[]],
    statusType: ['error'],
    hideFilter: [false, true],
    hideLegend: [false, true],
    errorText: ['Error loading chart data.'],
    recoveryText: ['Retry'],
  },
  // Different UI configurations
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [80],
    series: [[{ title: 'Series 1', type: 'threshold', y: 7 }]],
    yDomain: [[0, 10]],
    statusType: ['finished'],
    empty: ['Empty'],
    noMatch: ['No match'],
    hideFilter: [false, true],
    hideLegend: [false, true],
    legendTitle: [undefined, 'Legend'],
    additionalFilters: [
      undefined,
      <Toggle checked={false} onChange={() => void 0}>
        Filter some series
      </Toggle>,
    ],
  },
  // Numeric series
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [{ title: 'Series 1', type: 'line', data: data1 }],
      [
        { title: 'Series 1', type: 'line', data: data1 },
        { title: 'Series 2', type: 'line', data: data2, color: colorChartsStatusHigh },
      ],
      [
        { title: 'Series 1', type: 'line', data: data1 },
        { title: 'Series 2', type: 'line', data: data2 },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdNegative },
      ],
      [
        { title: 'Threshold 1', type: 'threshold', y: 88, color: colorChartsThresholdPositive },
        { title: 'Series 1', type: 'line', data: data1, color: colorChartsStatusHigh },
        { title: 'Threshold 2', type: 'threshold', y: 133 },
      ],
    ],
    xDomain: [[0, 30]],
    yDomain: [[0, 310]],
    xTitle: ['Time'],
    yTitle: ['Latency (ms)'],
  },
  // Logarithmic data
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [[{ title: 'Series 1', type: 'line', data: logarithmicData }]],
    xDomain: [[1, 11]],
    yDomain: [undefined, [100, 1000000]],
    xTitle: ['X value'],
    yTitle: ['Y value'],
    xScaleType: ['linear', 'log'],
    yScaleType: ['linear', 'log'],
    hideFilter: [true],
    hideLegend: [true],
  },
  // Baselines
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [150],
    series: [[{ title: 'Negative series', type: 'line', data: negativeNumericData }]],
    xDomain: [[0, 4]],
    yDomain: [undefined, [-20000, 40000], [0, 40000], [10000, 40000]],
    emphasizeBaselineAxis: [true, false],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const timePermutations = createPermutations<LineChartProps<Date>>([
  // Date/time series
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [{ title: 'Series 1', type: 'line', data: timeLatencyData }],
      [
        { title: 'Series 1', type: 'line', data: timeLatencyData },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdInfo },
      ],
    ],
    xScaleType: ['time'],
    xDomain: [[latencyData[0].time, latencyData[latencyData.length - 1].time]],
    yDomain: [[100, 300]],
    xTitle: ['Time'],
    yTitle: ['Latency (ms)'],
    hideFilter: [true],
    hideLegend: [true],
  },
  // Categorical with dates
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [{ title: 'Series 1', type: 'line', data: timeLatencyData }],
      [
        { title: 'Series 1', type: 'line', data: timeLatencyData },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdNeutral },
      ],
    ],
    xScaleType: ['categorical'],
    xDomain: [
      [latencyData[0].time, latencyData[1].time, latencyData[10].time, latencyData[12].time, latencyData[16].time],
      [latencyData[20].time, latencyData[21].time, latencyData[22].time, latencyData[23].time],
    ],
    yDomain: [[100, 300]],
    xTitle: ['Time'],
    yTitle: ['Latency (ms)'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const stringPermutations = createPermutations<LineChartProps<string>>([
  // Categorical with strings
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: value => value }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [[multipleStringSeries[0]], [multipleStringSeries[2], { title: 'Threshold', type: 'threshold', y: 2 }]],
    xScaleType: ['categorical'],
    xDomain: [
      ['Apples', 'Chocolate', 'Oranges', 'Bananas'],
      ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
    ],
    yDomain: [[0, 8]],
    xTitle: ['Food'],
    yTitle: ['Calories'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const overflowPermutations = createPermutations<LineChartProps<Date>>([
  // With some values at the edges and some values overflowing the graph
  {
    i18nStrings: [
      {
        ...commonProps.i18nStrings,
        xTickFormatter: e =>
          e
            .toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: !1,
            })
            .split(',')
            .join('\n'),
        yTickFormatter: function l(e) {
          return Math.abs(e) >= 1e9
            ? (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
            : Math.abs(e) >= 1e6
              ? (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
              : Math.abs(e) >= 1e3
                ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                : e.toFixed(2);
        },
      },
    ],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        {
          title: 'Site 1',
          type: 'line',
          data: [
            { x: new Date(1601017200000), y: 58020 },
            { x: new Date(1601018100000), y: 102402 },
            { x: new Date(1601019000000), y: 500000 },
            { x: new Date(1601019900000), y: 500000 },
            { x: new Date(1601020800000), y: 500000 },
            { x: new Date(1601021700000), y: 264286 },
            { x: new Date(1601022600000), y: 0 },
            { x: new Date(1601023500000), y: 0 },
            { x: new Date(1601024400000), y: 289210 },
            { x: new Date(1601025300000), y: 600000 },
            { x: new Date(1601026200000), y: 294020 },
            { x: new Date(1601027100000), y: 385975 },
            { x: new Date(1601028000000), y: -100000 },
            { x: new Date(1601028900000), y: 490447 },
          ],
          valueFormatter: function l(e) {
            return Math.abs(e) >= 1e9
              ? (e / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
              : Math.abs(e) >= 1e6
                ? (e / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
                : Math.abs(e) >= 1e3
                  ? (e / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
                  : e.toFixed(2);
          },
        },
      ],
    ],
    xScaleType: ['time'],
    xDomain: [[new Date(1601017200000), new Date(1601028900000)]],
    yDomain: [[0, 500000]],
    xTitle: ['Time (UTC)'],
    yTitle: ['Bytes transferred'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

/* eslint-enable react/jsx-key */

const permutations = [...numericPermutations, ...timePermutations, ...stringPermutations, ...overflowPermutations];

export default function () {
  return (
    <>
      <h1>Line chart permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <LineChart<any> onRecoveryClick={() => {}} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
