// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wizardWrapper = createWrapper().findWizard();

class WizardPageObject extends BasePageObject {
  clickPrimaryButton() {
    return this.click(wizardWrapper.findPrimaryButton().toSelector());
  }
  resetFocus() {
    return this.click('#focus-reset');
  }
  async isContentDisplayedInViewport() {
    const elements = await this.browser.$$('#content-text');
    if (elements.length === 0) {
      return false;
    }
    return elements[0].isDisplayedInViewport();
  }
  toggleScrollableContainer() {
    return this.click(createWrapper().findToggle().findNativeInput().toSelector());
  }
}

function setupTest(testFn: (page: WizardPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('/#/light/wizard/simple?visualRefresh=false');
    const page = new WizardPageObject(browser);
    await page.waitForVisible(wizardWrapper.findPrimaryButton().toSelector());
    await testFn(page);
  });
}

describe('Wizard keyboard navigation', () => {
  test(
    'navigate to the first step from menu navigation link using the Enter key',
    setupTest(async page => {
      await page.clickPrimaryButton();
      await page.resetFocus();
      await page.keys(['Tab', 'Enter']);
      await expect(page.getText('#content-text')).resolves.toBe('Content 1');
    })
  );

  ['Enter', 'Space'].forEach(confirmKey => {
    test(
      `navigate to the next step using the ${confirmKey} key`,
      setupTest(async page => {
        await page.resetFocus();
        await page.keys(['Tab', 'Tab', confirmKey]);
        await expect(page.getText('#content-text')).resolves.toBe('Content 2');
      })
    );

    test(
      `navigate to the previous step using the ${confirmKey} key`,
      setupTest(async page => {
        await page.clickPrimaryButton();
        await page.keys(['Shift', 'Tab', confirmKey]);
        await expect(page.getText('#content-text')).resolves.toBe('Content 1');
      })
    );

    test(
      'should focus on header after navigation to the next step',
      setupTest(async page => {
        await page.resetFocus();
        await page.keys(['Tab', 'Tab', 'Space']);
        await expect(page.getFocusedElementText()).resolves.toBe('Step 2');
      })
    );

    test(
      'should focus on header after navigation to the previous step',
      setupTest(async page => {
        await page.clickPrimaryButton();
        await page.keys(['Shift', 'Tab', 'Space']);
        await expect(page.getFocusedElementText()).resolves.toBe('Step 1');
      })
    );

    test(
      'header should receive focus only programmatically',
      setupTest(async page => {
        await page.resetFocus();
        await page.keys(['Tab', 'Tab', 'Space']);
        await expect(page.getFocusedElementText()).resolves.toBe('Step 2');
        await page.keys(['Tab', 'Shift', 'Tab']);
        await expect(page.getFocusedElementText()).resolves.not.toBe('Step 2');
      })
    );
  });
});

describe('Wizard scroll to top upon navigation', () => {
  test(
    'in window',
    setupTest(async page => {
      await page.setWindowSize({ width: 2000, height: 300 });
      await page.windowScrollTo({ top: 200 });
      await expect(page.isContentDisplayedInViewport()).resolves.toBe(false);
      await page.clickPrimaryButton();
      await expect(page.isContentDisplayedInViewport()).resolves.toBe(true);
    })
  );
  test(
    'in a scrollable container',
    setupTest(async page => {
      await page.toggleScrollableContainer();
      await page.elementScrollTo('#scrollable-container', { top: 200 });
      await expect(page.isContentDisplayedInViewport()).resolves.toBe(false);
      await page.clickPrimaryButton();
      await expect(page.isContentDisplayedInViewport()).resolves.toBe(true);
    })
  );
});
