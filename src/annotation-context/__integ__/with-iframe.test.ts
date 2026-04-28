// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

test(
  'annotation popover is visible inside iframe',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/annotation-context/with-iframe');
    await page.runInsideIframe('#annotation-iframe', true, async () => {
      const annotationSelector = wrapper.findAnnotation().toSelector();
      await page.waitForVisible(annotationSelector);
      await expect(page.isDisplayed(annotationSelector)).resolves.toBe(true);
    });
  })
);
