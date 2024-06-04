// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

const buttonGroup = createWrapper().findButtonGroup();

test(
  'shows popover after clicking on inline button',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/button-group/test');

    await page.click(buttonGroup.findInlineItemById('like').toSelector());
    await page.waitForVisible(buttonGroup.findActionPopover().toSelector());
    await expect(page.getText(buttonGroup.findActionPopover().toSelector())).resolves.toBe('Liked');
    await expect(page.getText('#last-clicked')).resolves.toBe('like');
  })
);

test(
  'can click in-menu item',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/button-group/test');

    await page.click(buttonGroup.findShowMoreButton().toSelector());
    await page.click(buttonGroup.findShowMoreButton().findItemById('edit').toSelector());
    await expect(page.getText('#last-clicked')).resolves.toBe('edit');
  })
);
