// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { viewports } from './constants';

interface SetupTestOptions {
  splitPanelPosition?: string;
  screenSize?: (typeof viewports)['desktop' | 'mobile'];
  disableContentPaddings?: string;
  theme: string;
}

const setupTest = (
  { screenSize = viewports.desktop }: SetupTestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) =>
  useBrowser(screenSize, async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      appLayoutWidget: 'true',
      appLayoutDelayedWidget: 'true',
      visualRefresh: 'true',
      appLayoutToolbar: 'true',
    }).toString();
    await browser.url(`#/light/app-layout/runtime-drawers?${params}`);
    await testFn(page);
  });

describe.each(['refresh-toolbar'] as const)('%s', theme => {
  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    test(
      'main content area layout should not shift after loading the widget part of the page',
      setupTest(
        {
          theme,
          screenSize: size === 'desktop' ? viewports.desktop : viewports.mobile,
        },
        async page => {
          // make sure the widget part has not loaded yet
          const { top: contentTopBefore, left: contentLeftBefore } = await page.getBoundingBox(
            `[data-awsui-app-layout-widget-loaded="false"] [data-testid="app-layout-content-area"]`
          );

          const { top: contentTopAfter, left: contentLeftAfter } = await page.getBoundingBox(
            `[data-awsui-app-layout-widget-loaded="true"] [data-testid="app-layout-content-area"]`
          );

          expect(contentTopBefore).toBe(contentTopAfter);
          expect(contentLeftBefore).toBe(contentLeftAfter);
        }
      )
    );
  });
});
