// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../lib/components/test-utils/selectors';
import ContentDisplayPageObject from './pages/content-display-page';

const windowDimensions = {
  width: 1200,
  height: 1200,
};

const setupTest = (testFn: (page: ContentDisplayPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new ContentDisplayPageObject(browser);
    await browser.url('#/light/collection-preferences/content-display-groups');
    await page.setWindowSize(windowDimensions);
    page.wrapper = createWrapper().findCollectionPreferences();
    await page.openCollectionPreferencesModal();
    await testFn(page);
  });
};

describe('Collection preferences - Grouped Content Display', () => {
  test(
    'reorders a top-level item with drag and drop',
    setupTest(async page => {
      // Initial top-level order: Instance ID, Name, Configuration (group), Performance (group), Network (group), Monthly cost ($)
      await page.containsOptionsInOrder(['Instance ID', 'Name', 'Configuration', 'Performance', 'Network']);

      // Drag first item (Instance ID) past the second (Name)
      const activeDragHandle = page.findDragHandle(0);
      const targetDragHandle = page.findDragHandle(1);
      await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

      // Instance ID should now be after Name
      await page.containsOptionsInOrder(['Name', 'Instance ID', 'Configuration', 'Performance', 'Network']);
    })
  );

  test(
    'reorders an individual item within a group with drag and drop',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();

      // Configuration group is at top-level index 3 (1-based). Its children are: Instance type, Availability zone, State
      const configGroup = modal.findOptions().get(3);
      const children = configGroup.findChildrenOptions()!;

      // Verify initial order within the group
      const firstChildLabel = children.get(1).findLabel();
      const secondChildLabel = children.get(2).findLabel();
      expect(await page.getText(firstChildLabel.toSelector())).toBe('Instance type');
      expect(await page.getText(secondChildLabel.toSelector())).toBe('Availability zone');

      // Drag first child (Instance type) past second child (Availability zone)
      const activeDragHandle = children.get(1).findDragHandle();
      const targetDragHandle = children.get(2).findDragHandle();
      await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

      // Verify: Availability zone should now be first, Instance type second
      expect(await page.getText(firstChildLabel.toSelector())).toBe('Availability zone');
      expect(await page.getText(secondChildLabel.toSelector())).toBe('Instance type');
    })
  );
});
