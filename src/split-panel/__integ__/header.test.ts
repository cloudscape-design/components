// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from '../../app-layout/__integ__/constants';
import { getUrlParams } from '../../app-layout/__integ__/utils';

const wrapper = createWrapper().findAppLayout();
const url = '#/light/app-layout/split-panel-with-custom-header';

describe.each(['refresh', 'refresh-toolbar'] as const)('%s', theme => {
  describe.each(['desktop', 'mobile'] as const)('%s', viewport => {
    function setupTest(testFn: (page: BasePageObject) => Promise<void>, params = {}) {
      return useBrowser(async browser => {
        const page = new BasePageObject(browser);
        await page.setWindowSize(viewports[viewport]);
        await browser.url(`${url}?${getUrlParams(theme, params)}`);
        await page.waitForVisible(wrapper.findContentRegion().toSelector());
        await testFn(page);
      });
    }

    describe('only the expand button is clickable in collapsed bottom split panel when certain header slots are populated', () => {
      const cases = [
        { slotName: 'headerActions', devPageParam: 'renderActions' },
        { slotName: 'headerInfo', devPageParam: 'renderInfoLink' },
      ];
      test.each(cases)('$slotName', ({ devPageParam }) =>
        setupTest(
          async page => {
            await page.click(wrapper.findSplitPanel().findHeader().toSelector()); // Click on the header text
            await expect(
              page.isDisplayedInViewport(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())
            ).resolves.toBe(false);
            await page.click(wrapper.findSplitPanelOpenButton().toSelector());
            await expect(
              page.isDisplayedInViewport(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())
            ).resolves.toBe(true);
          },
          { [devPageParam]: true }
        )()
      );
    });

    test(
      'the entire header is clickable in collapsed bottom split panel even if headerDescription slot is populated',
      setupTest(
        async page => {
          await page.click(wrapper.findSplitPanel().findHeader().toSelector()); // Click on the header text
          await expect(
            page.isDisplayedInViewport(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())
          ).resolves.toBe(true);
          await expect(
            page.isDisplayedInViewport(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())
          ).resolves.toBe(true);
        },
        { headerDescription: true }
      )
    );
  });
});
