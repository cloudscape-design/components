// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import tooltipStyles from '../../../lib/components/tooltip/test-classes/styles.selectors.js';

const wrapper = createWrapper();
const buttonSelector = wrapper.findButton('[data-testid="normal-button-with-href"]').toSelector();
const tooltipSelector = `.${tooltipStyles.root}`;

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/button/disabled-reason-iframe');
    await page.runInsideIframe('#button-iframe', true, async () => {
      await page.waitForVisible(buttonSelector);
      await testFn(page);
    });
  });
};

describe('Button disabled reason in iframe', () => {
  test(
    'shows tooltip on hover',
    setupTest(async page => {
      await page.hoverElement(buttonSelector);
      await page.waitForVisible(tooltipSelector);
      await expect(page.getText(tooltipSelector)).resolves.toBe('disabled reason');
    })
  );

  test(
    'shows tooltip on focus',
    setupTest(async page => {
      await page.click('body');
      await page.keys(['Tab']);
      await page.waitForVisible(tooltipSelector);
    })
  );

  test(
    'dismisses tooltip on Escape',
    setupTest(async page => {
      await page.hoverElement(buttonSelector);
      await page.waitForVisible(tooltipSelector);
      await page.keys(['Escape']);
      await page.waitForAssertion(async () => expect(await page.isDisplayed(tooltipSelector)).toBe(false));
    })
  );
});
