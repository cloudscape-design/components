// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '../../../lib/components/internal/keycode';
import MixedLineBarChart from '../../../lib/components/mixed-line-bar-chart';
import { MixedLineBarChartWrapper } from '../../../lib/components/test-utils/dom';
import { barSeries, lineSeries3, thresholdSeries } from './common';

describe('Keyboard navigation', () => {
  test('opens popover for each series', () => {
    const { container } = render(
      <MixedLineBarChart
        height={250}
        xDomain={['Potatoes', 'Chocolate', 'Apples', 'Oranges']}
        yDomain={[0, 10]}
        xScaleType="categorical"
        series={[barSeries, lineSeries3, thresholdSeries]}
      />
    );

    const chart = new MixedLineBarChartWrapper(container);
    const application = chart.findApplication()!;

    const expectValues = (a: Array<number>) => {
      for (let i = 0; i < a.length; i++) {
        const value = a[i];
        expect(chart.findDetailPopover()!.findSeries()![i].findValue().getElement()).toHaveTextContent(
          value.toString()
        );
      }
    };

    const goToNextDataPoint = () => application.keydown(KeyCode.right);

    application.focus(); // Focusing the application opens the popover

    expectValues([77, 7, 8]);
    goToNextDataPoint();
    expectValues([546, 5, 8]);
    goToNextDataPoint();
    expectValues([52, 9, 8]);
    goToNextDataPoint();
    expectValues([47, 7, 8]);
  });
});
