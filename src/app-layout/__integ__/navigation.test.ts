// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../lib/components/test-utils/selectors';
import useBrowserWithScrollbars from '../../__integ__/use-browser-with-scrollbars';
import { getUrlParams, Theme } from './utils';

const wrapper = createWrapper().findAppLayout().findNavigation();

function setupTest(testFn: (page: BasePageObject) => Promise<void>, theme: Theme) {
  return useBrowserWithScrollbars(async browser => {
    const page = new BasePageObject(browser);
    const params = getUrlParams(theme);
    await browser.url(`#/light/app-layout/navigation-with-scrollbar?${params}`);
    await page.waitForVisible(createWrapper().findSideNavigation().toSelector());
    await testFn(page);
  })();
}

describe('Navigation slot', () => {
  describe('has expected inline size when a scrollbar is present', () => {
    test.each(['classic', 'refresh-toolbar'] as const)('%s', theme =>
      setupTest(async page => {
        const { width } = await page.getBoundingBox(wrapper.toSelector());
        expect(width).toBe(280);
        const navigation = wrapper.findSideNavigation();
        const navigationWidth = (await page.getBoundingBox(navigation.toSelector())).width;
        expect(navigationWidth).toBeLessThan(280);
      }, theme)
    );
  });
});
