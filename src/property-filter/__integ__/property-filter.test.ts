// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findPropertyFilter();
const token2Wrapper = wrapper.findTokens().get(2);
const token2EditorWrapper = wrapper.findTokens().get(2).findEditorDropdown({ expandToViewport: true })!;

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/property-filter/split-panel-app-layout-integration');
    await page.waitForVisible('main');
    await testFn(page);
  });
}

test(
  'can create an edit a second token',
  setupTest(async page => {
    // Create second token
    await page.click(wrapper.findNativeInput().toSelector());
    await page.keys(['i', 'd']);
    await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
    await page.keys(['=']);
    await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);

    console.log('selector: ', token2Wrapper.toSelector());

    await expect(page.getElementsText(token2Wrapper.toSelector())).resolves.toEqual([
      'and\nInstance ID = i-2dc5ce28a0328391',
    ]);

    // Update second token operator
    await page.click(token2Wrapper.findLabel().toSelector());
    await page.click(token2EditorWrapper.findOperatorField().findControl().findSelect().findTrigger().toSelector());
    await page.keys(['ArrowDown', 'Enter']);
    await page.click(token2EditorWrapper!.findSubmitButton().toSelector());

    await expect(page.getElementsText(token2Wrapper.toSelector())).resolves.toEqual([
      'and\nInstance ID != i-2dc5ce28a0328391',
    ]);
  })
);
