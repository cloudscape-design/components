// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { describeEachAppLayout, renderComponent } from './utils';

import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  test('a resize to mobile does not hide content when navigationOpen and navigationHide is true and onNavigationChange is overwritten', async () => {
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

    expect(mockOnNavigationChange).toHaveBeenCalledTimes(0);
    expect(wrapper).not.toBeNull();
    expect(wrapper.findNavigation()).toBeFalsy();
    expect(wrapper.findNavigationToggle()).toBeFalsy();

    await waitFor(() => {
      const contentWrapper = wrapper.findByClassName(visualRefreshToolbarStyles.content);
      expect(contentWrapper?.getElement()).toBeVisible();

      (useMobile as jest.Mock).mockReturnValue(true);
      expect(mockOnNavigationChange).toHaveBeenCalledTimes(1);
      expect(wrapper.findNavigation()).toBeFalsy();
      expect(wrapper.findNavigationToggle()).toBeFalsy();
      expect(contentWrapper?.getElement()).toBeVisible();
    });
  });
});
