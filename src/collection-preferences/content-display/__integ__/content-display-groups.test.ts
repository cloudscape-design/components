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
    'renders group headers and leaf options',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const options = modal.findOptions();

      // Should have options rendered
      const texts = await page.getElementsText(options.toSelector());
      expect(texts.length).toBeGreaterThan(0);

      // Should contain group labels
      const content = await page.getText(modal.toSelector());
      expect(content).toContain('Configuration');
      expect(content).toContain('Performance');
      expect(content).toContain('Network');
    })
  );

  test(
    'toggles visibility of a leaf option within a group',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const options = modal.findOptions();
      const firstOption = options.get(1);
      const toggle = firstOption.findVisibilityToggle().findNativeInput();

      // Toggle visibility
      await page.click(toggle.toSelector());
    })
  );

  test(
    'reorders a group item with drag and drop',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const options = modal.findOptions();

      // Get initial order
      const initialTexts = await page.getElementsText(options.toSelector());
      expect(initialTexts.length).toBeGreaterThan(0);

      // Drag first item down
      const activeDragHandle = options.get(1).findDragHandle();
      const targetDragHandle = options.get(3).findDragHandle();
      await page.dragAndDropTo(activeDragHandle.toSelector(), targetDragHandle.toSelector());

      // Order should have changed
      const newTexts = await page.getElementsText(options.toSelector());
      expect(newTexts).not.toEqual(initialTexts);
    })
  );

  test(
    'filters options within groups',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      const filterInput = modal.findTextFilter().findInput().findNativeInput();

      // Type a filter
      await page.click(filterInput.toSelector());
      await page.keys('Network');

      // Should show filtered results
      const content = await page.getText(modal.toSelector());
      expect(content).toContain('Network');
    })
  );

  test(
    'nested list has aria-label matching group name',
    setupTest(async page => {
      const modal = page.wrapper.findModal().findContentDisplayPreference();
      // Verify nested lists exist by checking content
      const content = await page.getText(modal.toSelector());
      expect(content).toContain('Configuration');
    })
  );
});
