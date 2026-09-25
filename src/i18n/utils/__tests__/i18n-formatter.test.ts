// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { I18nFormatter, I18nMessages } from '../i18n-formatter';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

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

  describe('resilience against malformed messages', () => {
    test('does not warn for well-formed messages', () => {
      const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello, {name}' }));
      formatter.format<string | undefined, { name: string }>(NAMESPACE, COMPONENT, 'greeting', undefined, formatFn =>
        formatFn({ name: 'World' })
      );
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('returns undefined and warns when a message has invalid ICU syntax', () => {
      const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello, {name' }));
      expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBeUndefined();
      expect(warnOnce).toHaveBeenCalledWith(
        'I18nProvider',
        expect.stringContaining(`Malformed message "${NAMESPACE}.${COMPONENT}.greeting" for locale "en"`)
      );
    });

    test('returns undefined and warns when a message references a variable that is not provided', () => {
      const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello, {name}' }));
      expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBeUndefined();
      expect(warnOnce).toHaveBeenCalledWith(
        'I18nProvider',
        expect.stringContaining(`Failed to format message "${NAMESPACE}.${COMPONENT}.greeting" for locale "en"`)
      );
    });

    test('formatting function returns an empty string and warns when formatting with a customHandler fails', () => {
      // AWSUI-62316: the message demands variables the component no longer provides.
      const messages = makeMessages('en', {
        removeLabel: 'Remove filter, {token__operator, select, equals {equals} other {other}} {token__value}',
      });
      const formatter = new I18nFormatter('en', messages);

      const result = formatter.format<string | undefined, { token__formattedText: string }>(
        NAMESPACE,
        COMPONENT,
        'removeLabel',
        undefined,
        formatFn => formatFn({ token__formattedText: 'Name = foo' })
      );

      expect(result).toBe('');
      expect(warnOnce).toHaveBeenCalledWith(
        'I18nProvider',
        expect.stringContaining(`Failed to format message "${NAMESPACE}.${COMPONENT}.removeLabel" for locale "en"`)
      );
    });

    test('formatting function returned by customHandler is guarded when invoked after render', () => {
      // Parses fine, but "itemCount" isn't passed, so it throws at format time.
      const formatter = new I18nFormatter('en', makeMessages('en', { itemCount: '{itemCount} items' }));

      // formatFn is invoked later, outside the formatter's call stack. It must not throw even then.
      const lateFormatFn = formatter.format<((count: number) => string) | undefined, { count: number }>(
        NAMESPACE,
        COMPONENT,
        'itemCount',
        undefined,
        formatFn => count => formatFn({ count })
      );

      expect(() => lateFormatFn!(5)).not.toThrow();
      expect(lateFormatFn!(5)).toBe('');
      expect(warnOnce).toHaveBeenCalledWith(
        'I18nProvider',
        expect.stringContaining(`Failed to format message "${NAMESPACE}.${COMPONENT}.itemCount" for locale "en"`)
      );
    });

    test('recovers on every render when the formatter instance is cached', () => {
      const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello, {name}' }));

      // Second call exercises the cached-formatter path.
      expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBeUndefined();
      expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', undefined)).toBeUndefined();
    });

    test('an explicitly provided value always wins over a malformed message', () => {
      const formatter = new I18nFormatter('en', makeMessages('en', { greeting: 'Hello, {name' }));
      expect(formatter.format(NAMESPACE, COMPONENT, 'greeting', 'Provided value')).toBe('Provided value');
      expect(warnOnce).not.toHaveBeenCalled();
    });

    test('other messages still format correctly when one message is malformed', () => {
      const messages = makeMessages('en', { broken: 'Hello, {name', working: 'All good' });
      const formatter = new I18nFormatter('en', messages);
      expect(formatter.format(NAMESPACE, COMPONENT, 'broken', undefined)).toBeUndefined();
      expect(formatter.format(NAMESPACE, COMPONENT, 'working', undefined)).toBe('All good');
    });
  });
});
