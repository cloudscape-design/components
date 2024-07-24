// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import wrapper from '../../../../../lib/components/test-utils/selectors';

interface ExtendedWindow extends Window {
  __loadMoreCalls?: number;
}
declare const window: ExtendedWindow;

const elementWrapper = wrapper();

class OptionsListPageObject extends BasePageObject {
  public loadMoreCallsCount(): Promise<number> {
    return this.browser.execute(() => {
      return window.__loadMoreCalls || 0;
    });
  }
  public getTrigger(): string {
    return elementWrapper.find('#trigger').toSelector();
  }
  public getListElement(): string {
    return elementWrapper.find('#list').toSelector();
  }
}

describe('OptionList "LoadMore" Event', () => {
  test(
    'fires loadMore event when the content is scrolled to the end',
    useBrowser(async browser => {
      await browser.url('#/light/options-list/simple');
      const page = new OptionsListPageObject(browser);
      await page.waitForVisible(page.getTrigger());
      await page.click(page.getTrigger());
      await page.elementScrollTo(page.getListElement(), { top: 1500 });
      await page.waitForAssertion(async () => expect(await page.loadMoreCallsCount()).toBeGreaterThan(0));
    })
  );
});
