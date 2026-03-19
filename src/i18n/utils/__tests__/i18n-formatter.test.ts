// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { I18nFormatter, I18nMessages } from '../i18n-formatter';

const NAMESPACE = 'test-ns';
const COMPONENT = 'my-component';

function makeMessages(locale: string, entries: Record<string, string>): I18nMessages {
  return {
    [NAMESPACE]: {
      [locale]: {
        [COMPONENT]: entries,
      },
    },
  };
}

describe('I18nFormatter', () => {
  test('returns the provided value when it is not undefined', () => {
    const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello' }));
    expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', 'Custom value')).toBe('Custom value');
  });

  test('returns a formatted message when provided value is undefined', () => {
    const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello' }));
    expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBe('Hello');
  });

  test('returns undefined when message is not found and provided is undefined', () => {
    const formatter = new I18nFormatter('en', makeMessages('en', {}));
    expect(formatter.format(NAMESPACE, COMPONENT, 'missing-key', undefined)).toBeUndefined();
  });

  test('falls back to a less specific locale (en-GB -> en)', () => {
    const formatter = new I18nFormatter('en-gb', makeMessages('en', { greeting: 'Hello from en-GB' }));
    expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBe('Hello from en-GB');
  });

  test("resolves messages when locale casing in messages doesn't match casing in formatter", () => {
    const messages = makeMessages('en-GB', { color: 'Colour' });
    // The formatter locale is provided by determineAppLocale(), which always normalizes it to lowercase.
    // But the formatter also does the same thing internally just in case.
    const formatter = new I18nFormatter('EN-gb', messages);
    expect(formatter.format(NAMESPACE, COMPONENT, 'color', undefined)).toBe('Colour');
  });

  test('invokes customHandler with a formatting function', () => {
    const messages = makeMessages('en', { itemCount: '{count, plural, one {# item} other {# items}}' });
    const formatter = new I18nFormatter('en', messages);

    const result = formatter.format<string | undefined, { count: number }>(
      NAMESPACE,
      COMPONENT,
      'itemCount',
      undefined,
      formatFn => formatFn({ count: 5 })
    );

    expect(result).toBe('5 items');
  });
});
