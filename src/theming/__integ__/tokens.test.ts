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
  switchTheme() {
    return this.click('[data-testid="change-theme"]');
  }
  switchThemeMethod() {
    return this.click('[data-testid="change-theme-method"]');
  }
  setSecondaryTheme() {
    return this.click('[data-testid="set-secondary"]');
  }
  toggleDarkMode() {
    return this.click('#mode-toggle');
  }
  toggleCompactDensity() {
    return this.click('#density-toggle');
  }
  toggleDisabledMotion() {
    return this.click('#disabled-motion-toggle');
  }
}

type ThemeMethod = 'applyTheme' | 'generateThemeStylesheet';

const setupTest = (testFn: (page: ColorTokensMosaikPage) => Promise<void>, vr: boolean, themeMethod: ThemeMethod) => {
  return useBrowser(async browser => {
    const page = new ColorTokensMosaikPage(browser);
    await browser.url(`#/light/theming/tokens${!vr ? '?visualRefresh=false' : ''}`);
    await page.switchTheme();
    if (themeMethod === 'generateThemeStylesheet') {
      await page.switchThemeMethod();
    }
    if (vr) {
      await page.setSecondaryTheme();
    }
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

describe.each<[ThemeMethod]>([['applyTheme'], ['generateThemeStylesheet']])('using %s', (themeMethod: ThemeMethod) => {
  test(
    'applies theming in default',
    setupTest(
      async page => {
        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(defaultMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in compact density',
    setupTest(
      async page => {
        await page.toggleCompactDensity();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(defaultMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in disabled motion',
    setupTest(
      async page => {
        await page.toggleDisabledMotion();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(defaultMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in dark mode',
    setupTest(
      async page => {
        await page.toggleDarkMode();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(darkMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in dark mode + compact mode',
    setupTest(
      async page => {
        await page.toggleDarkMode();
        await page.toggleCompactDensity();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(darkMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in dark mode + reduced motion',
    setupTest(
      async page => {
        await page.toggleDarkMode();
        await page.toggleDisabledMotion();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(darkMap);
      },
      false,
      themeMethod
    )
  );
  test(
    'applies theming in visual refresh',
    setupTest(
      async page => {
        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(defaultMap);
      },
      true,
      themeMethod
    )
  );
  test(
    'applies theming in dark mode + visual refresh',
    setupTest(
      async page => {
        await page.toggleDarkMode();

        const actual = await page.getCustomPropertyMap();

        expect(actual).toMatchObject(darkMap);
      },
      true,
      themeMethod
    )
  );
});
