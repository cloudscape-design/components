// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const annotationWrapper = wrapper.findAnnotation();

test(
  'scrolls annotation in view with fixed elements',
  useBrowser(async browser => {
    await browser.url('#/light/annotation-context/annotation-scroll');
    const page = new BasePageObject(browser);
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

function overlap(one: ElementRect, two: ElementRect) {
  if (one.right < two.left || one.left > two.right) {
    return false;
  }

  if (one.bottom < two.top || one.top > two.bottom) {
    return false;
  }

  return true;
}
