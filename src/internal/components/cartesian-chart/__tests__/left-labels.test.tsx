// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import LeftLabels from '../../../../../lib/components/internal/components/cartesian-chart/left-labels';
import {
  getVisibleTicks,
  getSVGTextSize,
} from '../../../../../lib/components/internal/components/cartesian-chart/label-utils';
import { NumericChartScale } from '../../../../../lib/components/internal/components/cartesian-chart/scales';

jest.mock('../../../../../lib/components/internal/components/cartesian-chart/label-utils', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/components/cartesian-chart/label-utils'),
  getVisibleTicks: jest.fn().mockReturnValue([]),
  getSVGTextSize: jest.fn().mockReturnValue({ width: 0, height: 0 }),
}));

jest.mock('../../../../../lib/components/internal/components/responsive-text', () => ({
  __esModule: true,
  default: () => <text>...</text>,
}));

describe('cartesian chart left labels', () => {
  beforeEach(() => {
    jest.mocked(getVisibleTicks).mockClear();
    jest.mocked(getSVGTextSize).mockClear();
  });

  test('renders all ticks normally', () => {
    jest.mocked(getVisibleTicks).mockReturnValueOnce([
      { position: 0, lines: ['Tick 10'], space: 20 },
      { position: 10, lines: ['Tick 20'], space: 20 },
      { position: 20, lines: ['Tick 30'], space: 20 },
    ]);

    const { container } = render(
      <LeftLabels
        axis="x"
        plotWidth={500}
        plotHeight={300}
        maxLabelsWidth={250}
        scale={new NumericChartScale('linear', [10, 20, 30], [0, 30], null)}
        ticks={['Tick 10', 'Tick 20', 'Tick 30']}
        title="Left labels"
      />
    );

    expect(container.textContent).toBe('Tick 10Tick 20Tick 30');
  });

  test('truncates long labels', () => {
    jest.mocked(getVisibleTicks).mockReturnValueOnce([
      { position: 0, lines: ['Tick 10'], space: 20 },
      { position: 10, lines: ['Tick 20'], space: 20 },
      { position: 20, lines: ['Tick 30'], space: 20 },
    ]);

    jest
      .mocked(getSVGTextSize)
      .mockReturnValueOnce({ width: 200, height: 20 })
      .mockReturnValueOnce({ width: 260, height: 20 })
      .mockReturnValueOnce({ width: 250, height: 20 });

    const { container } = render(
      <LeftLabels
        axis="x"
        plotWidth={500}
        plotHeight={300}
        maxLabelsWidth={250}
        scale={new NumericChartScale('linear', [10, 20, 30], [0, 30], null)}
        ticks={['Tick 10', 'Tick 20', 'Tick 30']}
        title="Left labels"
      />
    );

    expect(container.textContent).toBe('Tick 10...Tick 30');
  });
});
