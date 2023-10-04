// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Toggle } from '~components';
import MixedLineBarChart, { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import { colorChartsThresholdNeutral, colorChartsStatusHigh } from '~design-tokens';
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
  data3,
  data4,
} from '../mixed-line-bar-chart/common';

const timeLatencyData = latencyData.map(({ time, p90 }) => ({ x: time, y: p90 }));

/* eslint-disable react/jsx-key */
const stringPermutations = createPermutations<MixedLineBarChartProps<string>>([
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
    xScaleType: ['categorical'],
    additionalFilters: [
      undefined,
      <Toggle checked={false} onChange={() => void 0}>
        Filter some series
      </Toggle>,
    ],
  },
  // Mixed line/bar charts
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Calories', type: 'bar', data: data3 },
        { title: 'Happiness', type: 'line', data: data4, color: colorChartsStatusHigh },
      ],
      [
        { title: 'Happiness', type: 'bar', data: data4 },
        { title: 'Calories', type: 'line', data: data3 },
      ],
      [
        { title: 'Calories', type: 'bar', data: data3 },
        { title: 'Happiness', type: 'line', data: data4, color: colorChartsStatusHigh },
        { title: 'Threshold 2', type: 'threshold', y: 133 },
      ],
    ],
    xScaleType: ['categorical'],
    xDomain: [undefined, data3.map(d => d.x)],
    yDomain: [undefined, [0, 700]],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
  // Baselines
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [150],
    series: [
      [
        { title: 'Calories', type: 'bar', data: data3 },
        { title: 'Happiness', type: 'line', data: data4, color: colorChartsThresholdNeutral },
        { title: 'Threshold 2', type: 'threshold', y: 133 },
      ],
    ],
    xScaleType: ['categorical'],
    yDomain: [
      [-500, 700],
      [0, 700],
      [200, 700],
    ],
    emphasizeBaselineAxis: [true, false],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const timePermutations = createPermutations<MixedLineBarChartProps<Date>>([
  // Date/time series
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Series 1', type: 'bar', data: timeLatencyData },
        { title: 'Series 2', type: 'line', data: timeLatencyData },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdNeutral },
      ],
    ],
    xScaleType: ['categorical'],
    yDomain: [[100, 300]],
    xTitle: ['Time'],
    yTitle: ['Latency (ms)'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const numberPermutations = createPermutations<MixedLineBarChartProps<number>>([
  // Categorical with numbers
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Series 1', type: 'bar', data: data2 },
        { title: 'Series 2', type: 'line', data: data1 },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdNeutral },
      ],
    ],
    xScaleType: ['categorical'],
    yDomain: [[0, 310]],
    xTitle: ['Food'],
    yTitle: ['Calories'],
    hideFilter: [true],
    hideLegend: [true],
  },
  // Logarithmic data
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Series 1', type: 'bar', data: logarithmicData },
        { title: 'Series 2', type: 'line', data: data2 },
      ],
      [
        { title: 'Series 1', type: 'bar', data: data2 },
        { title: 'Series 2', type: 'line', data: logarithmicData },
      ],
    ],
    yDomain: [[100, 1000000]],
    xTitle: ['X value'],
    yTitle: ['Y value'],
    xScaleType: ['categorical'],
    yScaleType: ['log'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

/* eslint-enable react/jsx-key */

const permutations = [...stringPermutations, ...timePermutations, ...numberPermutations];

export default function () {
  return (
    <>
      <h1>Mixed line/bar chart permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <MixedLineBarChart<any> onRecoveryClick={() => {}} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
