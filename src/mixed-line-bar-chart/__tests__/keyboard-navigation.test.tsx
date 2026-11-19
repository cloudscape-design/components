// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { createWrapper } from '@cloudscape-design/test-utils-core/dom';

import { KeyCode } from '../../../lib/components/internal/keycode';
import MixedLineBarChart from '../../../lib/components/mixed-line-bar-chart';
import { barSeries, lineSeries3, thresholdSeries } from './common';

describe('Keyboard navigation', () => {
  function getChart() {
    return createWrapper().findMixedLineBarChart()!;
  }
  function expectValues(a: Array<number>) {
    for (let i = 0; i < a.length; i++) {
      const value = a[i];
      expect(getChart().findDetailPopover()!.findSeries()![i].findValue().getElement()).toHaveTextContent(
        value.toString()
      );
    }
  }
  function focusApplication() {
    getChart().findApplication()!.focus();
  }
  function goToNextDataPoint() {
    getChart().findApplication()!.keydown(KeyCode.right);
  }

  test('opens popover for each series (mixed)', () => {
    render(
      <MixedLineBarChart
        height={250}
        xDomain={['Potatoes', 'Chocolate', 'Apples', 'Oranges']}
        yDomain={[0, 10]}
        xScaleType="categorical"
        series={[barSeries, lineSeries3, thresholdSeries]}
      />
    );
    focusApplication(); // Focusing the application opens the popover
    expectValues([77, 7, 8]);
    goToNextDataPoint();
    expectValues([546, 5, 8]);
    goToNextDataPoint();
    expectValues([52, 9, 8]);
    goToNextDataPoint();
    expectValues([47, 7, 8]);
  });

  test('opens popover for each series (line)', () => {
    render(
      <MixedLineBarChart
        height={250}
        xDomain={['Potatoes', 'Chocolate', 'Apples', 'Oranges']}
        yDomain={[0, 10]}
        xScaleType="categorical"
        series={[lineSeries3]}
      />
    );
    focusApplication(); // Focusing the application opens the popover
    expectValues([7]);
    goToNextDataPoint();
    expectValues([5]);
    goToNextDataPoint();
    expectValues([9]);
    goToNextDataPoint();
    expectValues([7]);
  });
});
