// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { Size, Theme, times } from '../../__integ__/utils';
import { viewports } from '../../app-layout/__integ__/constants';

const appLayout = createWrapper().findAppLayout();
const splitPanel = appLayout.findSplitPanel();
const openButtonSelector = appLayout.findContentRegion().findHeader().findActions().findButton().toSelector();
const closeButtonSelector = splitPanel.findCloseButton().toSelector();

interface SetupTestOptions {
  screenSize?: (typeof viewports)['desktop' | 'mobile'];
  theme: Theme;
}

const setupTest = (
  { screenSize = viewports.desktop, theme }: SetupTestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) =>
  useBrowser(screenSize, async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      visualRefresh: `${theme !== 'classic'}`,
      appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
    }).toString();
    await browser.url(`#/light/app-layout/dashboard-content-type?${params}`);
    await page.waitForVisible(appLayout.findContentRegion().toSelector());
    await testFn(page);
  });

describe('Discreet split panel', () => {
  describe.each<Theme>(['classic', 'refresh', 'refresh-toolbar'])('%s', theme => {
    describe.each<Size>(['desktop', 'mobile'])('%s', size => {
      it(
        'opens and closes',
        setupTest({ screenSize: viewports[size], theme }, async page => {
          const openSplitPanelSelector =
            size === 'mobile'
              ? splitPanel.findOpenPanelBottom().toSelector()
              : splitPanel.findOpenPanelSide().toSelector();

          await expect(page.isDisplayed(openSplitPanelSelector)).resolves.toBe(false);

          // The first time the split panel opens, animations are disabled. The second time they should be enabled.
          // Test both cases by opening and closing twice.
          await times(2, async () => {
            await page.click(openButtonSelector);
            await page.waitForVisible(openSplitPanelSelector);
            // Wait for a reasonable time for animations to finish, to avoid trying to click a moving target
            // (the close button is inside the split panel itself, which might be expanding at ths point)
            await new Promise(resolve => setTimeout(resolve, 500));
            await page.click(closeButtonSelector);
            await page.waitForVisible(openSplitPanelSelector, false);
          });
        })
      );
    });
  });
});
