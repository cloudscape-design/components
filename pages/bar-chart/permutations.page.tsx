// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~components/bar-chart';
import { colorChartsThresholdNeutral, colorChartsThresholdInfo } from '~design-tokens';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import {
  data1,
  data2,
  commonProps,
  latencyData,
  dateTimeFormatter,
  multipleBarsData,
  multipleNegativeBarsData,
  negativeData,
  multipleNegativeBarsDataWithThreshold,
} from '../mixed-line-bar-chart/common';
import { smallBarsData } from './common';

const timeLatencyData = latencyData.map(({ time, p90 }) => ({ x: time, y: p90 }));

/* eslint-disable react/jsx-key */
const stringPermutations = createPermutations<BarChartProps<string>>([
  // Skipping things like empty states because these are already covered extensively for line and mixed charts

  // Multiple bars
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [multipleBarsData, [multipleBarsData[0], multipleBarsData[1]]],
    xScaleType: ['categorical'],
    xDomain: [undefined, ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [undefined, [0, 15]],
    horizontalBars: [true, false],
    stackedBars: [true, false],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
  // Stacked bars with mix of positive/negative numbers
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [multipleNegativeBarsData],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[-6, 10]],
    horizontalBars: [true, false],
    stackedBars: [true],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
]);

const timePermutations = createPermutations<BarChartProps<Date>>([
  // Date/time series
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Series 1', type: 'bar', data: timeLatencyData },
        { title: 'Series 2', type: 'bar', data: timeLatencyData },
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
  // Negative data
  {
    i18nStrings: [{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [[{ title: 'Series 1', type: 'bar', data: negativeData }]],
    xScaleType: ['categorical'],
    yDomain: [[-10000, 50000]],
    horizontalBars: [false, true],
    xTitle: ['X axis'],
    yTitle: ['Y axis'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const numberPermutations = createPermutations<BarChartProps<number>>([
  // Categorical with numbers
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [
      [
        { title: 'Series 1', type: 'bar', data: data2 },
        { title: 'Series 2', type: 'bar', data: data1 },
        { title: 'Threshold', type: 'threshold', y: 150, color: colorChartsThresholdInfo },
      ],
    ],
    xScaleType: ['categorical'],
    yDomain: [[0, 310]],
    xTitle: ['Food'],
    yTitle: ['Calories'],
    hideFilter: [true],
    hideLegend: [true],
  },
]);

const thresholdPermutations = createPermutations<BarChartProps<string>>([
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [multipleNegativeBarsDataWithThreshold],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[-6, 10]],
    horizontalBars: [true, false],
    stackedBars: [true, false],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
]);

const smallGroupsPermutations = createPermutations<BarChartProps<string>>([
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [smallBarsData],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[0, 1000]],
    horizontalBars: [true, false],
    stackedBars: [true],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
]);

/* eslint-enable react/jsx-key */

const permutations = [
  ...stringPermutations,
  ...timePermutations,
  ...numberPermutations,
  ...thresholdPermutations,
  ...smallGroupsPermutations,
];

export default function () {
  return (
    <>
      <h1>Bar chart permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <BarChart<any> {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
