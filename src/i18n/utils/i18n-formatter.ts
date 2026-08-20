// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CustomHandler } from '../context';
import { formatMessage } from './icu-parser';
import { getMatchableLocales } from './locales';
import { normalizeMessages } from './messages';

/**
 * The expected shape of the fully resolved messages object.
 *
 * Values are plain ICU message strings. Pre-parsed MessageFormatElement[]
 * arrays are no longer accepted; use plain strings only.
 *
 * @see MIGRATION.md for upgrade instructions.
 */
export interface I18nMessages {
  [namespace: string]: {
    [locale: string]: {
      [component: string]: {
        [key: string]: string;
      };
    };
  };
}

/**
 * A stateful container for formatting internal strings. Caches formatted
 * message strings where possible; a new instance must be created if locale
 * or messages may have changed.
 */
export class I18nFormatter {
  private _locale: string;
  private _messages: I18nMessages;

  // Per-render cache keyed by `namespace.component.key`.
  // Stores the raw (unformatted) message string so that the same message
  // can be formatted with different argument sets.
  private _messageCache = new Map<string, string>();

  constructor(locale: string, messages: I18nMessages) {
    this._locale = locale.toLowerCase();
    this._messages = normalizeMessages([messages]);
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

    let message: string | undefined = this._messageCache.get(cacheKey);

    if (message === undefined) {
      // Widen the locale string (e.g. en-GB -> en) until we find a locale
      // that contains the message we need.
      const matchableLocales = getMatchableLocales(this._locale);
      for (const matchableLocale of matchableLocales) {
        const candidate = this._messages?.[namespace]?.[matchableLocale]?.[component]?.[key];
        if (candidate !== undefined) {
          message = candidate;
          break;
        }
      }

      // If a message wasn't found, exit early.
      if (message === undefined) {
        return provided;
      }

      this._messageCache.set(cacheKey, message);
    }

    // Capture `message` in a closure for the customHandler path.
    const resolvedMessage = message;

    if (customHandler) {
      return customHandler((args: FormatFnArgs) => formatMessage(resolvedMessage, args));
    }

    // Assuming `ReturnValue extends string` since a customHandler wasn't provided.
    return formatMessage(resolvedMessage) as ReturnValue;
  }
}
