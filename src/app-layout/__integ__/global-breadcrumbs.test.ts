// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class GlobalBreadcrumbsPage extends BasePageObject {
  getBreadcrumbsCount() {
    return this.getElementsCount(wrapper.findBreadcrumbGroup().toSelector());
  }

  getRootBreadcrumbText() {
    return this.getText(
      wrapper.findAppLayout().findBreadcrumbs().findBreadcrumbGroup().findBreadcrumbLink(1).toSelector()
    );
  }

  async toggleExtraBreadcrumb() {
    await this.click('[data-testid="toggle-extra-breadcrumb"]');
  }
}

describe.each(['classic', 'visual-refresh'])('%s', theme => {
  test(
    'does not work in this design',
    useBrowser(async browser => {
      const page = new GlobalBreadcrumbsPage(browser);
      await browser.url(
        `#/light/app-layout/global-breadcrumbs/?visualRefresh=${theme === 'visual-refresh' ? 'true' : 'false'}`
      );
      await expect(page.getRootBreadcrumbText()).resolves.toEqual('Default');
      await expect(page.getBreadcrumbsCount()).resolves.toEqual(1);

      await page.toggleExtraBreadcrumb();
      await expect(page.getRootBreadcrumbText()).resolves.toEqual('Default');
      await expect(page.getBreadcrumbsCount()).resolves.toEqual(2);
    })
  );
});

describe('visual-refresh-toolbar', () => {
  test(
    'deduplicates breadcrumbs',
    useBrowser(async browser => {
      const page = new GlobalBreadcrumbsPage(browser);
      await browser.url(`#/light/app-layout/global-breadcrumbs/?visualRefresh=true&appLayoutWidget=true`);
      await expect(page.getRootBreadcrumbText()).resolves.toEqual('Default');
      await expect(page.getBreadcrumbsCount()).resolves.toEqual(1);

      await page.toggleExtraBreadcrumb();
      await expect(page.getRootBreadcrumbText()).resolves.toEqual('Dynamic');
      await expect(page.getBreadcrumbsCount()).resolves.toEqual(1);

      await page.toggleExtraBreadcrumb();
      await expect(page.getRootBreadcrumbText()).resolves.toEqual('Default');
      await expect(page.getBreadcrumbsCount()).resolves.toEqual(1);
    })
  );
});
