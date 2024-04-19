// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~components/bar-chart';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps } from '../mixed-line-bar-chart/common';
import { MixedLineBarChartProps } from '~components';
import { cloneDeep, range, shuffle } from 'lodash';

type BarSeries<T> = MixedLineBarChartProps.BarDataSeries<T> | MixedLineBarChartProps.ThresholdSeries;

const seriesAll = shuffle([
  { type: 'threshold', title: 'Limit', y: 4 } as BarSeries<string>,
  {
    title: 'John',
    type: 'bar',
    data: [
      { x: 'Apples', y: 5 },
      { x: 'Oranges', y: 3 },
      { x: 'Pears', y: 4 },
      { x: 'Grapes', y: 7 },
      { x: 'Bananas', y: 2 },
    ],
  } as BarSeries<string>,
  {
    title: 'Jane',
    type: 'bar',
    data: [
      { x: 'Apples', y: 2 },
      { x: 'Oranges', y: 2 },
      { x: 'Pears', y: 3 },
      { x: 'Grapes', y: 2 },
      { x: 'Bananas', y: 1 },
    ],
  } as BarSeries<string>,
  {
    title: 'Joe',
    type: 'bar',
    data: [
      { x: 'Apples', y: 3 },
      { x: 'Oranges', y: 4 },
      { x: 'Pears', y: 4 },
      { x: 'Grapes', y: 2 },
      { x: 'Bananas', y: 2 },
    ],
  } as BarSeries<string>,
  ...range(0, 10).map(
    index =>
      ({
        title: `${index + 1}`,
        type: 'bar',
        data: [
          { x: 'Apples', y: Math.random() * 2 - 1 },
          { x: 'Oranges', y: Math.random() * 2 - 1 },
          { x: 'Pears', y: Math.random() * 2 - 1 },
          { x: 'Grapes', y: Math.random() * 2 - 1 },
          { x: 'Bananas', y: Math.random() * 2 - 1 },
        ],
      } as BarSeries<string>)
  ),
]);

const seriesPositive = cloneDeep(seriesAll);
seriesPositive.forEach(series => {
  if (series.type === 'bar') {
    series.data.forEach(datum => {
      datum.y = Math.abs(datum.y);
    });
  }
});

/* eslint-disable react/jsx-key */
const permutations = createPermutations<BarChartProps<string>>([
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [seriesPositive],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[0, 18]],
    horizontalBars: [true, false],
    stackedBars: [true],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [seriesAll],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[-5, 18]],
    horizontalBars: [true, false],
    stackedBars: [true],
    xTitle: ['X Title'],
    yTitle: ['Y Title'],
  },
]);

export default function () {
  return (
    <>
      <h1>Stacked bar chart permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <BarChart<any> {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
