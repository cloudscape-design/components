// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BarChart, { BarChartProps } from '~components/bar-chart';

import { commonProps, multipleNegativeBarsDataWithThreshold } from '../mixed-line-bar-chart/common';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<BarChartProps<string>>([
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

export default function () {
  return (
    <>
      <h1>Bar chart permutations - thresholds</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <BarChart<any> {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
