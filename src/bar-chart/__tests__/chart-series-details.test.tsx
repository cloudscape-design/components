// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import BarChart, { BarChartProps } from '../../../lib/components/bar-chart';
import { BarChartWrapper } from '../../../lib/components/test-utils/dom';
import testChartSeriesDetails from '../../mixed-line-bar-chart/__tests__/test-chart-series-details';
import { render } from '@testing-library/react';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

jest.mock('../../../lib/components/popover/utils/positions', () => ({
  ...jest.requireActual('../../../lib/components/popover/utils/positions'),
  calculatePosition: () => ({
    internalPosition: 'top-right',
    boundingOffset: { top: 100, left: 100, width: 200, height: 100 },
  }),
  getOffsetDimensions: () => ({ offsetWidth: 100, offsetHeight: 200 }),
}));

const barSeries: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Line Series 1',
  data: [
    { x: 'Group 1', y: 2 },
    { x: 'Group 2', y: 4 },
    { x: 'Group 3', y: 4 },
    { x: 'Group 4', y: 9 },
  ],
};

const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 6,
};

const series = [barSeries, thresholdSeries];

function renderBarChart(props: BarChartProps<string>) {
  const { container } = render(<BarChart {...props} series={series} />);
  return {
    wrapper: new BarChartWrapper(container),
  };
}

testChartSeriesDetails({ renderChart: renderBarChart });
