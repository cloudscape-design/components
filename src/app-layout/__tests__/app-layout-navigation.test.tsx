// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { describeEachAppLayout, renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';

import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop', 'mobile'] }, ({ size }) => {
  test('a does not hide content when navigationOpen and navigationHide is true and onNavigationChange is overwritten', () => {
    const mockOnNavigationChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        navigationOpen={true}
        navigationHide={true}
        navigation={<>Mock Navigation</>}
        onNavigationChange={mockOnNavigationChange}
        content={<>Content</>}
      />
    );

    expect(mockOnNavigationChange).toHaveBeenCalledTimes(size === 'mobile' ? 1 : 0);
    expect(wrapper).not.toBeNull();
    expect(wrapper.findNavigation()).toBeFalsy();
    expect(wrapper.findNavigationToggle()).toBeFalsy();
    expect(wrapper.findByClassName(visualRefreshToolbarStyles['main-landmark'])).not.toBeNull();
    expect(wrapper.findByClassName(visualRefreshToolbarStyles['unfocusable-mobile'])).toBeNull();
    expect(wrapper.findByClassName(visualRefreshToolbarStyles.content)?.getElement()).toBeVisible();
  });

  test('hide navigation trigger when navigationTriggerHide is set to true', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        {...{ navigationTriggerHide: true }}
        navigationOpen={true}
        navigation={<>Mock Navigation</>}
        content={<>Content</>}
      />
    );

    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findNavigationToggle()).toBeFalsy();
  });
});
