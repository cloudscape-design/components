// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class ThemingPage extends BasePageObject {
  switchTheme() {
    return this.click('[data-testid="change-theme"]');
  }
  switchThemeMethod() {
    return this.click('[data-testid="change-theme-method"]');
  }
  toggleDarkMode() {
    return this.click('#mode-toggle');
  }
  setSecondaryTheme() {
    return this.click('[data-testid="set-secondary"]');
  }
  async getCSSProperty(selector: string, property: string) {
    const elem = await this.browser.$(selector);
    return this.browser.getElementCSSValue(elem.elementId, property);
  }
  getButtonBackgroundColor() {
    return this.getCSSProperty(wrapper.findButton().toSelector(), 'background-color');
  }
  getLinkTextColor() {
    return this.getCSSProperty(wrapper.findLink().toSelector(), 'color');
  }
  getFakeLinkTextColor() {
    return this.getCSSProperty(wrapper.find('a[data-testid=element-color-text-link-default]').toSelector(), 'color');
  }
}

const setupTest = (testFn: (page: ThemingPage) => Promise<void>, vr?: boolean) => {
  return useBrowser(async browser => {
    const page = new ThemingPage(browser);
    await browser.url(`#/light/theming/integration${!vr ? '?visualRefresh=false' : ''}`);
    if (vr) {
      await page.setSecondaryTheme();
    }
    await testFn(page);
  });
};

const buttonBackgroundColor = {
  light: 'rgba(29, 129, 2, 1)',
  dark: 'rgba(0, 161, 201, 1)',
};

const linkTextColor = {
  light: 'rgba(255, 0, 0, 1)',
  dark: 'rgba(255, 165, 0, 1)',
};
[true, false].forEach(vr => {
  test(
    `applies theme to components${vr ? ' in Visual Refresh' : ''}`,
    setupTest(async page => {
      // Using a component is not ideal. Changes to the component will affect this test case.
      await expect(page.getButtonBackgroundColor()).resolves.not.toBe(buttonBackgroundColor.light);
      await expect(page.getLinkTextColor()).resolves.not.toBe(linkTextColor.light);

      await page.switchTheme();

      await expect(page.getButtonBackgroundColor()).resolves.toBe(buttonBackgroundColor.light);
      await expect(page.getLinkTextColor()).resolves.toBe(linkTextColor.light);

      await page.switchThemeMethod();

      await expect(page.getButtonBackgroundColor()).resolves.toBe(buttonBackgroundColor.light);
      await expect(page.getLinkTextColor()).resolves.toBe(linkTextColor.light);

      await page.toggleDarkMode();

      await expect(page.getButtonBackgroundColor()).resolves.toBe(buttonBackgroundColor.dark);
      await expect(page.getLinkTextColor()).resolves.toBe(linkTextColor.dark);

      await page.switchTheme();

      await expect(page.getButtonBackgroundColor()).resolves.not.toBe(buttonBackgroundColor.dark);
      await expect(page.getLinkTextColor()).resolves.not.toBe(linkTextColor.dark);

      await page.switchThemeMethod();

      await expect(page.getButtonBackgroundColor()).resolves.not.toBe(buttonBackgroundColor.dark);
      await expect(page.getLinkTextColor()).resolves.not.toBe(linkTextColor.dark);
    }, vr)
  );

  test(
    `applies theme to design tokens${vr ? ' in Visual Refresh' : ''}`,
    setupTest(async page => {
      await expect(page.getFakeLinkTextColor()).resolves.not.toBe(linkTextColor.light);

      await page.switchTheme();

      await expect(page.getFakeLinkTextColor()).resolves.toBe(linkTextColor.light);

      await page.switchThemeMethod();

      await expect(page.getFakeLinkTextColor()).resolves.toBe(linkTextColor.light);

      await page.toggleDarkMode();

      await expect(page.getFakeLinkTextColor()).resolves.toBe(linkTextColor.dark);

      await page.switchTheme();

      await expect(page.getFakeLinkTextColor()).resolves.not.toBe(linkTextColor.dark);

      await page.switchThemeMethod();

      await expect(page.getFakeLinkTextColor()).resolves.not.toBe(linkTextColor.dark);
    }, vr)
  );
});
