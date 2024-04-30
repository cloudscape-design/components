// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors/index.js';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const sliderWrapper = createWrapper().findSlider();

class SliderPage extends BasePageObject {
  async clickSlider() {
    await this.click(sliderWrapper.toSelector());
  }
}
const setupTest = (testFn: (page: SliderPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new SliderPage(browser);
    await browser.url(`#/light/slider/basic`);
    await page.waitForVisible(sliderWrapper.toSelector());
    await testFn(page);
  });
};
describe('Slider', () => {
  test(
    'Slider tooltip should show',
    setupTest(async page => {
      await expect(page.isExisting(createWrapper().find(`.${tooltipStyles.root}`).toSelector())).resolves.toBe(false);
      await page.clickSlider();
      await page.keys(['Tab']);
      await expect(page.isExisting(createWrapper().find(`.${tooltipStyles.root}`).toSelector())).resolves.toBe(true);
    })
  );
});
