// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { describeEachAppLayout, renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';

describeEachAppLayout(() => {
  describe.each([true, false])('stickyNotifications=%s', stickyNotifications => {
    test('renders notifications slot', () => {
      const { wrapper } = renderComponent(<AppLayout stickyNotifications={stickyNotifications} notifications="abcd" />);
      const notificationsEl = wrapper.findNotifications()!.getElement();
      expect(notificationsEl).toHaveTextContent('abcd');
      expect(notificationsEl).not.toHaveAttribute('aria-live');
      expect(notificationsEl).toHaveAttribute('role', 'region');
      expect(notificationsEl).not.toHaveAttribute('aria-label');
    });

    test('notifications can have aria-label', () => {
      const { wrapper } = renderComponent(
        <AppLayout notifications="abcd" ariaLabels={{ notifications: 'Notifications' }} />
      );
      expect(wrapper.findNotifications()!.getElement()).toHaveAttribute('aria-label', 'Notifications');
    });
  });

  test('renders breadcrumbs slot', () => {
    const { wrapper } = renderComponent(<AppLayout breadcrumbs="abcd" />);
    expect(wrapper.findBreadcrumbs()!.getElement()).toHaveTextContent('abcd');
  });
});
