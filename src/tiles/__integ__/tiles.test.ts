// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findTiles();

class TilesPage extends BasePageObject {
  async selectTile(value: string) {
    await this.click(wrapper.findInputByValue(value).toSelector());
  }

  isValueSelected(value: string) {
    return this.isSelected(wrapper.findInputByValue(value).toSelector());
  }
}

const setupTest = (testFn: (page: TilesPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TilesPage(browser);
    await browser.url('#/light/tiles/simple');
    await page.waitForVisible(wrapper.findItems().toSelector());
    await testFn(page);
  });
};

test(
  'Initial value correctly applied',
  setupTest(async page => {
    await expect(page.isValueSelected('bar')).resolves.toBe(true);
  })
);

test(
  'Value is correctly updated',
  setupTest(async page => {
    await page.selectTile('boo');

    await expect(page.isValueSelected('boo')).resolves.toBe(true);
    await expect(page.isValueSelected('bar')).resolves.toBe(false);
  })
);

test(
  'Only one value is selected at a time',
  setupTest(async page => {
    for (const selectedItem of ['foo', 'bar', 'boo']) {
      await page.selectTile(selectedItem);

      await expect(page.isValueSelected('foo')).resolves.toBe('foo' === selectedItem);
      await expect(page.isValueSelected('bar')).resolves.toBe('bar' === selectedItem);
      await expect(page.isValueSelected('boo')).resolves.toBe('boo' === selectedItem);
    }
  })
);

test(
  'Disabled item cannot be selected',
  setupTest(async page => {
    await page.selectTile('baz');
    await expect(page.isValueSelected('bar')).resolves.toBe(true);
    await expect(page.isValueSelected('baz')).resolves.toBe(false);
  })
);
