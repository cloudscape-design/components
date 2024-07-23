// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { CardsWrapper, ContainerWrapper } from '../../../lib/components/test-utils/selectors';

export default class StickyHeaderCardsPage extends BasePageObject {
  wrapper = new CardsWrapper(createWrapper('body').find(`.${CardsWrapper.rootSelector}`).getElement());
  containerWrapper = new ContainerWrapper(this.wrapper.find(`.${ContainerWrapper.rootSelector}`).getElement());

  findCardsHeader() {
    return this.containerWrapper.findHeader();
  }

  async navigateToPage(compact?: boolean) {
    let url = '/#/light/cards/sticky-header?visualRefresh=false';
    if (compact) {
      url += '&density=compact';
    }
    await this.browser.url(url);
  }
}

function setupTest(testFn: (page: StickyHeaderCardsPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new StickyHeaderCardsPage(browser);
    await page.navigateToPage();
    await testFn(page);
  });
}

function contains(parent: ElementRect, child: ElementRect, offset = { top: 0 }) {
  return (
    parent.top - offset.top <= child.top &&
    parent.right >= child.right &&
    parent.bottom >= child.bottom &&
    parent.left <= child.left
  );
}

describe('Cards Sticky Header', () => {
  const overflowParent = '#overflow-parent';
  const scrollTopToBtn = '#scroll-to-top-btn';
  const toggleStickinessBtn = '#toggle-stickiness-btn';
  const toggleVerticalOffsetBtn = '#toggle-vertical-offset-btn';
  const overflowParentPageHeight = 300;
  const verticalOffset = 50;

  test(
    'non-sticky header is not visible when scrolling',
    setupTest(async page => {
      await page.click(toggleStickinessBtn);
      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      const headerRect = await page.getBoundingBox(page.findCardsHeader().toSelector());
      const overflowRect = await page.getBoundingBox(overflowParent);
      expect(contains(overflowRect, headerRect)).toBe(false);
    })
  );

  test(
    'sticky header stays visible when scrolling',
    setupTest(async page => {
      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      const headerRect = await page.getBoundingBox(page.findCardsHeader().toSelector());
      const overflowRect = await page.getBoundingBox(overflowParent);
      expect(contains(overflowRect, headerRect)).toBe(true);
    })
  );

  test(
    "scrollToTop doesn't scroll when not sticky",
    setupTest(async page => {
      await page.click(toggleStickinessBtn);
      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      await page.click(scrollTopToBtn);

      expect(page.getElementScroll(overflowParent)).resolves.toEqual(
        expect.objectContaining({ top: 2 * overflowParentPageHeight })
      );
    })
  );

  test(
    'paragraph above sticky header is not visible when scrolling to top',
    setupTest(async page => {
      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      await page.click(scrollTopToBtn);

      expect(page.getElementScroll(overflowParent)).resolves.toEqual(expect.objectContaining({ top: verticalOffset }));
    })
  );

  test(
    'paragraph above sticky header is not visible when scrolling to top in compact mode',
    setupTest(async page => {
      await page.navigateToPage(true);
      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      await page.click(scrollTopToBtn);

      expect(page.getElementScroll(overflowParent)).resolves.toEqual(expect.objectContaining({ top: verticalOffset }));
    })
  );

  test(
    'sticky header keeps vertical offset when scrolling',
    setupTest(async page => {
      await page.click(toggleVerticalOffsetBtn);

      await page.elementScrollTo(overflowParent, { top: 2 * overflowParentPageHeight });

      const headerTop = (await page.getBoundingBox(page.findCardsHeader().toSelector())).top;
      const overflowParentTop = (await page.getBoundingBox(overflowParent)).top;
      const diff = headerTop - overflowParentTop;
      expect(diff).toEqual(verticalOffset);
    })
  );

  test(
    'reveals cards when focused underneath sticky header',
    setupTest(async page => {
      await page.click(page.findCardsHeader().findTextFilter().findInput().toSelector());
      await page.keys(['Tab']);
      await page.elementScrollTo(overflowParent, { top: 80 });

      await page.keys(['ArrowDown']);

      const headerRect = await page.getBoundingBox(page.findCardsHeader().toSelector());
      const itemRect = await page.getBoundingBox(page.wrapper.findItems().get(2).toSelector());
      expect(itemRect.top).toBeGreaterThanOrEqual(headerRect.bottom);
    })
  );
});
