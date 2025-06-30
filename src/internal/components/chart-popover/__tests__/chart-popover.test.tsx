// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render, fireEvent } from '@testing-library/react';
import ChartPopover from '../../../../../lib/components/internal/components/chart-popover';
import React from 'react';

describe('ChartPopover', () => {
  it('dismisses the popover when mouse leaves to another chart', () => {
    const handleDismiss1 = jest.fn();
    const handleDismiss2 = jest.fn();

    const containerElement1 = document.createElement('div');
    const containerElement2 = document.createElement('div');

    const renderResult = render(
      <>
        <ChartPopover
          data-testid="chart-popover"
          size="medium"
          dismissButton={false}
          onDismiss={handleDismiss1}
          trackRef={React.createRef()}
          container={containerElement1}
        />
        <ChartPopover
          data-testid="chart-popover"
          size="medium"
          dismissButton={false}
          onDismiss={handleDismiss2}
          trackRef={React.createRef()}
          container={containerElement2}
        />
      </>
    );

    const [chart1, chart2] = renderResult.getAllByTestId('chart-popover');

    // Simulate mouse leaving chart1 and entering chart2
    fireEvent.mouseLeave(chart1, { relatedTarget: chart2 });
    fireEvent.mouseEnter(chart2);

    expect(handleDismiss1).toHaveBeenCalled();
    expect(handleDismiss2).not.toHaveBeenCalled();
  });
});
