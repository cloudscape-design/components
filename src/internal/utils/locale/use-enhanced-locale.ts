// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '../../logging';
import { mergeLocales } from './merge-locales';
import { useLocale, getDocumentLanguage, getBrowserLocale } from '../../i18n/context';

/**
 * Use locale provided either through the component or i18n context, and add
 * any additional secondary tags based on information present in the html lang
 * or the browser's current locale. Used in calendar components for date
 * internationalization.
 *
 * @deprecated For new components, prefer `useLocale` directly.
 */
export function useEnhancedLocale(component: string, localeOverride: string | null): string {
  const contextLocale = useLocale();
  return enhanceLocale(component, localeOverride || contextLocale);
}

export function enhanceLocale(component: string, locale: string | null): string {
  locale = checkLocale(component, locale);
  const browserLocale = getBrowserLocale();
  if (locale) {
    return mergeLocales(locale, browserLocale);
  }
  const documentLanguage = checkLocale(component, getDocumentLanguage());
  if (documentLanguage) {
    return mergeLocales(documentLanguage, browserLocale);
  }
  return browserLocale;
}

function checkLocale(component: string, locale: string | null): string {
  if (!locale) {
    return '';
  }

  // Support underscore-delimited locales
  const normalizedLocale = locale.replace(/^([a-z]{2})_/, '$1-');

  // Check that the value matches aa-BB pattern
  // TODO: support full BCP 47 spec?
  if (!normalizedLocale.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    warnOnce(component, `Invalid locale provided: ${locale}. Falling back to default`);
    return '';
  }

  return normalizedLocale;
}
