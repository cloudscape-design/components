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
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const options = modal.findOptions();

      // findLabel() on group items returns the first nested child's label
      expect(await page.getOptionLabels(options, 6)).toEqual([
        'Instance ID',
        'Name',
        'Instance type',
        'CPU (%)',
        'Network in (MB/s)',
        'Monthly cost ($)',
      ]);

      // Drag Instance ID past Name
      const activeDragHandle = page.findDragHandle(0);
      const targetDragHandle = page.findDragHandle(1);
      await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

      expect(await page.getOptionLabels(options, 6)).toEqual([
        'Name',
        'Instance ID',
        'Instance type',
        'CPU (%)',
        'Network in (MB/s)',
        'Monthly cost ($)',
      ]);
    })
  );

  test(
    'reorders an individual item within a group with drag and drop',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const configGroup = modal.findOptions().get(3);
      const children = configGroup.findChildrenOptions()!;

      expect(await page.getOptionLabels(children, 3)).toEqual(['Instance type', 'Availability zone', 'State']);

      // Drag Instance type past Availability zone
      const activeDragHandle = children.get(1).findDragHandle();
      const targetDragHandle = children.get(2).findDragHandle();
      await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

      expect(await page.getOptionLabels(children, 3)).toEqual(['Availability zone', 'Instance type', 'State']);
    })
  );
});
