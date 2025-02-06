// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/tabs/in-memory-integ');
    await page.waitForVisible(wrapper.findTabs().findTabContent().toSelector());
    await testFn(page);
  });
};

test(
  'eager-loaded tab content should already be available',
  setupTest(async page => {
    await page.pause(2000);
    await page.click(wrapper.findTabs().findTabLinkByIndex(4).toSelector());
    await expect(page.getText(wrapper.findTabs().findTabContent().toSelector())).resolves.toBe('Loaded');
  })
);
test(
  'lazy-loaded tab content should load only when activated',
  setupTest(async page => {
    await page.pause(2000);
    await page.click(wrapper.findTabs().findTabLinkByIndex(3).toSelector());
    const activeTabContent = wrapper.findTabs().findTabContent().toSelector();
    await expect(page.getText(activeTabContent)).resolves.toBe('Loading...');
    await page.waitForAssertion(() => expect(page.getText(activeTabContent)).resolves.toBe('Loaded'));
  })
);
test(
  'tab state is retained when switching away and back',
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
  'tab state is not retained when switching away and back (strategy: active)',
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
