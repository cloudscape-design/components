// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findFileUpload();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('/#/light/file-upload/test');
    await testFn(page);
  });
};

test(
  'file tokens can be removed',
  setupTest(async page => {
    await expect(page.getElementsCount(wrapper.findFileTokens().toSelector())).resolves.toBe(2);

    await page.click(wrapper.findFileToken(1).findRemoveButton().toSelector());
    await page.click(wrapper.findFileToken(1).findRemoveButton().toSelector());

    await expect(page.getElementsCount(wrapper.findFileTokens().toSelector())).resolves.toBe(0);
  })
);

test(
  'file can be renamed',
  setupTest(async page => {
    await expect(page.getText(wrapper.findFileToken(1).findFileName().toSelector())).resolves.toBe('contract-1.pdf');

    await page.click(wrapper.findFileToken(1).findActivateNameEditButton().toSelector());
    await page.click(wrapper.findFileToken(1).findNameEditInput().toSelector());
    await page.keys(['Backspace', 'Backspace', 'Backspace', 't', 'x', 't']);
    await page.click(wrapper.findFileToken(1).findSubmitNameEditButton().toSelector());

    await expect(page.getText(wrapper.findFileToken(1).findFileName().toSelector())).resolves.toBe('contract-1.txt');
  })
);
