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
  isContentDisplayedInViewport() {
    return this.isDisplayedInViewport('#content-text');
  }
  toggleScrollableContainer() {
    return this.click(createWrapper().findToggle().findNativeInput().toSelector());
  }
  getInput(selector?: string) {
    return wizardWrapper.findContent().findInput(selector);
  }
  getInputSelector(selector?: string) {
    return wizardWrapper.findContent().findInput(selector).findNativeInput().toSelector();
  }
  getFormFieldSelector(selector?: string) {
    return wizardWrapper.findContent().findFormField(selector).toSelector();
  }
  getFormFieldErrorSelector(selector?: string) {
    return wizardWrapper.findContent().findFormField(selector).findError().toSelector();
  }
  async type(text: string) {
    // `await this.keys(text);` doesn't work as it key presses too quickly and doesn't
    // allow the separator to be appended so the cursor position gets messed up.
    for (let k = 0; k < text.length; k++) {
      await this.keys(text[k]);
    }
  }
  // gh pr create
  // takes u to interactive interface
  // will ask u if u want to be in draft mode
  // name as "feat: <name of feature>"
}

function setupTest(testFn: (page: WizardPageObject) => Promise<void>, url?: string) {
  return useBrowser(async browser => {
    await browser.url(url ?? '/#/light/wizard/simple?visualRefresh=false');
    const page = new WizardPageObject(browser);
    await page.waitForVisible(wizardWrapper.findPrimaryButton().toSelector());
    await testFn(page);
  });
}

describe('Wizard keyboard navigation', () => {
  test(
    'calls user defined form validation from onNavigate on input element on Enter key',
    setupTest(async page => {
      const firstNameInput = page.getInputSelector('[data-testid="first-name-input"]');

      await page.click(firstNameInput);
      await page.keys('Enter');

      const errorText = page.getFormFieldErrorSelector('[data-testid="first-name-form-field"]');
      await expect(page.getText(errorText)).resolves.toContain('This field cannot be left blank.');
    }, '/#/light/wizard/native-form-submit')
  );

  test(
    'navigates to next step on non-last step on input element on Enter key',
    setupTest(async page => {
      const firstNameInput = page.getInputSelector('[data-testid="first-name-input"]');

      await page.click(firstNameInput);
      await page.type('MyFirstName');
      await page.keys('Enter');

      await expect(page.getText(`[data-testid="result-text"]`)).resolves.toContain(
        'Navigate action was called. Starting index: 0. Ending index: 1'
      );
    }, '/#/light/wizard/native-form-submit')
  );

  test(
    'invokes submit action on last step on input element on Enter key w/ user validation',
    setupTest(async page => {
      const firstNameInput = page.getInputSelector('[data-testid="first-name-input"]');

      await page.click(firstNameInput);
      await page.type('MyFirstName');
      await page.keys('Enter');

      const lastNameInput = page.getInputSelector('[data-testid="last-name-input"]');
      await page.click(lastNameInput);
      await page.keys('Enter');

      const errorText = page.getFormFieldErrorSelector('[data-testid="last-name-form-field"]');
      await expect(page.getText(errorText)).resolves.toContain('This field cannot be left blank.');

      await expect(page.getText(`[data-testid="result-text"]`)).resolves.not.toContain('Submit action was called.');

      await page.click(lastNameInput);
      await page.type('MyLastName');
      await page.keys('Enter');

      await expect(page.getText(`[data-testid="result-text"]`)).resolves.toContain('Submit action was called.');
    }, '/#/light/wizard/native-form-submit')
  );

  test(
    'navigate to the first step from menu navigation link using the Enter key',
    setupTest(async page => {
      // Initial render should not focus the header
      await expect(page.getFocusedElementText()).resolves.not.toBe('Step 1');
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
