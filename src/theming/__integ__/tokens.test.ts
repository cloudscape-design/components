// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { preset } from '../../../lib/components/internal/generated/theming/index.cjs';

class ColorTokensMosaikPage extends BasePageObject {
  async getCustomPropertyMap(): Promise<Record<string, string>> {
    const map = await this.browser.execute(() => {
      const result: Record<string, string> = {};
      // .computedStyleMap() only exists as an experimental feature, but it allows to retrieve
      // all custom properties at once in contrast to .getComputedStyle()
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/computedStyleMap
      for (const [prop, value] of (document.body as any).computedStyleMap()) {
        // Custom Property
        if (prop.startsWith('--')) {
          result[prop] = value[0][0].trim();
        }
      }
      return result;
    });
    return map;
  }
}

const setupTest = (
  mode: 'light' | 'dark',
  params: Record<string, string>,
  testFn: (page: ColorTokensMosaikPage) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new ColorTokensMosaikPage(browser);
    const urlParams = new URLSearchParams({ visualRefresh: 'false', ...params }).toString();
    await browser.url(`#/${mode}/theming/tokens?${urlParams}`);
    await testFn(page);
  });
};

const defaultColor = '#23850b';
const darkColor = '#0d8193';
const colorTokens = preset.themeable.filter(token => token.startsWith('color'));
const defaultMap = colorTokens.reduce((acc, current) => {
  const property = preset.propertiesMap[current];
  acc[property] = defaultColor;
  return acc;
}, {} as Record<string, string>);
const darkMap = colorTokens.reduce((acc, current) => {
  const property = preset.propertiesMap[current];
  acc[property] = darkColor;
  return acc;
}, {} as Record<string, string>);

test(
  'applies theming in default',
  setupTest('light', {}, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(defaultMap);
  })
);

test(
  'applies theming in compact density',
  setupTest('light', { density: 'compact' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(defaultMap);
  })
);

test(
  'applies theming in disabled motion',
  setupTest('light', { disabledMotion: 'true' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(defaultMap);
  })
);

// TODO: re-enable test after implementing theming in visual refresh
test.skip(
  'applies theming in visual refresh',
  setupTest('light', { visualRefresh: 'true' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(defaultMap);
  })
);

test(
  'applies theming in dark mode',
  setupTest('dark', {}, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(darkMap);
  })
);

test(
  'applies theming in dark mode + compact mode',
  setupTest('dark', { density: 'compact' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(darkMap);
  })
);

test(
  'applies theming in dark mode + reduced motion',
  setupTest('dark', { density: 'compact', motionDisabled: 'true' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(darkMap);
  })
);

test.skip(
  'applies theming in dark mode + visual refresh',
  setupTest('dark', { visualRefresh: 'true' }, async page => {
    const actual = await page.getCustomPropertyMap();
    expect(actual).toMatchObject(darkMap);
  })
);
