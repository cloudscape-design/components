// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { preset } from '../../../lib/components/internal/generated/theming/index.cjs';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

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
  async enableDarkMode() {
    await this.click('#preferences-button');
    await this.waitForVisible(wrapper.findModal().toSelector());
    const modeSelector = wrapper.findSelect('#mode-selector');
    await this.click(modeSelector.findTrigger().toSelector());
    await this.waitForVisible(modeSelector.findDropdown().findOpenDropdown().toSelector());
    await this.click(modeSelector.findDropdown().findOptionByValue('dark').toSelector());
  }
  async toggleCompactDensity() {
    await this.click('#preferences-button');
    await this.waitForVisible(wrapper.findModal().toSelector());
    return this.click('#density-toggle');
  }
  async toggleDisabledMotion() {
    await this.click('#preferences-button');
    await this.waitForVisible(wrapper.findModal().toSelector());
    return this.click('#disabled-motion-toggle');
  }
  async toggleVisualRefresh() {
    await this.click('#preferences-button');
    await this.waitForVisible(wrapper.findModal().toSelector());
    return this.click('#visual-refresh-toggle');
  }
}

const setupTest = (testFn: (page: ColorTokensMosaikPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new ColorTokensMosaikPage(browser);
    await browser.url('#/light/theming/tokens');
    // The default theme is VR by default, so we toggle once to go to classic mode
    await page.toggleVisualRefresh();
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
  setupTest(async page => {
    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(defaultMap);
  })
);
test(
  'applies theming in compact density',
  setupTest(async page => {
    await page.toggleCompactDensity();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(defaultMap);
  })
);
test(
  'applies theming in disabled motion',
  setupTest(async page => {
    await page.toggleDisabledMotion();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(defaultMap);
  })
);
// TODO: re-enable test after implementing theming in visual refresh
test.skip(
  'applies theming in visual refresh',
  setupTest(async page => {
    await page.toggleVisualRefresh();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(defaultMap);
  })
);
test(
  'applies theming in dark mode',
  setupTest(async page => {
    await page.enableDarkMode();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(darkMap);
  })
);
test(
  'applies theming in dark mode + compact mode',
  setupTest(async page => {
    await page.enableDarkMode();
    await page.toggleCompactDensity();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(darkMap);
  })
);
test(
  'applies theming in dark mode + reduced motion',
  setupTest(async page => {
    await page.enableDarkMode();
    await page.toggleDisabledMotion();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(darkMap);
  })
);
// TODO: re-enable test after implementing theming in visual refresh
test.skip(
  'applies theming in dark mode + visual refresh',
  setupTest(async page => {
    await page.enableDarkMode();
    await page.toggleVisualRefresh();

    const actual = await page.getCustomPropertyMap();

    expect(actual).toMatchObject(darkMap);
  })
);
