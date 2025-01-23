// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/selectors';

const iframeId = '#inner-iframe';
const wrapper = createWrapper().findAppLayout();
const findDrawerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
};

describe('Visual refresh toolbar only', () => {
  const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();
  function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);

      await browser.url(
        `#/light/app-layout/multi-layout-global-drawer-child-layout?${new URLSearchParams({
          visualRefresh: 'true',
          appLayoutToolbar: 'true',
        }).toString()}`
      );
      await page.runInsideIframe(iframeId, true, async () => {
        await page.waitForVisible(secondaryLayout.findContentRegion().find('h1').toSelector());
      });
      await testFn(page);
    });
  }

  test(
    'global drawers registered from child AppLayout render correctly when __disableRuntimeDrawers is set to true for parent AppLayout',
    setupTest(async page => {
      await expect(page.isClickable(wrapper.findDrawerTriggerById('circle-global').toSelector())).resolves.toBe(true);
      await page.runInsideIframe(iframeId, true, async () => {
        await expect(page.isDisplayed(findDrawerById(secondaryLayout, 'circle-global').toSelector())).resolves.toBe(
          true
        );
      });
    })
  );
});
