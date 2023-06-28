// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { CardsWrapper } from '../../../lib/components/test-utils/selectors';

class CardsPage extends BasePageObject {
  wrapper = new CardsWrapper(createWrapper('body').find(`.${CardsWrapper.rootSelector}`).getElement());
  selectWrapper = createWrapper('body').findSelect();

  getCardsPerRow = async () => {
    const { width: cardWidth } = await this.getBoundingBox(this.wrapper.findItems().get(1).toSelector());
    const { width: containerWidth } = await this.getBoundingBox(this.wrapper.toSelector());
    return Math.round(containerWidth / cardWidth);
  };

  testCardsPerRow = async (width: number, cardsPerRow: number) => {
    await this.setWindowSize({ width, height: 500 });
    await this.waitForJsTimers();
    await expect(this.getCardsPerRow()).resolves.toEqual(cardsPerRow);
  };

  selectCardsPerRow = async (index: number) => {
    await this.click(this.selectWrapper.toSelector());
    await this.click(
      this.selectWrapper
        .findDropdown()
        .findOptionByValue('' + index)
        .toSelector()
    );
  };
}

function setupTest(testFn: (page: CardsPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new CardsPage(browser);
    await browser.url('/#/light/cards/basic');
    await testFn(page);
  });
}

describe('Cards responsiveness', () => {
  test(
    'applies default',
    setupTest(async page => {
      await page.testCardsPerRow(300, 1);
      await page.testCardsPerRow(770, 2);
      await page.testCardsPerRow(1000, 3);
      await page.testCardsPerRow(1300, 4);
      await page.testCardsPerRow(1500, 5);
      await page.testCardsPerRow(2000, 6);
    })
  );
  test(
    'correctly interprets lower bounds',
    setupTest(async page => {
      await page.selectCardsPerRow(1);
      await page.testCardsPerRow(400, 2);
      await page.testCardsPerRow(399, 1);
    })
  );
  test(
    'applies cardsPerRow property changes',
    setupTest(async page => {
      await page.testCardsPerRow(770, 2);
      await page.selectCardsPerRow(2);
      await page.testCardsPerRow(770, 3);
    })
  );
  test(
    'correctly interprets cards layout without minWidth',
    setupTest(async page => {
      await page.selectCardsPerRow(3);
      await page.testCardsPerRow(400, 7);
    })
  );
});
