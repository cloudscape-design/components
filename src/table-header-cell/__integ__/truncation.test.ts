// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import bodyCellStyles from '../../../lib/components/table/body-cell/styles.selectors.js';
import styles from '../../../lib/components/table-header-cell/styles.selectors.js';

const pageUrl = '#/light/table-root/header-truncation';
const headerContent = `[data-testid="narrow-table"] .${styles['header-cell-content']}`;
const firstHeaderButton = '[data-testid="first-header-button"]';

test(
  'truncates header text that is wider than its column with an ellipsis',
  useBrowser(async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(headerContent);

    const contents = await browser.execute((selector: string) => {
      return Array.from(document.querySelectorAll<HTMLElement>(selector)).map(element => ({
        overflowsContent: element.scrollWidth > element.clientWidth,
        textOverflow: getComputedStyle(element).textOverflow,
        rightOverhang: element.getBoundingClientRect().right - element.parentElement!.getBoundingClientRect().right,
      }));
    }, headerContent);

    expect(contents).toHaveLength(3);
    for (const content of contents) {
      expect(content.overflowsContent).toBe(true);
      expect(content.textOverflow).toBe('ellipsis');
      expect(content.rightOverhang).toBeLessThanOrEqual(0);
    }
  })
);

test(
  'leaves room inside the clip for a focus ring on the first column, without moving its text',
  useBrowser(async browser => {
    await browser.url(pageUrl);
    const page = new BasePageObject(browser);
    await page.waitForVisible(firstHeaderButton);

    const { buttonLeft, clipLeft, bodyTextLeft } = await browser.execute(
      (buttonSelector: string, bodyContentClass: string) => {
        const button = document.querySelector<HTMLElement>(buttonSelector)!;
        const bodyContent = document.querySelector<HTMLElement>(`.${bodyContentClass}`)!;
        return {
          buttonLeft: button.getBoundingClientRect().left,
          clipLeft: button.parentElement!.getBoundingClientRect().left,
          bodyTextLeft:
            bodyContent.getBoundingClientRect().left + parseFloat(getComputedStyle(bodyContent).paddingInlineStart),
        };
      },
      firstHeaderButton,
      bodyCellStyles['body-cell-content']
    );

    expect(buttonLeft - clipLeft).toBeGreaterThanOrEqual(4);
    expect(buttonLeft).toBe(bodyTextLeft);
  })
);
