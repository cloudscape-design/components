// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function setupPage(url: string, testFn: (page: CustomPropertyPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new CustomPropertyPageObject(browser);
    await browser.url(url);
    await testFn(page);
  });
}

class CustomPropertyPageObject extends BasePageObject {
  async getCustomPropertyMap(selector?: string): Promise<Record<string, string>> {
    const map = await this.browser.executeAsync(
      (sel: string | undefined, done: (result: Record<string, string>) => void) => {
        const element = sel ? document.querySelector(sel) : document.documentElement;
        const result: Record<string, string> = {};
        // .computedStyleMap() only exists as an experimental feature, but it allows to retrieve
        // all custom properties at once in contrast to .getComputedStyle()
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/computedStyleMap
        for (const [prop, value] of (element as any).computedStyleMap()) {
          // Custom Property
          if (prop.startsWith('--')) {
            const valueWithoutPostfix = prop.replace(/^--/, '').replace(/-[\d\w]+$/, '');
            result[valueWithoutPostfix] = value[0][0];
          }
        }
        done(result);
      },
      selector
    );
    return map;
  }
}

describe('CSS Custom Properties', () => {
  test.each<[string, string, string?]>([
    ['light', '#/?visualRefresh=false&mode=light'],
    ['dark', '#/?visualRefresh=false&mode=dark'],
    ['compact', '#/?visualRefresh=false&density=compact'],
    // use motionDisabled to force design tokens into expected values
    ['reduced-motion', '#/?visualRefresh=false&motionDisabled=true'],
    ['visual-refresh', '#/?visualRefresh=true'],
    ['visual-refresh-dark', '#/?visualRefresh=true&mode=dark'],
    ['visual-refresh-compact', '#/?visualRefresh=true&density=compact'],
    [
      'visual-refresh-content-header',
      'visual-contexts/content-header/?visualRefresh=true&mode=light',
      '.awsui-context-content-header',
    ],
  ])('match previous snapshot for mode %p', (_, url, selector = 'body') =>
    setupPage(url, page => expect(page.getCustomPropertyMap(selector)).resolves.toMatchSnapshot())()
  );
});
