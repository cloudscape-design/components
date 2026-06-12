// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Split panel',
  componentName: 'split-panel',
  tests: [
    {
      description: 'position bottom',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Open panel');
      },
    },
    {
      description: 'position bottom - closed',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
    },
    {
      description: 'position side',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Open panel');
        await page.click('aria/Preferences');
        await page.click('aria/Side');
        await page.click('aria/Confirm');
      },
    },
    {
      description: 'position side with tools open',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Open panel');
        await page.click('aria/Preferences');
        await page.click('aria/Side');
        await page.click('aria/Confirm');
        await page.waitForVisible('aria/Open tools');
        await page.click('aria/Open tools');
      },
    },
    {
      description: 'position side - closed',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Open panel');
        await page.click('[aria-label="Preferences"]');
        await page.click('aria/Side');
        await page.click('aria/Confirm');
        await page.click('aria/Close panel');
      },
    },
    {
      description: 'preferences open',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Open panel');
        await page.click('aria/Preferences');
      },
    },
    {
      description: 'popover in bottom panel',
      path: 'app-layout/with-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page, wrapper }) => {
        await page.click('aria/Open panel');
        await page.click(wrapper.findSplitPanel().findOpenPanelBottom().findPopover().findTrigger().toSelector());
        await (page as any).scrollIntoView('[data-testid="scroll-me"]');
      },
    },
    {
      description: 'headerBefore, info link, actions and description',
      path: 'app-layout/split-panel-with-custom-header',
      screenshotType: 'screenshotArea',
      queryParams: { renderActionsButtonDropdown: 'true', renderBeforeBadge: 'true', renderInfoLink: 'true' },
    },
    {
      description: 'Entire layout defined in headerBefore slot',
      path: 'app-layout/split-panel-with-custom-header',
      screenshotType: 'screenshotArea',
      queryParams: { renderActionsButtonDropdown: 'true', renderBeforeButtons: 'true' },
    },
  ],
};

export default suite;
