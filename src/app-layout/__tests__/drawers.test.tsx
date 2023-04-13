// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from 'react-dom/test-utils';
import { describeEachAppLayout, drawersConfigurations, renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';

describeEachAppLayout(() => {
  // test(`Moves focus to open button when closed`, () => {
  //   const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />);

  //   act(() => wrapper.findDrawersTriggers()!.click());
  //   act(() => wrapper.findActiveDrawerCloseButton()!.click());
  //   expect(wrapper.findDrawersTriggers()!.getElement()).toHaveFocus();
  // });

  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(
      <AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />
    );
    expect(wrapper.findDrawersTriggers()).toBeTruthy();
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toBeFalsy();
  });
});

describe('Classic only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers().click());
    expect(wrapper.findDrawersSlider()!.getElement()).toHaveFocus();
  });
});
