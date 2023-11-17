// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();

function setupTest(
  testFn: (page: BasePageObject) => Promise<void>,
  { pageName = 'with-split-panel', visualRefresh = false, splitPanelPosition = '', mobile = false }
) {
  return useBrowser(async browser => {
    const url = `#/light/app-layout/${pageName}?visualRefresh=${visualRefresh}${
      splitPanelPosition ? `&splitPanelPosition=${splitPanelPosition}` : ''
    }`;
    const page = new BasePageObject(browser);
    await page.setWindowSize(mobile ? viewports.mobile : viewports.desktop);
    await browser.url(url);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

[true, false].forEach(visualRefresh =>
  describe(`visualRefresh=${visualRefresh}`, () => {
    [true, false].forEach(mobile =>
      describe(`mobile=${mobile}`, () => {
        test(
          'should not focus panels on page load',
          setupTest(
            async page => {
              await expect(page.isFocused('body')).resolves.toBe(true);
            },
            { pageName: 'with-split-panel', visualRefresh, mobile }
          )
        );
        test(
          'split panel focus moves to slider on open and open button on close',
          setupTest(
            async page => {
              await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
              await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);
              await page.keys(['Tab', 'Tab']);
              await expect(page.isFocused(wrapper.findSplitPanel().findCloseButton().toSelector())).resolves.toBe(true);
              await page.keys('Enter');
              await expect(page.isFocused(wrapper.findSplitPanel().findOpenButton().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-split-panel', visualRefresh, mobile }
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
            { pageName: 'with-split-panel', visualRefresh, mobile }
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
            { pageName: 'with-split-panel', visualRefresh, mobile }
          )
        );

        test(
          'drawers focus toggles between open and close buttons',
          setupTest(
            async page => {
              const triggerSelector = wrapper.findDrawerTriggerById('pro-help').toSelector();
              await page.click(triggerSelector);
              await page.keys('Enter');
              await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
              await page.keys('Enter');
              await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBe(true);
              await page.keys('Enter');
              await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
            },
            { pageName: 'with-drawers', visualRefresh, mobile }
          )
        );

        test(
          'focuses tools panel closed button when it is opened using keyboard and caused split panel to change position',
          setupTest(
            async page => {
              await page.setWindowSize({ width: 1000, height: 800 });
              await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
              await page.keys(['Tab', 'Tab', 'Tab', 'Enter']);
              await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
            },
            { pageName: 'with-split-panel', visualRefresh, mobile, splitPanelPosition: 'side' }
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
            { pageName: 'with-split-panel', visualRefresh, mobile, splitPanelPosition: 'bottom' }
          )
        );

        test(
          'focuses split panel preferences button when its position changes from side to bottom',
          setupTest(
            async page => {
              await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
              await page.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
              await page.keys(['Tab', 'Left', 'Tab', 'Tab', 'Enter']);
              await expect(page.isFocused(wrapper.findSplitPanel().findPreferencesButton().toSelector())).resolves.toBe(
                true
              );
            },
            { pageName: 'with-split-panel', visualRefresh, mobile, splitPanelPosition: 'side' }
          )
        );

        test(
          'does not focus split panel when opening programatically',
          setupTest(
            async page => {
              const selection = wrapper.findContentRegion().findTable().findRowSelectionArea(1).toSelector();
              await page.click(selection);
              await expect(page.isFocused(selection + ' input')).resolves.toBe(true);
            },
            {
              pageName: 'with-table-and-split-panel',
              visualRefresh,
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
              { pageName: 'with-fixed-header-footer', visualRefresh, mobile }
            )
          );
          // tests not relevant for mobile, as panel overlays content
          if (!mobile) {
            test(
              'moves focus to close button when panel content is changed using second info link',
              setupTest(
                async page => {
                  await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-1"]').toSelector());
                  await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-2"]').toSelector());
                  await expect(page.isFocused(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
                },
                { pageName: 'with-fixed-header-footer', visualRefresh, mobile }
              )
            );
            test(
              'moves focus back to last opened info link when panel is closed',
              setupTest(
                async page => {
                  await page.click(wrapper.findContentRegion().findLink('[data-testid="info-link-1"]').toSelector());
                  const infoLink = wrapper.findContentRegion().findLink('[data-testid="info-link-2"]').toSelector();
                  await page.click(infoLink);
                  await page.click(wrapper.findToolsClose().toSelector());
                  await expect(page.isFocused(infoLink)).resolves.toBe(true);
                },
                { pageName: 'with-fixed-header-footer', visualRefresh, mobile }
              )
            );
            test(
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
                { pageName: 'with-fixed-header-footer', visualRefresh, mobile }
              )
            );
          }
        });

        describe('drawer focus interaction with buttons', () => {
          test(
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
              { pageName: 'with-drawers', visualRefresh, mobile }
            )
          );
          // tests not relevant for mobile, as panel overlays content
          if (!mobile) {
            test(
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
                { pageName: 'with-drawers', visualRefresh, mobile }
              )
            );
            test(
              'moves focus back to last opened button when panel is closed',
              setupTest(
                async page => {
                  await page.click(
                    wrapper.findContentRegion().findButton('[data-testid="open-drawer-button"]').toSelector()
                  );
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
                { pageName: 'with-drawers', visualRefresh, mobile }
              )
            );
            test(
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
                  await expect(page.isFocused(wrapper.findDrawerTriggerById('pro-help').toSelector())).resolves.toBe(
                    true
                  );
                },
                { pageName: 'with-drawers', visualRefresh, mobile }
              )
            );
          }
        });
      })
    );
  })
);
