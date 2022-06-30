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

const barSeries: MixedLineBarChartProps.BarDataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 1',
  data: [
    { x: 'Group 1', y: 2 },
    { x: 'Group 2', y: 4 },
    { x: 'Group 3', y: 4 },
    { x: 'Group 4', y: 9 },
  ],
};

// Main rendering and testing is done in the MixedChart component. We just make sure that everything is passed down correctly.
describe('Bar chart', () => {
  test('can render bar series', () => {
    const { wrapper } = renderBarChart(
      <BarChart
        series={[barSeries]}
        xScaleType="categorical"
        xDomain={['Group 1', 'Group 2', 'Group 3', 'Group 4']}
        yDomain={[0, 10]}
      />
    );

    expect(wrapper.findSeries()).toHaveLength(1);
    expect(wrapper.findSeries()[0].getElement()).toHaveAttribute('aria-label', barSeries.title);
  });
});
