// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const focusTargetSelector = '#focus-target';

const expandableSectionWrapper = createWrapper().findExpandableSection();
const headerButtonSelector = expandableSectionWrapper.findHeader().find('[role="button"]').toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/expandable-section/test');
    await page.waitForVisible(expandableSectionWrapper.toSelector());
    await testFn(page);
  });
};

describe('Expandable Section', () => {
  test(
    'keeps focus on header button after expanding/collapsing',
    setupTest(async page => {
      await page.click(focusTargetSelector);

      // Open expandable section
      await page.keys(['Tab', 'Space']);
      await expect(page.isExisting(expandableSectionWrapper.findExpandedContent().toSelector())).resolves.toBe(true);
      await expect(page.isFocused(headerButtonSelector)).resolves.toBe(true);

      // Close expandable section
      await page.keys(['Space']);
      await expect(page.isExisting(expandableSectionWrapper.findExpandedContent().toSelector())).resolves.toBe(false);
      await expect(page.isFocused(headerButtonSelector)).resolves.toBe(true);
    })
  );
});
