// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from '../../app-layout/__integ__/constants';
import styles from '../../../lib/components/container/styles.selectors.js';

const tableWrapper = createWrapper().findTable();

class ContainerStickyPage extends BasePageObject {
  async hasHeaderCover() {
    const elements = await this.browser.$$(tableWrapper.findByClassName(styles['header-cover']).toSelector());
    if (elements.length === 0) {
      return false;
    }
    return true;
  }
}

function setupTest(
  { viewport = viewports.desktop, search = '', visualRefresh = true },
  testFn: (page: ContainerStickyPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new ContainerStickyPage(browser);
    await page.setWindowSize(viewport);
    await browser.url(`#/light/container/sticky-permutations?visualRefresh=${visualRefresh}&${search}`);
    await page.waitForVisible(tableWrapper.findBodyCell(1, 1).toSelector());
    await testFn(page);
  });
}

test(
  'Header cover is displayed in full-page variant',
  setupTest({}, async page => {
    await page.windowScrollTo({ top: 300 });
    expect(page.hasHeaderCover()).resolves.toBe(true);
  })
);

test(
  'Header cover is not displayed in container variant',
  setupTest({ search: 'tableVariant=container' }, async page => {
    await page.windowScrollTo({ top: 300 });
    expect(page.hasHeaderCover()).resolves.toBe(false);
  })
);

test(
  'Header cover is not displayed in mobile',
  setupTest({ viewport: viewports.mobile }, async page => {
    await page.windowScrollTo({ top: 300 });
    expect(page.hasHeaderCover()).resolves.toBe(false);
  })
);

test(
  'Header cover is removed upon scrolling up',
  setupTest({}, async page => {
    await page.windowScrollTo({ top: 300 });
    await page.windowScrollTo({ top: 0 });
    expect(page.hasHeaderCover()).resolves.toBe(false);
  })
);

test(
  'Header cover is not displayed in classic',
  setupTest({ visualRefresh: false }, async page => {
    await page.windowScrollTo({ top: 300 });
    expect(page.hasHeaderCover()).resolves.toBe(false);
  })
);
