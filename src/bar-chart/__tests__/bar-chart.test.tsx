// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import BarChart from '../../../lib/components/bar-chart';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';

function renderBarChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: createWrapper(container.parentElement!).findBarChart()!,
  };
}

const barSeries1: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 1',
  data: [
    { x: 'Group 1', y: 2 },
    { x: 'Group 2', y: 4 },
    { x: 'Group 3', y: 4 },
    { x: 'Group 4', y: 9 },
  ],
};
const barSeries2: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 2',
  data: [
    { x: 'Group 1', y: -2 },
    { x: 'Group 2', y: 0 },
    { x: 'Group 3', y: 0 },
    { x: 'Group 4', y: 5 },
  ],
};
const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 5,
};

// Main rendering and testing is done in the MixedChart component. We just make sure that everything is passed down correctly.
describe('Bar chart', () => {
  test.each([{ stackedBars: false }, { stackedBars: true }])(
    'can render bar series with stackedBars=$stackedBars',
    ({ stackedBars }) => {
      const { wrapper } = renderBarChart(
        <BarChart
          series={[barSeries1, thresholdSeries, barSeries2]}
          stackedBars={stackedBars}
          xScaleType="categorical"
          xDomain={['Group 1', 'Group 2', 'Group 3', 'Group 4']}
          yDomain={[0, 10]}
        />
      );

      expect(wrapper.findSeries()).toHaveLength(3);
      expect(wrapper.findSeries()[0].getElement()).toHaveAttribute('aria-label', barSeries1.title);
      expect(wrapper.findSeries()[1].getElement()).toHaveAttribute('aria-label', thresholdSeries.title);
      expect(wrapper.findSeries()[2].getElement()).toHaveAttribute('aria-label', barSeries2.title);
    }
  );
});
