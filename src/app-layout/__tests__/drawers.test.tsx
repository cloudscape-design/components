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
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
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

  test('should change drawers size in controlled mode', () => {
    const onResize = jest.fn();

    const drawersSize300 = {
      drawers: {
        onResize: onResize,
        items: [
          {
            ariaLabels: {
              closeButton: 'Security close button',
              content: 'Security drawer content',
              triggerButton: 'Security trigger button',
              resizeHandle: 'Security resize handle',
            },
            content: <span>Security</span>,
            resizable: true,
            size: 300,
            id: 'security',
            trigger: {
              iconName: 'security',
            },
          },
        ],
      },
    };

    const drawersSize310 = {
      drawers: {
        onResize: (event: any) => onResize(event.detail),
        items: [
          {
            ariaLabels: {
              closeButton: 'Security close button',
              content: 'Security drawer content',
              triggerButton: 'Security trigger button',
              resizeHandle: 'Security resize handle',
            },
            content: <span>Security</span>,
            resizable: true,
            size: 310,
            id: 'security',
            trigger: {
              iconName: 'security',
            },
          },
        ],
      },
    };

    const { wrapper, rerender } = renderComponent(<AppLayout contentType="form" {...drawersSize300} />);
    act(() => wrapper.findDrawersTriggers()![0].click());
    act(() => wrapper.findDrawersSlider()!.keydown(KeyCode.left));
    expect(getComputedStyle(wrapper.findActiveDrawer()!.getElement()).width).toBe('300px');

    rerender(<AppLayout contentType="form" {...drawersSize310} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(getComputedStyle(wrapper.findActiveDrawer()!.getElement()).width).toBe('310px');
  });

  test('should change size in uncontrolled mode', () => {
    const drawersOpen = {
      drawers: {
        activeDrawerId: 'security',
        items: drawersConfigurations.drawersResizableItems,
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersOpen} />);
    act(() => wrapper.findDrawersSlider()!.keydown(KeyCode.left));
    expect(getComputedStyle(wrapper.findActiveDrawer()!.getElement()).width).toBe('290px');
  });
});
