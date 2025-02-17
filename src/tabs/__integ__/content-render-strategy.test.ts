// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/tabs/content-render-strategy-integ');
    await page.waitForVisible(wrapper.findTabs().findTabContent().toSelector());
    await testFn(page);
  });
};

test(
  'strategy:eager tab content should already be available',
  setupTest(async page => {
    await expect(page.isExisting('#loading-eager')).resolves.toBeTruthy();
  })
);
test(
  'strategy:lazy tab content should load only when activated (but then remain)',
  setupTest(async page => {
    await expect(page.isExisting('#loading-lazy')).resolves.toBeFalsy();
    await page.click(wrapper.findTabs().findTabLinkByIndex(3).toSelector());
    await expect(page.isExisting('#loading-lazy')).resolves.toBeTruthy();
    await page.click(wrapper.findTabs().findTabLinkByIndex(2).toSelector());
    await expect(page.isExisting('#loading-lazy')).resolves.toBeTruthy();
  })
);
test(
  'strategy:eager tab state is retained when switching away and back',
  setupTest(async page => {
    const input = wrapper.findTabs().findTabContent().findInput().findNativeInput().toSelector();
    await page.setValue(input, 'new value');
    await expect(page.getValue(input)).resolves.toBe('new value');
    await page.click(wrapper.findTabs().findTabLinkByIndex(3).toSelector());
    await page.click(wrapper.findTabs().findTabLinkByIndex(1).toSelector());
    await expect(page.getValue(input)).resolves.toBe('new value');
  })
);
test(
  'strategy:eager (iframe) tab state is retained when switching away and back',
  setupTest(async page => {
    const iframeInput = wrapper.findInput().findNativeInput().toSelector();
    await page.click(wrapper.findTabs().findTabLinkByIndex(5).toSelector());
    await page.runInsideIframe('iframe', true, async () => {
      await page.setValue(iframeInput, 'new value');
      await expect(page.getValue(iframeInput)).resolves.toBe('new value');
    });
    await page.click(wrapper.findTabs().findTabLinkByIndex(3).toSelector());
    await page.click(wrapper.findTabs().findTabLinkByIndex(5).toSelector());
    await page.runInsideIframe('iframe', true, async () => {
      await expect(page.getValue(iframeInput)).resolves.toBe('new value');
    });
  })
);
test(
  'strategy:active tab state is not retained when switching away and back',
  setupTest(async page => {
    const input = wrapper.findTabs().findTabContent().findInput().findNativeInput().toSelector();
    await page.click(wrapper.findTabs().findTabLinkByIndex(2).toSelector());
    await page.setValue(input, 'new value');
    await expect(page.getValue(input)).resolves.toBe('new value');
    await page.click(wrapper.findTabs().findTabLinkByIndex(3).toSelector());
    await page.click(wrapper.findTabs().findTabLinkByIndex(2).toSelector());
    await expect(page.getValue(input)).resolves.toBe('');
  })
);
