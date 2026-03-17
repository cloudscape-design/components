// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';

import { CustomHandler } from '../context';
import { getMatchableLocales } from './locales';

/**
 * The expected shape of the fully resolved messages object.
 * Typescript ensures any static imports are properly typed, but since this
 * depends on types from formatjs, it should not be included in any files that
 * need to support older versions of TypeScript (3.7 and up).
 */
export interface I18nMessages {
  [namespace: string]: {
    [locale: string]: {
      [component: string]: {
        [key: string]: string | MessageFormatElement[];
      };
    };
  };
}

/**
 * A stateful container for formatting internal strings. Caches formatters
 * where possible; a new instance must be created if locale or messages may
 * have changed.
 */
export class I18nFormatter {
  private _locale: string;
  private _messages: I18nMessages;

  // Create a per-render cache of messages and IntlMessageFormat instances.
  // Not memoizing it allows us to reset the cache when the component rerenders
  // with potentially different locale or messages. We expect this component to
  // be placed above AppLayout and therefore rerender very infrequently.
  private _localeFormatterCache = new Map<string, IntlMessageFormat>();

  constructor(locale: string, messages: I18nMessages) {
    this._locale = locale;
    this._messages = messages;
  }

  format<ReturnValue, FormatFnArgs extends Record<string, string | number>>(
    namespace: string,
    component: string,
    key: string,
    provided: ReturnValue,
    customHandler?: CustomHandler<ReturnValue, FormatFnArgs>
  ): ReturnValue {
    // A general rule in this library is that undefined is basically
    // treated as "not provided". So even if a user explicitly provides an
    // undefined value, it will default to i18n provider values.
    if (provided !== undefined) {
      return provided;
    }

    const cacheKey = `${namespace}.${component}.${key}`;
    let intlMessageFormat: IntlMessageFormat;

    const cachedFormatter = this._localeFormatterCache.get(cacheKey);
    if (cachedFormatter) {
      // If an IntlMessageFormat instance was cached for this locale, just use that.
      intlMessageFormat = cachedFormatter;
    } else {
      // Widen the locale string (e.g. en-GB -> en) until we find a locale
      // that contains the message we need.
      let message: string | MessageFormatElement[] | undefined;
      const matchableLocales = getMatchableLocales(this._locale);
      for (const matchableLocale of matchableLocales) {
        message = this._messages?.[namespace]?.[matchableLocale]?.[component]?.[key];
        if (message !== undefined) {
          break;
        }
      }

      // If a message wasn't found, exit early.
      if (message === undefined) {
        return provided;
      }

      // Lazily create an IntlMessageFormat object for this key.
      intlMessageFormat = new IntlMessageFormat(message, this._locale);
      this._localeFormatterCache.set(cacheKey, intlMessageFormat);
    }

    if (customHandler) {
      return customHandler(args => intlMessageFormat.format(args) as string);
    }
    // Assuming `ReturnValue extends string` since a customHandler wasn't provided.
    return intlMessageFormat.format() as ReturnValue;
  }
}
