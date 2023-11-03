// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import { MixedLineBarChartWrapper } from '../../../lib/components/test-utils/dom';

export const lineSeries1: MixedLineBarChartProps.DataSeries<number> = {
  type: 'line',
  title: 'Line Series 1',
  data: [
    { x: 0, y: 10 },
    { x: 1, y: 8 },
    { x: 2, y: 12 },
    { x: 3, y: 10 },
  ],
};

export const lineSeries2: MixedLineBarChartProps.DataSeries<number> = {
  type: 'line',
  title: 'Line Series 2',
  data: [
    { x: 0, y: 7 },
    { x: 1, y: 5 },
    { x: 2, y: 9 },
    { x: 3, y: 7 },
  ],
};

export const lineSeries3: MixedLineBarChartProps.DataSeries<string> = {
  type: 'line',
  title: 'Line Series 3',
  data: [
    { x: 'Potatoes', y: 7 },
    { x: 'Chocolate', y: 5 },
    { x: 'Apples', y: 9 },
    { x: 'Oranges', y: 7 },
  ],
};

export const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 8,
};

export const xThresholdSeries1: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'X-Threshold 1',
  x: 3,
};

export const xThresholdSeries2: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'X-Threshold 2',
  x: 10,
};

export const barSeries: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 1',
  data: [
    { x: 'Potatoes', y: 77 },
    { x: 'Chocolate', y: 546 },
    { x: 'Apples', y: 52 },
    { x: 'Oranges', y: 47 },
  ],
};

export const barSeries2: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 2',
  data: [
    { x: 'Potatoes', y: 10 },
    { x: 'Chocolate', y: 20 },
    { x: 'Oranges', y: 50 },
  ],
};

export const stackedDateBarSeries: Array<MixedLineBarChartProps.BarDataSeries<Date>> = [
  {
    title: 'Severe',
    type: 'bar',
    data: [
      { x: new Date(1601092800000), y: 12 },
      { x: new Date(1601100000000), y: 18 },
      { x: new Date(1601107200000), y: 15 },
      { x: new Date(1601114400000), y: 9 },
      { x: new Date(1601121600000), y: 18 },
    ],
  },
  {
    title: 'Moderate',
    type: 'bar',
    data: [
      { x: new Date(1601092800000), y: 8 },
      { x: new Date(1601100000000), y: 11 },
      { x: new Date(1601107200000), y: 12 },
      { x: new Date(1601114400000), y: 11 },
      { x: new Date(1601121600000), y: 13 },
    ],
  },
  {
    title: 'Low',
    type: 'bar',
    data: [
      { x: new Date(1601092800000), y: 7 },
      { x: new Date(1601100000000), y: 9 },
      { x: new Date(1601107200000), y: 8 },
      { x: new Date(1601114400000), y: 7 },
      { x: new Date(1601121600000), y: 5 },
    ],
  },
  {
    title: 'Unclassified',
    type: 'bar',
    data: [
      { x: new Date(1601092800000), y: 14 },
      { x: new Date(1601100000000), y: 8 },
      { x: new Date(1601107200000), y: 6 },
      { x: new Date(1601114400000), y: 4 },
      { x: new Date(1601121600000), y: 6 },
    ],
  },
];

export const barChartProps = {
  series: [barSeries, { ...barSeries2, type: 'line' }, thresholdSeries] as ReadonlyArray<
    MixedLineBarChartProps.ChartSeries<string>
  >,
  height: 250,
  xDomain: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
  yDomain: [0, 20],
  xScaleType: 'categorical' as const,
};

export function renderMixedChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: new MixedLineBarChartWrapper(container),
  };
}
