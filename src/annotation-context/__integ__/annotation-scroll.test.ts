// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const annotationWrapper = wrapper.findAnnotation();

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/annotation-context/annotation-scroll');
    await testFn(page);
  });
}

test(
  'scrolls annotation in view with fixed elements',
  setupTest(async page => {
    const nextButtonSelector = annotationWrapper.findNextButton().toSelector();
    await page.waitForVisible(nextButtonSelector);
    await page.click(nextButtonSelector);
    await page.click(nextButtonSelector);
    await page.waitForVisible(nextButtonSelector);

    const hotspotOneBox = await page.getBoundingBox(
      wrapper.findHotspot('[data-testid="hotspot-2"]').findTrigger().toSelector()
    );
    const footerBox = await page.getBoundingBox('[data-testid="footer"]');

    expect(overlap(hotspotOneBox, { ...footerBox, bottom: Infinity })).toBeFalsy();

    await page.click(annotationWrapper.findPreviousButton().toSelector());

    const hotspotOneTwoBox = await page.getBoundingBox(
      wrapper.findHotspot('[data-testid="hotspot-1"]').findTrigger().toSelector()
    );
    const headerBox = await page.getBoundingBox('[data-testid="header"]');

    expect(overlap(hotspotOneTwoBox, { ...headerBox, top: -Infinity })).toBeFalsy();
  })
);

test(
  'does not update popover position when annotation is rendered offscreen',
  setupTest(async page => {
    await expect(page.isDisplayedInViewport(annotationWrapper.toSelector())).resolves.toEqual(true);
    // scroll to the page bottom to make annotation offscreen
    await page.windowScrollTo({ top: 1200 });
    await expect(page.isDisplayedInViewport(annotationWrapper.toSelector())).resolves.toEqual(false);
    const positionBefore = await page.getBoundingBox(annotationWrapper.toSelector());
    // click somewhere to trigger the regression
    await page.click('main');
    const positionAfter = await page.getBoundingBox(annotationWrapper.toSelector());
    expect(positionBefore).toEqual(positionAfter);
  })
);

function overlap(one: ElementRect, two: ElementRect) {
  if (one.right < two.left || one.left > two.right) {
    return false;
  }

  if (one.bottom < two.top || one.top > two.bottom) {
    return false;
  }

  return true;
}
