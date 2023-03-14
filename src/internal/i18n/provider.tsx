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
  // and default to English.
  // NOTE: Should we support widening IETF language tags? (e.g. match en-GB from en)
  const locale = providedLocale ?? document?.documentElement.lang ?? 'en';

  const format = useCallback<FormatFunction>(
    <T,>(namespace: string, component: string, key: string, provided: T, customHandler?: CustomHandler<T>): T => {
      // A general rule in the library is that undefined is basically
      // treated as "not provided". So even if a user explicitly provides an
      // undefined value, it will default to i18n values. This may need to
      // be changed.
      if (provided !== undefined || messages?.[namespace]?.[locale]?.[component]?.[key] === undefined) {
        return provided;
      }

      const cacheKey = `${namespace}.${component}.${key}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)! as T;
      }

      let value: T;
      const intlMessageFormat = new IntlMessageFormat(messages[namespace][locale][component][key], locale);
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
      for (const locale in messages[namespace]) {
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
