// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

import tooltipStyles from '../../../../../lib/components/internal/components/tooltip/styles.selectors.js';

test(
  'should not close any wrapping modals when the tooltip detects an Escape keypress',
  useBrowser(async browser => {
    await browser.url('/#/light/modal/with-tooltip');
    const page = new BasePageObject(browser);

    const openButtonSelector = createWrapper().findButton().toSelector();
    await page.waitForVisible(openButtonSelector);
    await page.click(openButtonSelector);

    const modal = createWrapper().findModal();
    const slider = modal.findContent().findSlider();
    await page.waitForVisible(slider.toSelector());

    // Slider on the page is set at 50% on purpose. `hoverElement` will move the
    // mouse to the center of the track where the "thumb" is.
    await page.hoverElement(slider.findNativeInput().toSelector());
    await page.waitForVisible(`.${tooltipStyles.root}`);

    // Press once to close the tooltip
    await page.keys(['Escape']);
    await expect(page.isDisplayed(`.${tooltipStyles.root}`)).resolves.toBe(false);
    await expect(page.isDisplayed(modal.toSelector())).resolves.toBe(true);

    // Press again to close the modal
    await page.keys(['Escape']);
    await expect(page.isDisplayed(modal.toSelector())).resolves.toBe(false);
  })
);
