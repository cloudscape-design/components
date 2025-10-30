// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import InputPage from './page-objects/input';

describe('Input', () => {
  const setupTest = (testFn: (page: InputPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new InputPage(browser);
      await page.visit('#/light/input/input-integ');
      await testFn(page);
    });
  };

  test(
    'Should submit the form via keyboard in awsui-input',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(true);
    })
  );

  test(
    'Should not submit the form via keyboard in awsui-input if keyboard event is prevented',
    setupTest(async page => {
      await page.disableFormSubmitting();
      await page.focusInput();
      await page.keys(['Enter']);
      await expect(page.isFormSubmitted()).resolves.toBe(false);
    })
  );

  test(
    'Clicking on form field label should focus the input',
    useBrowser(async browser => {
      await browser.url('#/light/input/inputs');
      const page = new InputPage(browser);
      const wrapper = createWrapper();
      await page.click(wrapper.findFormField().findLabel().toSelector());
      await expect(
        page.isFocused(wrapper.find('#formfield-with-input').findInput().findNativeInput().toSelector())
      ).resolves.toBe(true);
    })
  );
});

describe('Input Style API', () => {
  test(
    'hover and focus states',
    useBrowser(async browser => {
      await browser.url('#/light/input/style-permutations');
      const page = new InputPage(browser);
      const inputSelector = '.screenshot-area input:first-of-type';

      // Default state - teal theme
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(20,184,166,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-width')).value).toBe('2px');
      await expect((await browser.$(inputSelector).getCSSProperty('border-radius')).value).toBe('8px');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(153,246,228,1)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(13,92,84,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('font-size')).value).toBe('16px');
      await expect((await browser.$(inputSelector).getCSSProperty('font-weight')).value).toBe(500);
      await expect((await browser.$(inputSelector).getCSSProperty('padding-block')).value).toBe('12px');
      await expect((await browser.$(inputSelector).getCSSProperty('padding-inline')).value).toBe('16px');

      // Placeholder styles
      await expect((await browser.$(inputSelector).getCSSProperty('color', '::placeholder' as any)).value).toBe(
        'rgb(20,184,166)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('font-size', '::placeholder' as any)).value).toBe(
        '14px'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('font-style', '::placeholder' as any)).value).toBe(
        'italic'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('font-weight', '::placeholder' as any)).value).toBe(
        400
      );

      // Hover state
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(15,118,110,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(94,234,212,1)'
      );

      // Focus state
      await page.click(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(13,148,136,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(94,234,212,1)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(13,92,84,1)');
    })
  );

  test(
    'styleable input with state toggles - default state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';

      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(59,130,246,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-width')).value).toBe('2px');
      await expect((await browser.$(inputSelector).getCSSProperty('border-radius')).value).toBe('8px');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(219,234,254,1)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(30,64,175,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('font-size')).value).toBe('16px');
      await expect((await browser.$(inputSelector).getCSSProperty('font-weight')).value).toBe(500);
      await expect((await browser.$(inputSelector).getCSSProperty('padding-block')).value).toBe('10px');
      await expect((await browser.$(inputSelector).getCSSProperty('padding-inline')).value).toBe('14px');
      await expect((await browser.$(inputSelector).getCSSProperty('color', '::placeholder' as any)).value).toBe(
        'rgb(96,165,250)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('font-size', '::placeholder' as any)).value).toBe(
        '14px'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('font-style', '::placeholder' as any)).value).toBe(
        'italic'
      );
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(37,99,235,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(191,219,254,1)'
      );
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(30,64,175,1)');
    })
  );

  test(
    'styleable input with state toggles - focus state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';

      await page.click(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(30,58,138,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(29,78,216,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(191,219,254,1)'
      );
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(30,58,138,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(29,78,216,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(191,219,254,1)'
      );
    })
  );

  test(
    'styleable input with state toggles - disabled state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';
      const toggleButtonSelector = '#toggle-disabled';

      await page.click(toggleButtonSelector);
      await browser.pause(100);

      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(147,197,253,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(147,197,253,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(239,246,255,1)'
      );
      await expect(await browser.$(inputSelector).isEnabled()).toBe(false);
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(147,197,253,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(147,197,253,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(239,246,255,1)'
      );
    })
  );

  test(
    'styleable input with state toggles - readonly state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';
      const toggleButtonSelector = '#toggle-readonly';

      await page.click(toggleButtonSelector);
      await browser.pause(100); // Wait for state update

      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(59,130,246,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(96,165,250,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(240,249,255,1)'
      );
      await expect(await browser.$(inputSelector).getAttribute('readonly')).toBe('true');
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(59,130,246,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(96,165,250,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(240,249,255,1)'
      );
      await expect(await browser.$(inputSelector).getAttribute('readonly')).toBe('true');
    })
  );

  test(
    'styleable input with state toggles - invalid state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';
      const toggleButtonSelector = '#toggle-invalid';

      await page.click(toggleButtonSelector);
      await browser.pause(100);

      await expect(await browser.$(inputSelector).getAttribute('aria-invalid')).toBe('true');

      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(219,0,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(219,0,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(219,234,254,1)'
      );
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(219,0,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(219,0,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(191,219,254,1)'
      );
    })
  );

  test(
    'styleable input with state toggles - warning state',
    useBrowser(async browser => {
      await browser.url('#/light/input/input-integ');
      const page = new InputPage(browser);
      const inputSelector = '#styleable-input-test input';
      const toggleButtonSelector = '#toggle-warning';

      await page.click(toggleButtonSelector);
      await browser.pause(100);

      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(133,89,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(133,89,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(219,234,254,1)'
      );
      await page.hoverElement(inputSelector);
      await expect((await browser.$(inputSelector).getCSSProperty('color')).value).toBe('rgba(133,89,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('border-color')).value).toBe('rgba(133,89,0,1)');
      await expect((await browser.$(inputSelector).getCSSProperty('background-color')).value).toBe(
        'rgba(191,219,254,1)'
      );
    })
  );
});
