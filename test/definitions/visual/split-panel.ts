// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const headerText = 'Relatively long header text that might wrap into multiple rows';
const description =
  'Relatively long description text that might wrap into multiple rows if the split panel is narrow enough';

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
      // bigger width to avoid forced bottom position
      configuration: { width: 1400 },
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
        const openPopoverButton = wrapper
          .findSplitPanel()
          .findOpenPanelBottom()
          .findPopover()
          .findTrigger()
          .toSelector();
        await page.click('aria/Open panel');
        await page.click(openPopoverButton);
        await page.scrollIntoView('[data-testid="scroll-me"]');
      },
    },
    {
      description: 'custom elements in header',
      tests: [
        { position: 'bottom', open: 'true' },
        { position: 'bottom', open: 'false' },
        { position: 'side', open: 'true' },
      ].map<TestSuite>(({ position, open }) => {
        const tests: TestDefinition[] = [
          {
            description: 'headerBefore, info link, actions and description',
            path: 'app-layout/split-panel-with-custom-header',
            screenshotType: 'viewport',
            queryParams: {
              headerText,
              description,
              renderActionsButtonDropdown: 'true',
              renderBeforeBadge: 'true',
              renderInfoLink: 'true',
              splitPanelOpen: open,
              splitPanelPosition: position,
            },
            setup: async ({ page }) => {
              // Have the page content already scrolled when taking the screenshot to prevent
              // scrolling when taking the screenshot. Otherwise, it is assumed that the element
              // appears at certain offset, but this is not true for the split panel as it has
              // fixed position.
              await page.windowScrollTo({ top: 800 });
            },
          },
          {
            description: 'Entire layout defined in headerBefore slot',
            path: 'app-layout/split-panel-with-custom-header',
            screenshotType: 'viewport',
            queryParams: {
              headerText,
              description,
              renderActionsButtonDropdown: 'true',
              renderBeforeButtons: 'true',
              splitPanelOpen: open,
              splitPanelPosition: position,
            },
            setup: async ({ page }) => {
              await page.windowScrollTo({ top: 800 });
            },
          },
        ];
        return { description: `position: ${position}, open: ${open}`, tests };
      }),
    },
  ],
};

export default suite;
