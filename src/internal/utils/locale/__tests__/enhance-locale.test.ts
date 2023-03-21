// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import setOptions from './utils/intl-polyfill';
import { enhanceLocale } from '../../../../../lib/components/internal/utils/locale/use-enhanced-locale';

function withDocumentLang(lang: string, callback: () => void) {
  const htmlElement = document.querySelector('html');
  htmlElement!.setAttribute('lang', lang);
  callback();
  htmlElement!.removeAttribute('lang');
}

describe('enhanceLocale', () => {
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn');
    setOptions({ locale: 'en-US' });
  });

  afterEach(() => {
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('should return the provided value', () => {
    expect(enhanceLocale('DatePickerTest', 'en-US')).toBe('en-US');
  });

  test('should extend provided value if it is short form', () => {
    expect(enhanceLocale('DatePickerTest', 'en')).toBe('en-US');
    setOptions({ locale: 'en-GB' });
    expect(enhanceLocale('DatePickerTest', 'en')).toBe('en-GB');
  });

  test('should not extend the provided value if it starts from different language', () => {
    expect(enhanceLocale('DatePickerTest', 'fr')).toBe('fr');
  });

  test('should replace underscores with dashes', () => {
    expect(enhanceLocale('DatePickerTest', 'zh_CN')).toBe('zh-CN');
  });

  test('should warn if the provided value is in invalid format', () => {
    expect(enhanceLocale('DatePickerTest', 'not-locale')).toBe('en-US');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[AwsUi] [DatePickerTest] Invalid locale provided: not-locale. Falling back to default'
    );
    consoleSpy.mockReset();
  });

  test('should return document language by default', () => {
    withDocumentLang('en', () => {
      expect(enhanceLocale('DatePickerTest', null)).toBe('en-US');
    });
  });

  test('should not extend document language with locale if they do not match', () => {
    withDocumentLang('fr', () => {
      expect(enhanceLocale('DatePickerTest', null)).toBe('fr');
    });
  });

  test('should combine values from document lang and browser locale', () => {
    setOptions({ locale: 'fr-CA' });
    withDocumentLang('fr', () => {
      expect(enhanceLocale('DatePickerTest', null)).toBe('fr-CA');
    });
  });

  test('should replace underscores with dashes in document lang', () => {
    withDocumentLang('zh_CN', () => {
      expect(enhanceLocale('DatePickerTest', null)).toBe('zh-CN');
    });
  });
});
