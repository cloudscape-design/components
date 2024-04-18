// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~components/bar-chart';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, multipleNegativeBarsDataWithThreshold } from '../mixed-line-bar-chart/common';

const data1 = multipleNegativeBarsDataWithThreshold;

// Position of the threshold series in a stacked chart must not affect chart's presentation.
const thresholdSeries = multipleNegativeBarsDataWithThreshold.find(s => s.type === 'threshold')!;
const data2 = multipleNegativeBarsDataWithThreshold.filter(s => s.type === 'bar');
data2.splice(Math.floor(Math.random() * data2.length), 0, thresholdSeries);

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
