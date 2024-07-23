// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import ButtonDropdownPage from '../../__integ__/page-objects/button-dropdown-page';

const setupTest = (
  expandToViewport: boolean,
  testFn: (page: ButtonDropdownPage) => Promise<void>,
  id = 'topLeftDropdown'
) => {
  return useBrowser(async browser => {
    const page = new ButtonDropdownPage(id, browser);
    await browser.url('#/light/button-dropdown/expandable');
    await page.waitForVisible(page.getTrigger());
    if (expandToViewport) {
      await page.click('#expandToViewport');
    }
    await testFn(page);
  });
};
const mobileDimensions = { width: 600, height: 600 };
describe.each([true, false])(
  'ButtonDropdown expandableGroups property (with expandToViewport=%s)',
  (expandToViewport: boolean) => {
    test(
      'groups are initially closed',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        expect(await page.getItemCount('category1Subitem1')).toEqual(0);
        expect(await page.getItemCount('category2Subitem1')).toEqual(0);
      })
    );
    test(
      'group expands when you click on the header',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        await page.toggleGroup('category1');
        expect(await page.getItemCount('category1Subitem1')).toEqual(1);
      })
    );
    test(
      'more items are rendered when group is expanded',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        const visibleItemsBefore = await page.getAllItemsCount();
        await page.toggleGroup('category1');
        const visibleItemsAfter = await page.getAllItemsCount();
        expect(visibleItemsBefore).toBeLessThan(visibleItemsAfter);
      })
    );
    test(
      'group collapses when you expand another group',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        await page.toggleGroup('category1');
        await page.toggleGroup('category2');
        expect(await page.getItemCount('category1Subitem1')).toEqual(0);
        expect(await page.getItemCount('category2Subitem1')).toEqual(1);
      })
    );
    test(
      'group collapses when you click on the header of the opened group',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        await page.toggleGroup('category1');
        await page.toggleGroup('category1');
        expect(await page.getItemCount('category1Subitem1')).toEqual(0);
      })
    );
    test(
      'left-aligned dropdown opens group to the right',
      setupTest(expandToViewport, async page => {
        await page.openDropdown();
        await page.toggleGroup('category1');
        const { right: triggerRight } = await page.getBoundingBox(page.getCategoryItem('category1'));
        const { right: itemRight, left: itemLeft } = await page.getBoundingBox(page.getItem('category1Subitem1'));
        expect(itemRight).toBeGreaterThan(triggerRight);
        expect(itemLeft).toEqual(triggerRight);
      })
    );
    test(
      'right-aligned dropdown opens group to the left',
      setupTest(
        expandToViewport,
        async page => {
          await page.openDropdown();
          await page.toggleGroup('category1');
          const { left: triggerLeft } = await page.getBoundingBox(page.getCategoryItem('category1'));
          const { right: itemRight, left: itemLeft } = await page.getBoundingBox(page.getItem('category1Subitem1'));
          expect(itemLeft).toBeLessThan(triggerLeft);
          expect(itemRight).toEqual(triggerLeft);
        },
        'topRightDropdown'
      )
    );
    describe('keyboard interactions', () => {
      test(
        'header gets focus when using arrow keys',
        setupTest(expandToViewport, async page => {
          await page.focusOnTheTrigger();
          await page.keys(['Enter']);
          expect(await page.getFocusedElementText()).toBe('category1');
        })
      );
      describe.each(['ArrowRight', 'ArrowLeft'])('pressing %s', (key: string) => {
        test(
          'on a focused group header expands the group and focuses the first item',
          setupTest(expandToViewport, async page => {
            await page.focusOnTheTrigger();
            await page.keys(['Enter', key]);

            expect(await page.getFocusedElementText()).toBe('Sub item 0');
            expect(await page.getHighlightedElementText()).toBe('Sub item 0');
          })
        );
        test(
          'does not expand disabled group header',
          setupTest(expandToViewport, async page => {
            await page.focusOnTheTrigger();
            await page.keys(['Enter', ...new Array(13).fill('ArrowDown'), key]);

            expect(await page.getFocusedElementText()).toBe('category4');
          })
        );
        test(
          'twice collapses expanded group',
          setupTest(expandToViewport, async page => {
            await page.focusOnTheTrigger();
            await page.keys(['Enter', key, key]);
            expect(await page.getFocusedElementText()).toBe('category1');
          })
        );
      });
      test(
        'moves focus inside the flyout and does not go out of the flyout',
        setupTest(expandToViewport, async page => {
          await page.focusOnTheTrigger();
          await page.keys(['Enter', 'ArrowLeft']);
          expect(await page.getFocusedElementText()).toBe('Sub item 0');
          expect(await page.getHighlightedElementText()).toBe('Sub item 0');

          await page.keys('ArrowDown');
          expect(await page.getFocusedElementText()).toBe('Sub item 1');
          expect(await page.getHighlightedElementText()).toBe('Sub item 1');

          await page.keys('ArrowDown');
          //there are only two items in the list, so we cannot move farther
          expect(await page.getFocusedElementText()).toBe('Sub item 1');
          expect(await page.getHighlightedElementText()).toBe('Sub item 1');
        })
      );
      test(
        'expanding the category in constrained view does not move the focus',
        setupTest(expandToViewport, async page => {
          await page.setWindowSize(mobileDimensions);
          await page.focusOnTheTrigger();
          await page.keys('Enter');
          // expand first group
          await page.keys('Enter');
          expect(await page.getFocusedElementText()).toBe('category1');
        })
      );
      test(
        'does not expand category within mobile dimensions',
        setupTest(expandToViewport, async page => {
          await page.setWindowSize(mobileDimensions);
          await page.focusOnTheTrigger();
          await page.keys(['Enter', ...new Array(13).fill('ArrowDown'), 'Enter', 'ArrowDown']);
          expect(await page.getFocusedElementText()).toBe('Item 10');
        })
      );
      test(
        'Up/Down arrows move focus out of the group in the constrained view',
        setupTest(expandToViewport, async page => {
          await page.setWindowSize(mobileDimensions);
          await page.focusOnTheTrigger();
          // open dropdown, expand first group and go to second element
          await page.keys(['Enter', 'Enter', 'ArrowDown', 'ArrowDown']);
          expect(await page.getFocusedElementText()).toBe('Sub item 1');
          await page.keys('ArrowDown');
          expect(await page.getFocusedElementText()).toBe('category2');
        })
      );
      test(
        'Opening different category collapses already opened one',
        setupTest(expandToViewport, async page => {
          await page.setWindowSize(mobileDimensions);
          await page.focusOnTheTrigger();
          await page.keys(['Enter']);
          // expand first group, move down till the end of the group
          await page.keys(['Enter', 'ArrowDown', 'ArrowDown']);
          expect(await page.getFocusedElementText()).toBe('Sub item 1');
          // move to the next group, expand it, move one item down
          await page.keys(['ArrowDown', 'Enter', 'ArrowDown']);
          expect(await page.getFocusedElementText()).toBe('Cat 2 Sub item 0');
          expect(await page.getItemCount('category1Subitem1')).toEqual(0);
        })
      );
      test(
        'focus is moved to trigger when dropdown is closed',
        setupTest(expandToViewport, async page => {
          await page.focusOnTheTrigger();
          await page.keys(['Esc']);
          expect(await page.getFocusedElementText()).toBe('Dropdown items 1');
        })
      );

      describe.each(['Escape', 'Space', 'Enter'])('pressing %s', (key: string) => {
        test(
          'moves focus to the trigger',
          setupTest(expandToViewport, async page => {
            await page.focusOnTheTrigger();
            await page.keys(['Enter', 'ArrowDown', 'ArrowDown', key]);
            expect(await page.getFocusedElementText()).toBe('Dropdown items 1');
          })
        );
      });

      test(
        'focus is moved to next element on the page when pressing Tab',
        setupTest(expandToViewport, async page => {
          await page.focusOnTheTrigger();
          await page.keys(['Enter', 'Tab']);
          expect(await page.getFocusedElementText()).toBe('Dropdown items 2');
        })
      );
      describe.each(['Escape', 'Tab'])('pressing %s when expanded category is open', (key: string) => {
        test(
          'collapses expanded category when dropdown is reopen',
          setupTest(expandToViewport, async page => {
            await page.focusOnTheTrigger();
            await page.keys(['Enter', 'ArrowLeft']);
            expect(await page.getItemCount('item0')).toEqual(1);
            expect(await page.getItemCount('category1Subitem1')).toEqual(1);
            await page.keys(key);
            await page.keys('Enter');
            expect(await page.getItemCount('item0')).toEqual(1);
            expect(await page.getItemCount('category1Subitem1')).toEqual(0);
          })
        );
      });
    });

    describe('Mixing keyboard and mouse interactions', () => {
      test(
        'Child dropdown which was opened by click should be used when navigating with keyboard',
        setupTest(expandToViewport, async page => {
          await page.openDropdown();
          await page.toggleGroup('category2');
          expect(await page.getItemCount('category2Subitem1')).toEqual(1);
          await page.keys(['ArrowDown']);
          expect(await page.getItemCount('category2Subitem2')).toEqual(1);
          expect(await page.getFocusedElementText()).toBe('Cat 2 Sub item 1');
        })
      );
      test(
        'Child dropdown which was opened by keyboard, should be closed when opening another category with mouse click',
        setupTest(expandToViewport, async page => {
          await page.focusOnTheTrigger();
          await page.keys(['Enter', 'ArrowRight', 'ArrowDown']);
          expect(await page.getItemCount('category1Subitem1')).toEqual(1);
          await page.toggleGroup('category3');
          expect(await page.getItemCount('category1Subitem1')).toEqual(0);
          expect(await page.getItemCount('category3Subitem1')).toEqual(1);
        })
      );
      test(
        'when opening dropdown with mouse and navigating with keyboard',
        setupTest(expandToViewport, async page => {
          await page.openDropdown();
          await expect(page.isDropdownOpen()).resolves.toBe(true);
          await page.keys(['ArrowDown']);
          expect(await page.getFocusedElementText()).toBe('category2');
        })
      );
    });
  }
);
