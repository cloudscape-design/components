// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

class PopoverFocusPage extends BasePageObject {
  enableRenderWithPortal() {
    return this.click('#renderWithPortal');
  }
}

const setupTest = (renderWithPortal: boolean, testFn: (page: PopoverFocusPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PopoverFocusPage(browser);
    await browser.url('#/light/popover/focus-test');
    if (renderWithPortal) {
      await page.enableRenderWithPortal();
    }
    await testFn(page);
  });
};

describe.each([true, false])('With dismiss button (renderWithPortal=%s)', (renderWithPortal: boolean) => {
  describe.each(['string', 'custom'])('(triggerType=%s)', (triggerType: string) => {
    const elementBeforePopover = triggerType === 'string' ? '#focus-trap-target' : '#focus-trap-target-button';
    const selector = createWrapper().findPopover(triggerType === 'string' ? '#focus-trap' : '#focus-trap-button');
    const triggerSelector =
      triggerType === 'string' ? selector.findTrigger().toSelector() : selector.findTrigger().findButton().toSelector();
    const dismissButtonSelector = selector.findDismissButton({ renderWithPortal }).toSelector();

    test(
      'Should trap focus when opened',
      setupTest(renderWithPortal, async page => {
        await page.click(elementBeforePopover);
        await page.keys(['Tab', 'Space']);
        await page.waitForVisible(dismissButtonSelector);
        await expect(page.isFocused(dismissButtonSelector)).resolves.toBe(true);
        await page.keys(['Tab', 'Tab']);
        await expect(page.isFocused(dismissButtonSelector)).resolves.toBe(true);
      })
    );

    test(
      'Should return focus to the trigger when closed',
      setupTest(renderWithPortal, async page => {
        await page.click(elementBeforePopover);
        await page.keys(['Tab', 'Space']);
        await page.waitForVisible(dismissButtonSelector);
        await expect(page.isFocused(dismissButtonSelector)).resolves.toBe(true);
        await page.keys(['Escape']);
        await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
      })
    );

    test(
      'Should not prevent focus from moving to the clicked element',
      setupTest(renderWithPortal, async page => {
        await page.click(triggerSelector);
        await page.waitForVisible(dismissButtonSelector);
        await expect(page.isFocused(dismissButtonSelector)).resolves.toBe(true);
        await page.click(elementBeforePopover);
        await expect(page.isFocused(elementBeforePopover)).resolves.toBe(true);
      })
    );

    test(
      'Should not restore focus when clicking elsewhere on the page',
      setupTest(renderWithPortal, async page => {
        await page.click(triggerSelector);
        await page.waitForVisible(dismissButtonSelector);
        await page.click('#text-before-focus-trap');
        await page.keys(['Tab']);
        await expect(page.isFocused('#focus-trap-target')).resolves.toBe(true);
      })
    );
  });

  describe.each([true, false])('Inside focusable? %s)', (insideFocusable: boolean) => {
    const popover = createWrapper().findPopover(insideFocusable ? '#focus-trap-within-focusable' : '#focus-trap');
    const dismissSelector = popover.findDismissButton({ renderWithPortal }).toSelector();
    const contentSelector = popover.findContent({ renderWithPortal }).toSelector();
    const inputSelector = `${contentSelector} input`;

    test(
      'Should allow focus to be moved away from a focusable child',
      setupTest(renderWithPortal, async page => {
        await page.click(popover.findTrigger().toSelector());
        await page.waitForVisible(dismissSelector);
        await page.click(`${contentSelector} input`);
        await expect(page.isFocused(inputSelector)).resolves.toBe(true);
        await page.click(`${contentSelector} p`);
        await expect(page.isFocused(inputSelector)).resolves.toBe(false);
      })
    );
  });
});

describe.each([true, false])('Without dismiss button (renderWithPortal=%s)', (renderWithPortal: boolean) => {
  const selector = createWrapper().findPopover('#no-focus-trap');
  const triggerSelector = selector.findTrigger().toSelector();
  const contentSelector = selector.findContent({ renderWithPortal }).toSelector();

  test(
    'Should not trap focus when opened',
    setupTest(renderWithPortal, async page => {
      await page.click('#no-focus-trap-target');
      await page.keys(['Tab', 'Space']);
      await page.waitForVisible(contentSelector);
      await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
    })
  );

  test(
    'Should close when focus leaves the trigger',
    setupTest(renderWithPortal, async page => {
      await page.click('#no-focus-trap-target');
      await page.keys(['Tab', 'Space']);
      await page.waitForVisible(contentSelector);
      await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isExisting(contentSelector)).resolves.toBe(false);
    })
  );
});
