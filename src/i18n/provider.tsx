// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import IntlMessageFormat from 'intl-messageformat';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useTelemetry } from '../internal/hooks/use-telemetry';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { InternalI18nContext, FormatFunction, CustomHandler } from './context';
import { getMatchableLocales } from './get-matchable-locales';

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

/**
 * Context to send parent messages down to child I18nProviders. This isn't
 * included in the InternalI18nContext to avoid components from depending on
 * MessageFormatElement types.
 */
const I18nMessagesContext = React.createContext<I18nProviderProps.Messages>({});

export function I18nProvider({ messages: messagesArray, locale: providedLocale, children }: I18nProviderProps) {
  useTelemetry('I18nProvider');

  if (typeof document === 'undefined' && !providedLocale) {
    warnOnce(
      'I18nProvider',
      'An explicit locale was not provided during server rendering. This can lead to a hydration mismatch on the client.'
    );
  }

  // The provider accepts an array of configs. We merge parent messages and
  // flatten the tree early on so that accesses by key are simpler and faster.
  const parentMessages = useContext(I18nMessagesContext);
  const messages = mergeMessages([parentMessages, ...messagesArray]);

  let locale: string;
  if (providedLocale) {
    // If a locale is explicitly provided, use the string directly.
    // Locales have a recommended case, but are matched case-insensitively,
    // so we lowercase it internally.
    locale = providedLocale.toLowerCase();
  } else if (typeof document !== 'undefined' && document.documentElement.lang) {
    // Otherwise, use the value provided in the HTML tag.
    locale = document.documentElement.lang.toLowerCase();
  } else {
    // Lastly, fall back to English.
    locale = 'en';
  }

  const format: FormatFunction = <ReturnValue, FormatFnArgs extends Record<string, string | number>>(
    namespace: string,
    component: string,
    key: string,
    provided: ReturnValue,
    customHandler?: CustomHandler<ReturnValue, FormatFnArgs>
  ): ReturnValue => {
    // A general rule in the library is that undefined is basically
    // treated as "not provided". So even if a user explicitly provides an
    // undefined value, it will default to i18n values.
    if (provided !== undefined) {
      return provided;
    }

    // Widen the locale string (e.g. en-GB -> en) until we find a locale
    // that contains the message we need.
    let message: string | MessageFormatElement[] | undefined;
    const matchableLocales = getMatchableLocales(locale);
    for (const matchableLocale of matchableLocales) {
      const localeMessage = messages?.[namespace]?.[matchableLocale]?.[component]?.[key];
      if (localeMessage !== undefined) {
        message = localeMessage;
        break;
      }
    }

    // If a message wasn't found, exit early.
    if (message === undefined) {
      return provided;
    }

    const intlMessageFormat = new IntlMessageFormat(message, locale);
    if (customHandler) {
      return customHandler(args => intlMessageFormat.format(args) as string);
    }
    // Assuming `T extends string` since a customHandler wasn't provided.
    return intlMessageFormat.format() as ReturnValue;
  };

  return (
    <InternalI18nContext.Provider value={{ locale, format }}>
      <I18nMessagesContext.Provider value={messages}>{children}</I18nMessagesContext.Provider>
    </InternalI18nContext.Provider>
  );
}

applyDisplayName(I18nProvider, 'I18nProvider');

function mergeMessages(sources: ReadonlyArray<I18nProviderProps.Messages>): I18nProviderProps.Messages {
  const result: I18nProviderProps.Messages = {};
  for (const messages of sources) {
    for (const namespace in messages) {
      if (!(namespace in result)) {
        result[namespace] = {};
      }
      for (const casedLocale in messages[namespace]) {
        const locale = casedLocale.toLowerCase();
        if (!(locale in result[namespace])) {
          result[namespace][locale] = {};
        }
        for (const component in messages[namespace][casedLocale]) {
          if (!(component in result[namespace][locale])) {
            result[namespace][locale][component] = {};
          }
          for (const key in messages[namespace][casedLocale][component]) {
            result[namespace][locale][component][key] = messages[namespace][casedLocale][component][key];
          }
        }
      }
    }
  }
  return result;
}
