// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import IntlMessageFormat from 'intl-messageformat';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import { InternalI18nContext, FormatFunction } from './context';

export interface I18nProviderProps {
  value: I18nProviderProps.LocaleMessages;
  customHandlers?: Record<string, Record<string, I18nProviderProps.CustomHandler<any>>>;
  children: React.ReactNode;
}

export namespace I18nProviderProps {
  export interface LocaleMessages {
    locale: string;
    messages: Record<string, Record<string, string | MessageFormatElement[]>>;
  }
  export type CustomHandler<T> = (formatFn: (args: Record<string, string | number>) => string) => T;
}

// TODO: split by component
const defaultCustomHandlers: Record<string, Record<string, I18nProviderProps.CustomHandler<any>>> = {
  pagination: {
    'ariaLabels.pageLabel': format => (pageNumber: number) => format({ pageNumber }),
  },
  'property-filter': {
    'i18nStrings.enteredTextLabel': format => (text: string) => format({ text }),
    'i18nStrings.removeTokenButtonAriaLabel': format => (token: any) =>
      format({
        token__operator: token.operator,
        token__propertyKey: token.propertyKey,
        token__value: token.value,
      }),
  },
};

export function I18nProvider({
  value: { locale, messages },
  customHandlers = defaultCustomHandlers,
  children,
}: I18nProviderProps) {
  // Keep a cache per render for improved performance. Generally, it's expected
  // to have an I18nProvider pretty high up the render tree and for it to
  // rarely rerender, so it should stick around and offer performance gains.
  const cache = useMemo(() => new Map<string, unknown>(), []);
  cache.clear();

  const format = useCallback<FormatFunction>(
    (component, key, provided) => {
      // A general rule in the library is that undefined is basically
      // treated as "not provided". So even if a user explicitly provides an
      // undefined value, it will default to i18n values. This may need to
      // be changed.
      if (provided !== undefined || !messages[component]?.[key]) {
        return provided;
      }

      if (cache.has(key)) {
        return cache.get(key)!;
      }

      let value;
      const intlMessageFormat = new IntlMessageFormat(messages[component][key], locale);
      if (customHandlers[component]?.[key]) {
        value = customHandlers[component][key](args => intlMessageFormat.format(args) as string);
      } else {
        value = intlMessageFormat.format() as string;
      }

      cache.set(key, value);
      return value;
    },
    [locale, messages, customHandlers, cache]
  );

  return <InternalI18nContext.Provider value={format}>{children}</InternalI18nContext.Provider>;
}
