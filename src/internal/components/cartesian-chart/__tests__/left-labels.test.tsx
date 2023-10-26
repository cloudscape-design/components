// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import LeftLabels from '../../../../../lib/components/internal/components/cartesian-chart/left-labels';
import { getVisibleTicks } from '../../../../../lib/components/internal/components/cartesian-chart/label-utils';
import { NumericChartScale } from '../../../../../lib/components/internal/components/cartesian-chart/scales';

jest.mock('../../../../../lib/components/internal/components/cartesian-chart/label-utils', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/components/cartesian-chart/label-utils'),
  getVisibleTicks: jest.fn().mockReturnValue([]),
}));

describe('cartesian chart left labels', () => {
  beforeEach(() => {
    (getVisibleTicks as any).mockClear();
  });

  test('all ticks are visible', () => {
    (getVisibleTicks as any as jest.Mock).mockReturnValueOnce([
      { position: 0, label: 'Tick 10', lines: ['Tick 10/'], space: 20 },
      { position: 10, label: 'Tick 20', lines: ['Tick 20/'], space: 20 },
      { position: 20, label: 'Tick 30', lines: ['Tick 30'], space: 20 },
    ]);

    const { container } = render(
      <LeftLabels
        axis="x"
        plotWidth={500}
        plotHeight={300}
        maxLabelsWidth={250}
        scale={new NumericChartScale('linear', [10, 20, 30], [0, 30], null)}
        ticks={[10, 20, 30]}
        title="Left labels"
      />
    );

    expect(container.textContent).toBe('Tick 10/Tick 20/Tick 30');
  });
});
