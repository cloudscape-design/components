// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Popover',
  componentName: 'popover',
  tests: [
    {
      description: 'text wrapping',
      path: 'popover/text-wrap',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'alignment inside text',
      path: 'popover/text-align',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'inside modal',
      path: 'popover/scenario-in-modal',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('aria/Show modal');
        await page.click('#popover button');
      },
    },
    {
      description: 'positioning with navigation v1.0',
      path: 'popover/nav-v1-0-positioning',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#popover button');
      },
    },
    {
      description: 'close icon positioned inside the popover (no header and fixed width)',
      path: 'popover/header-variant',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('[data-testid="popover-without-title"] button');
      },
    },
    {
      description: 'inside table - renderWithPortal=false',
      path: 'popover/scenario-in-table',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('table button');
      },
    },
    {
      description: 'inside table - renderWithPortal=true',
      path: 'popover/scenario-in-table',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#renderWithPortal');
        await page.click('table button');
      },
    },
    {
      description: 'scenario - copy - renderWithPortal=false',
      path: 'popover/scenarios',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#scenario-copy button');
      },
    },
    {
      description: 'scenario - copy - renderWithPortal=true',
      path: 'popover/scenarios',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#renderWithPortal');
        await page.click('#scenario-copy button');
      },
    },
    {
      description: 'scenario - medium-key-value - renderWithPortal=false',
      path: 'popover/scenarios',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#scenario-medium-key-value button');
      },
    },
    {
      description: 'scenario - large-key-value - renderWithPortal=false',
      path: 'popover/scenarios',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#scenario-large-key-value button');
      },
    },
    {
      description: 'inline popover - closed - renderWithPortal=false',
      path: 'popover/inline',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'inline popover - closed - renderWithPortal=true',
      path: 'popover/inline',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#renderWithPortal');
      },
    },
    {
      description: 'inline popover - open - renderWithPortal=false',
      path: 'popover/inline',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findPopover().findTrigger().toSelector());
      },
    },
    {
      description: 'inline popover - open - renderWithPortal=true',
      path: 'popover/inline',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click('#renderWithPortal');
        await page.click(wrapper.findPopover().findTrigger().toSelector());
      },
    },
    {
      description: 'positioning - opens in the correct position - renderWithPortal=false',
      path: 'popover/positioning',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#popover-2-2 button');
      },
    },
    {
      description: 'positioning - flips to the opposite position - renderWithPortal=false',
      path: 'popover/positioning',
      screenshotType: 'viewport',
      setup: async ({ page }) => {
        await page.click('#popover-1-2 button');
      },
    },
    {
      description: 'focus - Permutation 1',
      path: 'popover/focus-ring',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus - Permutation 2',
      path: 'popover/focus-ring',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        for (let j = 0; j < 2; j++) {
          await page.focusNextElement();
        }
      },
    },
    {
      description: 'focus - Permutation 3',
      path: 'popover/focus-ring',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        for (let j = 0; j < 3; j++) {
          await page.focusNextElement();
        }
      },
    },
    {
      description: 'focus - Permutation 6',
      path: 'popover/focus-ring',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        for (let j = 0; j < 6; j++) {
          await page.focusNextElement();
        }
      },
    },
    {
      description: 'focus - Permutation 12',
      path: 'popover/focus-ring',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focus-target');
        for (let j = 0; j < 12; j++) {
          await page.focusNextElement();
        }
      },
    },
  ],
};

export default suite;
