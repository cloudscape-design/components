// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const annotationWrapper = wrapper.findAnnotation();

// AWSUI-51612
test(
  'should open a next hotspot on a next page after loading',
  useBrowser(async browser => {
    await browser.url('#/light/annotation-context/with-switching-pages');
    const page = new BasePageObject(browser);
    await page.click(annotationWrapper.findNextButton().toSelector());
    await page.click('[data-testid="next-page"]');
    await page.waitForVisible('[data-testid="second-page"]');
    await expect(page.isDisplayed(wrapper.findAnnotation().toSelector())).resolves.toBe(true);
  })
);
