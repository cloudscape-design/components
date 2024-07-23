// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findCards();
const preferences = wrapper.findCollectionPreferences();

test(
  'changes page size on confirm',
  useBrowser(async browser => {
    await browser.url('#/light/cards/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findItems().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().toSelector())).resolves.toEqual(20);

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(
      preferences.findModal().findPageSizePreference().findOptions().get(2).findNativeInput().toSelector()
    );
    await page.click(preferences.findModal().findConfirmButton().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().toSelector())).resolves.toEqual(50);
  })
);
test(
  'does not change page size on cancel',
  useBrowser(async browser => {
    await browser.url('#/light/cards/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findItems().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().toSelector())).resolves.toEqual(20);

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(
      preferences.findModal().findPageSizePreference().findOptions().get(2).findNativeInput().toSelector()
    );
    await page.click(preferences.findModal().findCancelButton().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().toSelector())).resolves.toEqual(20);
  })
);
test(
  'changes visible sections',
  useBrowser(async browser => {
    await browser.url('#/light/cards/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findItems().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().get(1).findSections().toSelector())).resolves.toEqual(2);
    await expect(
      page.getText(wrapper.findItems().get(1).findSections().get(2).findSectionHeader().toSelector())
    ).resolves.toEqual('Type');
    await expect(
      page.getText(wrapper.findItems().get(1).findSections().get(3).findSectionHeader().toSelector())
    ).resolves.toEqual('DNS name');

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(preferences.findModal().findVisibleContentPreference().findToggleByIndex(1, 2).toSelector());
    await page.click(preferences.findModal().findConfirmButton().toSelector());
    await expect(page.getElementsCount(wrapper.findItems().get(1).findSections().toSelector())).resolves.toEqual(1);
    await expect(
      page.getText(wrapper.findItems().get(1).findSections().get(2).findSectionHeader().toSelector())
    ).resolves.toEqual('Type');
  })
);
