// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import LineChart from '../../../lib/components/line-chart';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import InternalMixedLineBarChart from '../../../lib/components/mixed-line-bar-chart/internal';

jest.mock('../../../lib/components/mixed-line-bar-chart/internal', () => {
  return jest.fn(() => null);
});

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

describe('Line chart', () => {
  test('passes down default properties to mixed chart component', () => {
    render(<LineChart series={[]} />);
    expect(InternalMixedLineBarChart).toHaveBeenCalledWith(
      expect.objectContaining({
        detailPopoverSize: 'medium',
        emphasizeBaselineAxis: true,
        height: 500,
        series: [],
        statusType: 'finished',
        xScaleType: 'linear',
        yScaleType: 'linear',
      }),
      {}
    );
  });

  test('passes all properties to the mixed chart component', () => {
    render(
      <LineChart
        series={[lineSeries]}
        height={333}
        xDomain={[0, 20]}
        yDomain={[0, 10]}
        xScaleType="categorical"
        yScaleType="log"
        xTitle="X title"
        yTitle="Y title"
        legendTitle="Legend"
        ariaLabel="Chart"
        ariaLabelledby="aria-id"
        detailPopoverSize="large"
        hideLegend={true}
        hideFilter={true}
        additionalFilters="filters"
        statusType="finished"
        loadingText="loading"
        errorText="error"
        recoveryText="recovery"
      />
    );
    expect(InternalMixedLineBarChart).toHaveBeenCalledWith(
      expect.objectContaining({
        emphasizeBaselineAxis: true,
        height: 333,
        series: [lineSeries],
        xDomain: [0, 20],
        xScaleType: 'categorical',
        yDomain: [0, 10],
        yScaleType: 'log',
        xTitle: 'X title',
        yTitle: 'Y title',
        legendTitle: 'Legend',
        ariaLabel: 'Chart',
        ariaLabelledby: 'aria-id',
        detailPopoverSize: 'large',
        hideLegend: true,
        hideFilter: true,
        additionalFilters: 'filters',
        statusType: 'finished',
        loadingText: 'loading',
        errorText: 'error',
        recoveryText: 'recovery',
      }),
      {}
    );
  });
});
