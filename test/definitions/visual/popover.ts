// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestDefinition, TestSuite } from '../types';

async function scrollToSelector(page: VisualTestPageObject, selector: string): Promise<void> {
  const boundingBox = await page.getBoundingBox(selector);
  const windowScroll = await page.getWindowScroll();
  await page.windowScrollTo({ top: windowScroll.top + boundingBox.top });
}

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
      // There is no support for popover rendered with portal in a modal
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
    ...[true, false].map<TestSuite>(renderWithPortal => ({
      description: `renderWithPortal=${renderWithPortal}`,
      tests: [
        {
          description: 'inside table',
          path: 'popover/scenario-in-table',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await page.click('table button');
          },
        },
        ...[
          'copy',
          'medium-key-value',
          'large-key-value',
          'large-key-value-no-header',
          'in-containment',
        ].map<TestDefinition>(scenario => ({
          description: `scenario - ${scenario}`,
          path: 'popover/scenarios',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await scrollToSelector(page, `#scenario-${scenario}`);
            await page.click(`#scenario-${scenario} button`);
          },
        })),
        {
          description: 'scenario - with select',
          path: 'popover/scenarios',
          screenshotType: 'viewport',
          setup: async ({ page, wrapper }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await scrollToSelector(page, '#scenario-with-select');
            const popover = wrapper.findPopover('#scenario-with-select');
            await page.click(popover.findTrigger().toSelector());
            await page.click(popover.findContent().findSelect().findTrigger().toSelector());
          },
        },
        {
          description: 'scenario - error (lazy-loading)',
          path: 'popover/scenarios',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await scrollToSelector(page, '#scenario-error');
            await page.click('#scenario-error button');
            // Wait for element query update after displaying spinner
            await page.pause(500);
          },
        },
        {
          description: 'inline popover - closed',
          path: 'popover/inline',
          screenshotType: 'screenshotArea',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
          },
        },
        {
          description: 'inline popover - open',
          path: 'popover/inline',
          screenshotType: 'screenshotArea',
          setup: async ({ page, wrapper }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await page.click(wrapper.findPopover().findTrigger().toSelector());
          },
        },
        ...Object.entries({
          'opens in the correct position if there is space': '#popover-2-2',
          'flips to the opposite position': '#popover-1-2',
          'flips to the perpendicular direction': '#popover-2-3',
          'flips to the bottom variant of the perpendicular direction': '#popover-3-3',
        }).map<TestDefinition>(([testName, selector]) => ({
          description: `positioning - ${testName}`,
          path: 'popover/positioning',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await scrollToSelector(page, `${selector} button`);
            await page.click(`${selector} button`);
          },
        })),
        {
          description: 'positioning - flips to the bottom variant of the perpendicular direction, no scroll',
          path: 'popover/positioning',
          screenshotType: 'viewport',
          setup: async ({ page }) => {
            if (renderWithPortal) {
              await page.click('#renderWithPortal');
            }
            await scrollToSelector(page, '.screenshot-area');
            await page.click('#popover-3-3 button');
          },
        },
      ],
    })),
    {
      description: 'focus',
      tests: Array.from({ length: 12 }, (_, index) => index + 1).map<TestDefinition>(i => ({
        description: `Permutation ${i}`,
        path: 'popover/focus-ring',
        screenshotType: 'screenshotArea',
        setup: async ({ page }) => {
          await page.click('#focus-target');
          for (let j = 0; j < i; j++) {
            await page.focusNextElement();
          }
        },
      })),
    },
  ],
};

export default suite;
