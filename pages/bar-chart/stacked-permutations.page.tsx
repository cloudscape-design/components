// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~components/bar-chart';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, multipleNegativeBarsData as data } from '../mixed-line-bar-chart/common';

const thresholdSeries = { type: 'threshold', title: 'Limit', y: 4 } as const;

const data1 = [...data, thresholdSeries];
// Position of the threshold series in a stacked chart must not affect chart's plot.
const data2 = [data[0], thresholdSeries, data[1], data[2]];

/* eslint-disable react/jsx-key */
const permutations = createPermutations<BarChartProps<string>>([
  {
    i18nStrings: [commonProps.i18nStrings],
    ariaLabel: ['Test chart'],
    height: [200],
    series: [data1, data2],
    xScaleType: ['categorical'],
    xDomain: [['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']],
    yDomain: [[-6, 10]],
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
