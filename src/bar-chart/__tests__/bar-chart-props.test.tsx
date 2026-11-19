// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import BarChart from '../../../lib/components/bar-chart';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import InternalMixedLineBarChart from '../../../lib/components/mixed-line-bar-chart/internal';

jest.mock('../../../lib/components/mixed-line-bar-chart/internal', () => {
  return jest.fn(() => null);
});

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

describe('Bar chart', () => {
  test('passes down default properties to mixed chart component', () => {
    render(<BarChart series={[]} />);
    expect(InternalMixedLineBarChart).toHaveBeenCalledWith(
      expect.objectContaining({
        detailPopoverSize: 'medium',
        emphasizeBaselineAxis: true,
        height: 500,
        series: [],
        statusType: 'finished',
        xScaleType: 'categorical',
        yScaleType: 'linear',
      }),
      {}
    );
  });

  test('passes all properties to the mixed chart component', () => {
    render(
      <BarChart
        series={[barSeries]}
        height={333}
        xDomain={['Group 1', 'Group 2', 'Group 3', 'Group 4']}
        yDomain={[0, 10]}
        xScaleType="categorical"
        yScaleType="log"
        xTitle="X title"
        yTitle="Y title"
        legendTitle="Legend"
        ariaLabel="Chart"
        ariaLabelledby="aria-id"
        detailPopoverSize="large"
        stackedBars={true}
        horizontalBars={true}
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
        series: [barSeries],
        xDomain: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
        xScaleType: 'categorical',
        yDomain: [0, 10],
        yScaleType: 'log',
        xTitle: 'X title',
        yTitle: 'Y title',
        legendTitle: 'Legend',
        ariaLabel: 'Chart',
        ariaLabelledby: 'aria-id',
        detailPopoverSize: 'large',
        stackedBars: true,
        horizontalBars: true,
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
