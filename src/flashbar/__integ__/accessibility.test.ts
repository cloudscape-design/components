// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAXNode } from '../../__a11y__/utils';
import { setupTest } from './pages/interactive-page';

describe('Flashbar accessibility', () => {
  describe('Stacked notifications', () => {
    it(
      'has proper roles and descriptions when collapsed',
      setupTest(async page => {
        await page.toggleStackingFeature();

        const flashbar = await page.getAccessibilityTree('[data-testid="flashbar"]');
        const notificationsList = findAXNode(flashbar, node => node.role === 'list' && node.name === 'Notifications');
        const toggleButton = findAXNode(
          flashbar,
          node => node.role === 'button' && node.name === 'View all notifications'
        );

        // aria-describedby is translated into a proper string
        expect(notificationsList!.description).toBe(
          'Notifications Error 1 Warning 0 Success 1 Information 3 In progress 0'
        );
        expect(toggleButton!.description).toBe('Notifications Error 1 Warning 0 Success 1 Information 3 In progress 0');

        // Information about aria-expanded
        expect(toggleButton?.expanded).toBeFalsy();
      })
    );

    it(
      'has proper roles and descriptions when expanded',
      setupTest(async page => {
        await page.toggleStackingFeature();

        // Expand all notifications
        await page.keys(new Array(8).fill('Tab'));
        await page.keys('Space');

        const flashbar = await page.getAccessibilityTree('[data-testid="flashbar"]');
        const notificationsList = findAXNode(flashbar, node => node.role === 'list' && node.name === 'Notifications');

        expect(notificationsList?.children).toHaveLength(5);

        // Information about focused nodes is available as well
        const focusedNode = findAXNode(flashbar, node => !!node.focused);

        // Accessible name is calculated based on the node contents
        expect(focusedNode!.name).toBe('Info Has Header Content This is a flash item with key 4');
      })
    );
  });
});
