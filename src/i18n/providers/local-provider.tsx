// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { InternalI18nContext } from '../context';
import { I18nFormatter, I18nMessages } from '../utils/i18n-formatter';
import { determineAppLocale } from '../utils/locales';

export interface LocalI18nProviderProps {
  messages: ReadonlyArray<I18nMessages>;
  locale?: string;
  children: React.ReactNode;
}

/**
 * Context to send parent messages down to child I18nProviders. This isn't
 * included in the InternalI18nContext to avoid components from depending on
 * MessageFormatElement types.
 */
const I18nMessagesContext = React.createContext<I18nMessages>({});

export function LocalI18nProvider({
  messages: messagesArray,
  locale: providedLocale,
  children,
}: LocalI18nProviderProps) {
  if (typeof document === 'undefined' && !providedLocale) {
    warnOnce(
      'I18nProvider',
      'An explicit locale was not provided during server rendering. This can lead to a hydration mismatch on the client.'
    );
  }

  const locale = determineAppLocale(providedLocale);

  // The provider accepts an array of configs. We merge parent messages and
  // flatten the tree early on so that accesses by key are simpler and faster.
  const parentMessages = useContext(I18nMessagesContext);
  const messages = mergeMessages([parentMessages, ...messagesArray]);

  // The formatter is recreated on every render to ensure it has access to the
  // latest messages. This is a trade-off between performance and correctness.
  // In practice, this should only happen when the messages change, which is
  // infrequent.
  const formatter = new I18nFormatter(locale, messages);

  return (
    <InternalI18nContext.Provider value={{ locale, format: formatter.format.bind(formatter) }}>
      <I18nMessagesContext.Provider value={messages}>{children}</I18nMessagesContext.Provider>
    </InternalI18nContext.Provider>
  );
}

function mergeMessages(sources: ReadonlyArray<I18nMessages>): I18nMessages {
  const result: I18nMessages = {};
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
