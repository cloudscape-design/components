// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { I18nMessages } from './i18n-formatter';

export function normalizeMessages(sources: ReadonlyArray<I18nMessages>): I18nMessages {
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
