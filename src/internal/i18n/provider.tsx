// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import IntlMessageFormat from 'intl-messageformat';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { InternalI18nContext, FormatFunction, CustomHandler } from './context';

export interface I18nProviderProps {
  value: I18nProviderProps.LocaleMessages;
  children: React.ReactNode;
}

export namespace I18nProviderProps {
  export interface LocaleMessages {
    locale: string;
    messages: Record<string, Record<string, string | MessageFormatElement[]>>;
  }
}

export function I18nProvider({ value: localeMessages, children }: I18nProviderProps) {
  // Keep a cache per render for improved performance. Generally, it's expected
  // to have an I18nProvider pretty high up the render tree and for it to
  // rarely rerender, so it should stick around and offer performance gains.
  const cache = useMemo(() => new Map<string, unknown>(), []);
  cache.clear();

  const format = useCallback<FormatFunction>(
    <T,>(component: string, key: string, provided: T, customHandler?: CustomHandler<T>): T => {
      // A general rule in the library is that undefined is basically
      // treated as "not provided". So even if a user explicitly provides an
      // undefined value, it will default to i18n values. This may need to
      // be changed.
      if (provided !== undefined || !localeMessages.messages[component]?.[key]) {
        return provided;
      }

      const cacheKey = `${component}.${key}`;
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)! as T;
      }

      let value: T;
      const intlMessageFormat = new IntlMessageFormat(localeMessages.messages[component][key], localeMessages.locale);
      if (customHandler) {
        // WARNING: Because the results of the custom handler are cached, the
        // custom handler is expected to be pure. We can exclude these from
        // caching in the future if it turns out to be a problem.
        value = customHandler(args => intlMessageFormat.format(args) as string);
      } else {
        value = intlMessageFormat.format() as T;
      }

      cache.set(cacheKey, value);
      return value;
    },
    [localeMessages, cache]
  );

  return <InternalI18nContext.Provider value={format}>{children}</InternalI18nContext.Provider>;
}
