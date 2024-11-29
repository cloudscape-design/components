// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import useBrowser from '../../__integ__/use-browser-with-scrollbars';
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
    const content = createWrapper().findAppLayout().findContentRegion();
    await page.waitForVisible(content.toSelector());
    await testFn(page);
  });

describe.each(['classic', 'refresh', 'refresh-toolbar'] as const)('%s', theme => {
  describe('behavior according to presence of scrollbar', () => {
    // Viewport width which makes the split panel switch to the bottom
    const splitPanelBreakpoints = {
      classic: 979,
      refresh: 1030,
      'refresh-toolbar': 907,
    };

    const breakpoint = splitPanelBreakpoints[theme];
    const narrowest = breakpoint - 30;
    const widest = breakpoint + 30;

    const cases: [
      string,
      { scrollbarDisplayCondition: string; scrollbarWhenOnSide: boolean; scrollbarWhenOnBottom: boolean },
    ][] = [
      [
        'page-level scrollbar never appears',
        {
          scrollbarDisplayCondition: 'never',
          scrollbarWhenOnSide: false,
          scrollbarWhenOnBottom: false,
        },
      ],
      [
        'page-level scrollbar always appears',
        {
          scrollbarDisplayCondition: 'always',
          scrollbarWhenOnSide: true,
          scrollbarWhenOnBottom: true,
        },
      ],
      [
        'page-level scrollbar appears only when split panel is at the bottom',
        {
          scrollbarDisplayCondition: 'bottom',
          scrollbarWhenOnSide: false,
          scrollbarWhenOnBottom: true,
        },
      ],
      [
        'page-level scrollbar appears only when split panel is on the side',
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
          'transitions from bottom to side',
          setupTest({ scrollbarDisplayCondition, theme, initialViewportWidth: narrowest }, async page => {
            // Open split panel and ensure it is forced to the bottom.
            await expect(page.verifySplitPanelPosition('bottom')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnBottom);

            // Split panel transitions to the side when enough horizontal space.
            for (let newWidth = narrowest; newWidth <= widest; newWidth++) {
              await page.setWindowSize({ ...viewports.desktop, width: newWidth });
            }
            await expect(page.verifySplitPanelPosition('side')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnSide);
          })
        );

        test(
          'transitions from side to bottom',
          setupTest({ scrollbarDisplayCondition, theme, initialViewportWidth: widest }, async page => {
            // Open split panel and ensure it is on the side.
            await expect(page.verifySplitPanelPosition('side')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnSide);

            // Split panel transitions to the bottom when not enough horizontal space.
            for (let newWidth = widest; newWidth >= narrowest; newWidth--) {
              await page.setWindowSize({ ...viewports.desktop, width: newWidth });
            }
            await expect(page.verifySplitPanelPosition('bottom')).resolves.toBe(true);
            await expect(page.hasPageScrollbar()).resolves.toBe(scrollbarWhenOnBottom);
          })
        );
      }
    );
  });
});
