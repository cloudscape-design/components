// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

[false, true].forEach(renderWithPortal =>
  test(
    `Click button inside popover with renderWithPortal=${renderWithPortal}`,
    useBrowser(async browser => {
      const modalTrigger = createWrapper().findButton().toSelector();
      const popoverTrigger = createWrapper().findPopover().findTrigger().toSelector();
      const popoverHeader = createWrapper().findPopover().findHeader({ renderWithPortal }).toSelector();
      const targetButton = createWrapper().findPopover().findContent({ renderWithPortal }).findButton().toSelector();

      const page = new BasePageObject(browser);
      await browser.url(`#/light/popover/in-modal-test?renderWithPortal=${renderWithPortal}`);
      await page.click(modalTrigger);
      await page.click(popoverTrigger);
      await page.click(targetButton);
      await expect(page.getElementsText(popoverHeader)).resolves.toEqual(['Clicked']);
    })
  )
);
