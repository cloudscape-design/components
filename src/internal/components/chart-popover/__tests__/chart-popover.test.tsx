// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import ChartPopover from '../../../../../lib/components/internal/components/chart-popover';

describe('accessibility', () => {
  test('has role="tooltip" on the root element if dismissButton is false', () => {
    const { container } = render(
      <ChartPopover
        trackRef={{ current: null }}
        container={null}
        onDismiss={() => {}}
        dismissButton={false}
        data-testid="chart-popover"
      >
        content
      </ChartPopover>
    );

    const popoverRoot = container.querySelector('[data-testid="chart-popover"]');
    expect(popoverRoot).toBeInTheDocument();
    expect(popoverRoot).toHaveAttribute('role', 'tooltip');
  });

  test('does not have role="tooltip" on the root element if dismissButton is true', () => {
    const { container } = render(
      <ChartPopover
        trackRef={{ current: null }}
        container={null}
        onDismiss={() => {}}
        dismissButton={true}
        data-testid="chart-popover"
      >
        content
      </ChartPopover>
    );

    const popoverRoot = container.querySelector('[data-testid="chart-popover"]');
    expect(popoverRoot).toBeInTheDocument();
    expect(popoverRoot).not.toHaveAttribute('role', 'tooltip');
  });
});

describe('click outside', () => {
  function TestComponent({ onDismiss }: { onDismiss: () => void }) {
    return (
      <div>
        <div id="outside">x</div>
        <div id="container">x</div>
        <ChartPopover
          trackRef={{ current: null }}
          container={document.querySelector('#container')}
          onDismiss={onDismiss}
        >
          <div id="content">x</div>
        </ChartPopover>
      </div>
    );
  }

  function nextFrame() {
    return act(async () => {
      await new Promise(resolve => requestAnimationFrame(resolve));
    });
  }

  // We render the component twice to ensure the container reference is set correctly.
  function renderPopover({ onDismiss }: { onDismiss: () => void }) {
    const { rerender } = render(<TestComponent onDismiss={onDismiss} />);
    rerender(<TestComponent onDismiss={onDismiss} />);
  }

  test('calls popover dismiss on outside click', () => {
    const onDismiss = jest.fn();
    renderPopover({ onDismiss });

    document.querySelector('#outside')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(onDismiss).toHaveBeenCalledWith(true);
  });

  test('does not call popover dismiss when clicked inside container', () => {
    const onDismiss = jest.fn();
    renderPopover({ onDismiss });

    document.querySelector('#container')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('does not call popover dismiss when clicked inside popover', () => {
    const onDismiss = jest.fn();
    renderPopover({ onDismiss });

    document.querySelector('#content')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  test('calls popover dismiss when clicked inside popover and then outside', async () => {
    const onDismiss = jest.fn();
    renderPopover({ onDismiss });

    document.querySelector('#content')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(onDismiss).not.toHaveBeenCalled();

    await nextFrame();

    document.querySelector('#outside')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(onDismiss).toHaveBeenCalledWith(true);
  });
});
