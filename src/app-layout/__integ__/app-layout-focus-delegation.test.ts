// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const testIf = (condition: boolean) => (condition ? test : test.skip);

const wrapper = createWrapper().findAppLayout();

interface SetupTestObj {
  theme: string;
  pageName: string;
  splitPanelPosition?: string;
  mobile: boolean;
}

function setupTest(
  testFn: (page: BasePageObject) => Promise<void>,
  { theme, pageName = 'with-split-panel', splitPanelPosition = '', mobile = false }: SetupTestObj
) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      visualRefresh: `${theme.startsWith('visual-refresh')}`,
      appLayoutWidget: `${theme === 'visual-refresh-toolbar'}`,
      ...(splitPanelPosition
        ? {
            splitPanelPosition,
          }
        : {}),
    });
    await page.setWindowSize(mobile ? viewports.mobile : viewports.desktop);
    await browser.url(`#/light/app-layout/${pageName}?${params.toString()}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

describe.each(['classic', 'visual-refresh', 'visual-refresh-toolbar'] as const)('%s', theme => {
  [true, false].forEach(mobile =>
    describe(`mobile=${mobile}`, () => {
      test(
        'should not focus panels on page load',
        setupTest(
          async page => {
            await expect(page.isFocused('body')).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile }
        )
      );

      test(
        'split panel focus moves to slider on open and open button on close',
        setupTest(
          async page => {
            const splitPanelOpenActionEl =
              theme === 'visual-refresh-toolbar'
                ? wrapper.findDrawerTriggerById('slide-panel').toSelector()
                : wrapper.findSplitPanel().findOpenButton().toSelector();
            await page.click(splitPanelOpenActionEl);
            await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);
            await page.keys(['Tab', 'Tab']);
            await expect(page.isFocused(wrapper.findSplitPanel().findCloseButton().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(splitPanelOpenActionEl)).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile }
        )
      );

      test(
        'tools panel focus toggles between open and close buttons',
        setupTest(
          async page => {
            await page.click(wrapper.findToolsToggle().toSelector());
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile }
        )
      );

      test(
        'navigation panel focus toggles between open and close buttons',
        setupTest(
          async page => {
            // panel is closed by default on mobile
            if (mobile) {
              await page.click(wrapper.findNavigationToggle().toSelector());
            }
            await page.click(wrapper.findNavigationClose().toSelector());
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findNavigationClose().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findNavigationToggle().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findNavigationClose().toSelector())).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile }
        )
      );

      //todo tools functionality needs to be added to toolbar
      testIf(theme !== 'visual-refresh-toolbar')(
        'focuses tools panel closed button when it is opened using keyboard and caused split panel to change position',
        setupTest(
          async page => {
            await page.setWindowSize({ width: 1000, height: 800 });
            await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
            await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Enter']);
            await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile, splitPanelPosition: 'side' }
        )
      );

      test(
        'focuses tools panel closed button when it is opened using keyboard and caused split panel to change position in toolbar theme',
        setupTest(
          async page => {
            const triggerSelector =
              theme === 'visual-refresh-toolbar'
                ? wrapper.findDrawerTriggerById('slide-panel').toSelector()
                : wrapper.findSplitPanel().findOpenButton().toSelector();
            await page.setWindowSize({ width: 1000, height: 800 });
            await page.click(triggerSelector);
            await page.keys(['Tab', 'Tab', 'Enter']);
            await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
          },
          { pageName: 'with-split-panel', theme, mobile, splitPanelPosition: 'side' }
        )
      );

      test(
        'focuses split panel preferences button when its position changes from bottom to side',
        setupTest(
          async page => {
            await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
            await page.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
            await page.keys(['Tab', 'Right', 'Tab', 'Tab', 'Enter']);
            await expect(page.isFocused(wrapper.findSplitPanel().findPreferencesButton().toSelector())).resolves.toBe(
              true
            );
          },
          { pageName: 'with-split-panel', theme, mobile, splitPanelPosition: 'bottom' }
        )
      );

      test(
        'focuses split panel preferences button when its position changes from side to bottom',
        setupTest(
          async page => {
            await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
            await expect(page.isExisting(wrapper.findSplitPanel().toSelector())).resolves.toBeTruthy();
            await page.keys('Escape'); //escape tooltip from still hovering over open trigger button
            await page.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
            await page.keys(['Tab', 'Left', 'Tab', 'Tab', 'Enter']);
            await expect(page.isFocused(wrapper.findSplitPanel().findPreferencesButton().toSelector())).resolves.toBe(
              true
            );
          },
          { pageName: 'with-split-panel', theme, mobile, splitPanelPosition: 'side' }
        )
      );

      //todo - investigate why resize observer throwing error only on mobile in tests
      testIf(!mobile)(
        'does not focus split panel when opening programatically',
        setupTest(
          async page => {
            const selection = wrapper.findContentRegion().findTable().findRowSelectionArea(1).toSelector();
            await page.click(selection);
            await expect(page.isFocused(selection + ' input')).resolves.toBe(true);
          },
          {
            pageName: 'with-table-and-split-panel',
            theme,
            mobile,
          }
        )
      );

      describe('focus interaction with info links', () => {
        test(
          'moves focus to close button when panel is opened from info link',
          setupTest(
            async page => {
              await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-1"]').toSelector());
              await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-fixed-header-footer', theme, mobile }
          )
        );

        testIf(!mobile)(
          'moves focus to close button when panel content is changed using second info link',
          setupTest(
            async page => {
              await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-1"]').toSelector());
              await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-2"]').toSelector());
              await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-fixed-header-footer', theme, mobile }
          )
        );

        testIf(!mobile)(
          'moves focus back to last opened info link when panel is closed',
          setupTest(
            async page => {
              await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-1"]').toSelector());
              const infoLink = wrapper.findContentRegion().findLink('[data-testid="info-link-2"]').toSelector();
              await page.click(infoLink);
              await page.click(wrapper.findToolsClose().toSelector());
              await expect(page.isFocused(infoLink)).resolves.toBe(true);
            },
            { pageName: 'with-fixed-header-footer', theme, mobile }
          )
        );

        testIf(!mobile)(
          'does not move focus back to last opened info link when panel has lost focus - instead focuses tools toggle',
          setupTest(
            async page => {
              const infoLink = wrapper.findContentRegion().findLink('[data-testid="info-link-2"]').toSelector();
              await page.click(infoLink);
              await page.click(wrapper.findContentRegion().findContainer().toSelector());
              await page.click(wrapper.findToolsClose().toSelector());
              await expect(page.isFocused(infoLink)).resolves.toBe(false);
              await expect(page.isFocused(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-fixed-header-footer', theme, mobile }
          )
        );
      });

      test(
        'drawers focus toggles between open and close buttons',
        setupTest(
          async page => {
            //Altermatomg between triggers because test-1 trigger hidden in overflow menu on mobile,
            //security has resize button on desktop
            const triggerSelector = wrapper.findDrawerTriggerById(mobile ? 'security' : 'test-1').toSelector();
            await page.click(triggerSelector);
            await page.keys('Enter');
            await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
          },
          { pageName: 'with-drawers', theme, mobile }
        )
      );

      test(
        'split panel focus toggles between open and close buttons',
        setupTest(
          async page => {
            //Alternating between triggers because test-1 trigger hidden in overflow menu on mobile,
            const triggerSelector =
              theme === 'visual-refresh-toolbar'
                ? wrapper.findDrawerTriggerById('slide-panel').toSelector()
                : wrapper.findSplitPanel().findOpenButton().toSelector();
            await page.click(triggerSelector);
            await page.isFocused(wrapper.findSplitPanel().findSlider().toSelector());
            await page.keys(['Tab', 'Tab']);
            await expect(page.isFocused(wrapper.findSplitPanel().findCloseButton().toSelector())).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
            await page.keys('Enter');
            await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);
          },
          { pageName: 'with-drawers', theme, mobile }
        )
      );

      describe('drawer focus interaction with tools buttons', () => {
        //todo resolve focus on mobile issue returning to previously focued element on mobile for drawer open button
        testIf(!(theme === 'visual-refresh-toolbar' && mobile))(
          'moves focus to close button when panel is opened from button',
          setupTest(
            async page => {
              await page.click(
                wrapper.findContentRegion().findButton('[data-testid="open-drawer-button-2"]').toSelector()
              );
              await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBe(true);
              await page.keys('Enter');
              await expect(
                page.isFocused(
                  wrapper.findContentRegion().findButton('[data-testid="open-drawer-button-2"]').toSelector()
                )
              ).resolves.toBe(true);
            },
            { pageName: 'with-drawers', theme, mobile }
          )
        );

        //tests not relevant for mobile, as panel overlays content
        testIf(!mobile)(
          'moves focus to close button when panel content is changed using second button',
          setupTest(
            async page => {
              await page.click(
                wrapper.findContentRegion().findButton('[data-testid="open-drawer-button"]').toSelector()
              );
              await page.click(
                wrapper.findContentRegion().findButton('[data-testid="open-drawer-button-2"]').toSelector()
              );
              await page.keys('Tab');
              await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-drawers', theme, mobile }
          )
        );

        testIf(!mobile)(
          'moves focus back to last opened button when panel is closed',
          setupTest(
            async page => {
              if (!mobile) {
                await page.click(
                  wrapper.findContentRegion().findButton('[data-testid="open-drawer-button"]').toSelector()
                );
              }
              await page.click(
                wrapper.findContentRegion().findButton('[data-testid="open-drawer-button-2"]').toSelector()
              );

              await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
              await expect(
                page.isFocused(
                  wrapper.findContentRegion().findButton('[data-testid="open-drawer-button-2"]').toSelector()
                )
              ).resolves.toBe(true);
            },
            { pageName: 'with-drawers', theme, mobile }
          )
        );

        //tests not relevant for mobile, as panel overlays content
        testIf(!mobile)(
          'does not move focus back to last opened button when panel has lost focus - instead focuses drawer trigger',
          setupTest(
            async page => {
              const infoLink = wrapper
                .findContentRegion()
                .findButton('[data-testid="open-drawer-button-2"]')
                .toSelector();
              await page.click(infoLink);
              await page.click(wrapper.findContentRegion().findContainer().toSelector());
              await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
              await expect(page.isFocused(infoLink)).resolves.toBe(false);
              await expect(page.isFocused(wrapper.findDrawerTriggerById('pro-help').toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-drawers', theme, mobile }
          )
        );
      });
    })
  );
});
