// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import IntlMessageFormat from 'intl-messageformat';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { InternalI18nContext, FormatFunction, CustomHandler } from './context';

export interface I18nProviderProps {
  messages: ReadonlyArray<I18nProviderProps.Messages>;
  locale?: string;
  children: React.ReactNode;
}

export namespace I18nProviderProps {
  export interface Messages {
    [namespace: string]: {
      [locale: string]: {
        [component: string]: {
          [key: string]: string | MessageFormatElement[];
        };
      };
    };
  }
}

export function I18nProvider({ messages: messagesArray, locale: providedLocale, children }: I18nProviderProps) {
  // Keep a cache per render for improved performance. Generally, it's expected
  // to have an I18nProvider pretty high up the render tree and for it to
  // rarely rerender, so it should stick around and offer performance gains.
  const cache = useMemo(() => new Map<string, unknown>(), []);
  cache.clear();

  // The provider accepts an array of configs. We flatten the tree early on so that
  // accesses by key are simpler and faster.
  const messages = useMemo(() => mergeMessages(messagesArray), [messagesArray]);

  // If a locale isn't provided, we can try and guess from the html lang,
  // and lastly default to English. Locales have a recommended case, but are
  // matched case-insensitively.
  const locale = (providedLocale ?? document?.documentElement.lang ?? 'en').toLowerCase();

  const format = useCallback<FormatFunction>(
    <T,>(namespace: string, component: string, key: string, provided: T, customHandler?: CustomHandler<T>): T => {
      // A general rule in the library is that undefined is basically
      // treated as "not provided". So even if a user explicitly provides an
      // undefined value, it will default to i18n values. This may need to
      // be changed.
      if (provided !== undefined) {
        return provided;
      }

      // For the given locale and cache key, the computed message will always
      // be the same. So we can safely return the cached value.
      const cacheKey = `${namespace}.${component}.${key}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)! as T;
      }

      // Widen the locale string (e.g. en-GB -> en) until we find a locale
      // that contains the message we need.
      let message: string | MessageFormatElement[] | undefined;
      const matchableLocales = getMatchableLocales(locale);
      for (const matchableLocale of matchableLocales) {
        const localeMessage = messages?.[namespace]?.[matchableLocale]?.[component]?.[key];
        if (localeMessage !== undefined) {
          message = localeMessage;
        }
      }

      // If a message wasn't found, exit early.
      if (message === undefined) {
        return provided;
      }

      let value: T;
      const intlMessageFormat = new IntlMessageFormat(message, locale);
      if (customHandler) {
        // NOTE: Because the results of the custom handler are cached, the
        // custom handler is expected to be pure. We can exclude these from
        // caching in the future if it turns out to be a problem.
        value = customHandler(args => intlMessageFormat.format(args) as string);
      } else {
        value = intlMessageFormat.format() as T;
      }

      cache.set(cacheKey, value);
      return value;
    },
    [messages, locale, cache]
  );

  return <InternalI18nContext.Provider value={format}>{children}</InternalI18nContext.Provider>;
}

function mergeMessages(sources: ReadonlyArray<I18nProviderProps.Messages>): I18nProviderProps.Messages {
  const result: I18nProviderProps.Messages = {};
  for (const messages of sources) {
    for (const namespace in messages) {
      if (!(namespace in result)) {
        result[namespace] = messages[namespace];
        continue;
      }
      for (const casedLocale in messages[namespace]) {
        const locale = casedLocale.toLowerCase();
        if (!(locale in result[namespace])) {
          result[namespace][locale] = messages[namespace][locale];
          continue;
        }
        for (const component in messages[namespace][locale]) {
          if (!(component in result[namespace][locale])) {
            result[namespace][locale][component] = messages[namespace][locale][component];
            continue;
          }
          for (const key in messages[namespace][locale][component]) {
            result[namespace][locale][component][key] = messages[namespace][locale][component][key];
          }
        }
      }
    }
  }
  return result;
}

function getMatchableLocales(ietfLanguageTag: string): string[] {
  const parts = ietfLanguageTag.split('-');
  if (parts.length === 1) {
    return [ietfLanguageTag];
  }

  const localeStrings = [];
  for (let i = parts.length; i > 0; i--) {
    localeStrings.push(parts.slice(0, i).join('-'));
  }
  return localeStrings;
}
