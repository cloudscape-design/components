// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import MixedLineBarChart, { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import { MixedLineBarChartWrapper } from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';
import testChartSeriesDetails from './test-chart-series-details';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

jest.mock('../../../lib/components/popover/utils/positions', () => ({
  ...jest.requireActual('../../../lib/components/popover/utils/positions'),
  calculatePosition: () => ({
    internalPosition: 'top-right',
    rect: { top: 100, left: 100, width: 200, height: 100 },
  }),
  getOffsetDimensions: () => ({ offsetWidth: 100, offsetHeight: 200 }),
}));

const barSeries: MixedLineBarChartProps.DataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 1',
  data: [
    { x: 'Group 1', y: 2 },
    { x: 'Group 2', y: 4 },
    { x: 'Group 3', y: 4 },
    { x: 'Group 4', y: 9 },
  ],
};

const lineSeries: MixedLineBarChartProps.DataSeries<string> = {
  type: 'line',
  title: 'Line Series 1',
  data: [
    { x: 'Group 1', y: 5 },
    { x: 'Group 2', y: 2 },
    { x: 'Group 3', y: 1 },
    { x: 'Group 4', y: 3 },
  ],
};

const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 6,
};

const series = [barSeries, lineSeries, thresholdSeries];

function renderChart(props: Omit<MixedLineBarChartProps<string>, 'series'>) {
  const { container } = render(<MixedLineBarChart {...props} series={series} />);
  return { wrapper: new MixedLineBarChartWrapper(container) };
}

testChartSeriesDetails({ renderChart });
