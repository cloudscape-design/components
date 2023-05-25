// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from 'react-dom/test-utils';
import { describeEachAppLayout, drawersConfigurations, renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { KeyCode } from '../../../lib/components/internal/keycode';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

describeEachAppLayout(() => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(
      <AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />
    );
    expect(wrapper.findDrawersTriggers()!).toHaveLength(1);
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()!).toHaveLength(0);
  });
});

describe('Classic only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);
    (useMobile as jest.Mock).mockReturnValue(false);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
    (useMobile as jest.Mock).mockReset();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findDrawersSlider()!.getElement()).toHaveFocus();
  });

  test('should change size via keyboard events on slider handle', async () => {
    const drawersOpen = {
      drawers: {
        activeDrawerId: 'security',
        items: drawersConfigurations.drawersResizableItems,
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersOpen} />);
    act(() => wrapper.findDrawersSlider()!.keydown(KeyCode.left));
    await act(async () => {
      await requestAnimationFramePromise();
    });
    // Drawer grows after a left keydown (10px increments)
    expect(wrapper.findActiveDrawer()!.getElement().style.width).toBe('300px');
  });
});

function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}
