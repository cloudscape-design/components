// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import LineChart from '../../../lib/components/line-chart';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderLineChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: createWrapper(container.parentElement!).findLineChart()!,
  };
}

const lineSeries: MixedLineBarChartProps.LineDataSeries<number> = {
  type: 'line',
  title: 'Line Series 1',
  data: [
    { x: 0, y: 3 },
    { x: 1, y: 10 },
    { x: 2, y: 7 },
    { x: 3, y: 12 },
  ],
};

// Main rendering and testing is done in the MixedChart component. We just make sure that everything is passed down correctly.
describe('Line chart', () => {
  test('can render line series', () => {
    const { wrapper } = renderLineChart(<LineChart series={[lineSeries]} xDomain={[0, 20]} yDomain={[0, 10]} />);

    expect(wrapper.findSeries()).toHaveLength(1);
    expect(wrapper.findSeries()[0].getElement()).toHaveAttribute('aria-label', lineSeries.title);
  });
});
