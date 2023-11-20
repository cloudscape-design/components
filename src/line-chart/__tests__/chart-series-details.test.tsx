// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import LineChart, { LineChartProps } from '../../../lib/components/line-chart';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import { LineChartWrapper } from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';
import testChartSeriesDetails from '../../mixed-line-bar-chart/__tests__/test-chart-series-details';

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

const lineSeries: MixedLineBarChartProps.LineDataSeries<string> = {
  type: 'line',
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

const series = [lineSeries, thresholdSeries];

function renderLineChart(props: LineChartProps<string>) {
  const { container } = render(<LineChart {...props} series={series} />);
  return {
    wrapper: new LineChartWrapper(container),
  };
}

testChartSeriesDetails({ renderChart: renderLineChart });
