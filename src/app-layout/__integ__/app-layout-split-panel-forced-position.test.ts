// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { scrollbarThickness } from '../../__integ__/scrollbars';
import { viewports } from './constants';
import { AppLayoutSplitViewPage } from './utils';

interface SetupTestOptions {
  scrollbarDisplayCondition: string;
  theme: string;
  initialViewportWidth: number;
}

const setupTest = (
  { scrollbarDisplayCondition, theme, initialViewportWidth }: SetupTestOptions,
  testFn: (page: AppLayoutSplitViewPage) => Promise<void>
) =>
  useBrowser(async browser => {
    const params = new URLSearchParams({
      visualRefresh: `${theme.startsWith('refresh')}`,
      appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
      scrollbarDisplayCondition,
    });

    const page = new AppLayoutSplitViewPage(browser);
    await page.setWindowSize({ ...viewports.desktop, width: initialViewportWidth });

    const url = `#/light/app-layout/with-split-panel-and-body-scroll?${params.toString()}`;

    await browser.url(url);
    const content = createWrapper().findAppLayout().findContentRegion().find('h1');
    await page.waitForVisible(content.toSelector());
    await testFn(page);
  });

describe('Split panel forced position', () => {
  describe.each(['classic', 'refresh', 'refresh-toolbar'] as const)('%s', theme => {
    // Viewport width which makes the split panel switch to the bottom
    const splitPanelBreakpoints = {
      classic: 979,
      refresh: 1030,
      'refresh-toolbar': 907,
    };

    const narrow = splitPanelBreakpoints[theme];

    // Account 2 times for scrollbarThickness:
    // once for the threshold we give to the logic to decide when to transition to the side,
    // and once for the cases where there is a "real" scrollbar taking up actual space.
    const wide = narrow + scrollbarThickness * 2 + 1;

    const cases: [
      string,
      { scrollbarDisplayCondition: string; scrollbarWhenOnSide: boolean; scrollbarWhenOnBottom: boolean },
    ][] = [
      [
        'without page-level scrollbar',
        {
          scrollbarDisplayCondition: 'never',
          scrollbarWhenOnSide: false,
          scrollbarWhenOnBottom: false,
        },
      ],
      [
        'with page-level scrollbar',
        {
          scrollbarDisplayCondition: 'always',
          scrollbarWhenOnSide: true,
          scrollbarWhenOnBottom: true,
        },
      ],
      [
        'with page-level scrollbar appearing only when split panel is at the bottom',
        {
          scrollbarDisplayCondition: 'bottom',
          scrollbarWhenOnSide: false,
          scrollbarWhenOnBottom: true,
        },
      ],
      [
        'with page-level scrollbar appearing only when split panel is on the side',
        {
          scrollbarDisplayCondition: 'side',
          scrollbarWhenOnSide: true,
          scrollbarWhenOnBottom: false,
        },
      ],
    ];

    describe.each(cases)(
      '%s',
      (_description, { scrollbarWhenOnSide, scrollbarWhenOnBottom, scrollbarDisplayCondition }) => {
        test(
          'transitions from side to bottom',
          setupTest({ scrollbarDisplayCondition, theme, initialViewportWidth: wide }, async page => {
            // Open split panel and ensure it is on the side.
            await expect(page.verifySplitPanelPosition('side')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnSide);

            // Split panel transitions to the bottom when not enough horizontal space.
            for (let newWidth = wide; newWidth >= narrow; newWidth--) {
              await page.setWindowSize({ ...viewports.desktop, width: newWidth });
            }
            await expect(page.verifySplitPanelPosition('bottom')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnBottom);
          })
        );

        test(
          'transitions from bottom to side',
          setupTest({ scrollbarDisplayCondition, theme, initialViewportWidth: narrow }, async page => {
            // Open split panel and ensure it is forced to the bottom.
            await expect(page.verifySplitPanelPosition('bottom')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnBottom);

            // Split panel transitions to the side when enough horizontal space.
            for (let newWidth = narrow; newWidth <= wide; newWidth++) {
              await page.setWindowSize({ ...viewports.desktop, width: newWidth });
            }
            await expect(page.verifySplitPanelPosition('side')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnSide);
          })
        );
      }
    );
  });
});
