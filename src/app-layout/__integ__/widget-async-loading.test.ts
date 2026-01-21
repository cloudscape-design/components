// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { viewports } from './constants';
import { getUrlParams } from './utils';

describe.each(['desktop', 'mobile'] as const)('%s', size => {
  test(
    'main content area layout should not shift after loading the widget part of the page',
    useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
      const page = new BasePageObject(browser);
      await browser.url(
        `#/app-layout/runtime-drawers?${getUrlParams('refresh-toolbar', {
          appLayoutWidget: 'true',
          appLayoutDelayedWidget: 'true',
        })}`
      );
      // make sure the widget part has not loaded yet
      const { top: contentTopBefore, left: contentLeftBefore } = await page.getBoundingBox(
        `[data-awsui-app-layout-widget-loaded="false"] [data-testid="app-layout-content-area"]`
      );

      const { top: contentTopAfter, left: contentLeftAfter } = await page.getBoundingBox(
        `[data-awsui-app-layout-widget-loaded="true"] [data-testid="app-layout-content-area"]`
      );

      expect(contentTopBefore).toBe(contentTopAfter);
      expect(contentLeftBefore).toBe(contentLeftAfter);
    })
  );
});
