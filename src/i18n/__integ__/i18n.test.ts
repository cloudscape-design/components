// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import jaStaticMessages from '../../../lib/components/i18n/messages/all.ja.json';

const wrapper = createWrapper().findTagEditor();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('/#/light/i18n/dynamic');
    await testFn(page);
  });
};

test(
  'dynamic messages are loaded correctly',
  setupTest(async page => {
    const text = jaStaticMessages['@cloudscape-design/components'].ja['tag-editor']['i18nStrings.addButton'][0].value;
    await page.waitForVisible(wrapper.findAddButton().toSelector());
    await expect(page.getText(wrapper.findAddButton().toSelector())).resolves.toBe(text);
  })
);
