// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, Toggle } from '~components';
import PieChart, { PieChartProps } from '~components/pie-chart';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, data1, overlappingData, segmentDescription1 } from './common';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<PieChartProps>([
  {
    data: [[]],
    statusType: ['loading'],
    loadingText: ['Loading chart data...'],
  },
  {
    data: [[]],
    statusType: ['finished'],
    empty: [
      'No data',
      <Box textAlign="center" color="inherit">
        <b>No data</b>
        <Box variant="p" color="inherit">
          There is no data to display
        </Box>
      </Box>,
    ],
  },
  {
    data: [[]],
    statusType: ['error'],
    errorText: ['Error loading chart data.'],
    recoveryText: ['Retry'],
  },
  {
    data: [data1],
    variant: ['pie', 'donut'],
    size: ['small', 'medium', 'large'],
    statusType: ['finished'],
    innerMetricValue: ['180'],
    innerMetricDescription: ['surveys'],
  },
  {
    data: [overlappingData],
    variant: ['pie', 'donut'],
    size: ['small'],
    statusType: ['finished'],
    visibleSegments: [undefined, [overlappingData[0], overlappingData[1]]],
  },
  {
    data: [data1],
    variant: ['pie'],
    size: ['small'],
    statusType: ['finished'],
    legendTitle: ['Legend'],
  },
  {
    data: [data1],
    variant: ['pie'],
    size: ['small'],
    statusType: ['finished'],
    hideLegend: [false, true],
    hideTitles: [false, true],
    hideDescriptions: [false, true],
    hideFilter: [false, true],
  },
  {
    data: [data1],
    variant: ['donut'],
    size: ['medium'],
    statusType: ['finished'],
    innerMetricValue: ['Header'],
    innerMetricDescription: ['Description'],
  },
  {
    data: [data1],
    variant: ['pie'],
    size: ['small'],
    statusType: ['finished'],
    additionalFilters: [
      <Toggle checked={false} onChange={() => void 0}>
        Only below 75 calories
      </Toggle>,
    ],
    hideFilter: [false, true],
  },
  {
    data: [overlappingData],
    variant: ['pie'],
    size: ['medium'],
    statusType: ['finished'],
    segmentDescription: [datum => (datum.value === 2 ? 'Description' : '')],
    visibleSegments: [undefined, overlappingData.filter(datum => datum.title !== 'Product E')],
  },
  // Some overlapping labels, but not all need to be moved
  {
    data: [
      [
        { title: 'Item A', value: 40 },
        { title: 'Item B', value: 25 },
        { title: 'Item C', value: 20 },
        { title: 'Item D', value: 10 },
        { title: 'Item E', value: 5 },
      ],
    ],
    variant: ['pie'],
    size: ['small'],
    statusType: ['finished'],
    segmentDescription: [datum => `${datum.value} units`],
    visibleSegments: [undefined],
  },
]);

export default function PieChartPermutations() {
  return (
    <>
      <h1>Pie chart permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <PieChart
              i18nStrings={commonProps.i18nStrings}
              legendTitle="Legend"
              segmentDescription={segmentDescription1}
              ariaLabel="Permutation chart"
              onRecoveryClick={() => {}}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
