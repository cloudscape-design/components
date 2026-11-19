// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { mergeLocales } from './merge-locales';

export function normalizeLocale(component: string, locale: string | null): string {
  locale = checkLocale(component, locale);
  const browserLocale = getBrowserLocale();
  if (locale) {
    return mergeLocales(locale, browserLocale);
  }
  const htmlLocale = checkLocale(component, getHtmlElement()?.getAttribute('lang'));
  if (htmlLocale) {
    return mergeLocales(htmlLocale, browserLocale);
  }
  return browserLocale;
}

function checkLocale(component: string, locale: string | null | undefined): string {
  if (!locale || locale === '') {
    return '';
  }

  // Support underscore-delimited locales
  locale = locale.replace(/^([a-zA-Z]{2})_/, '$1-');
  // Check that the value matches aa-BB pattern, case-insensitively:
  // locales are matched case-insensitively per BCP 47, and e.g. I18nProvider lowercases its locale.
  // TODO: support full BCP 47 spec?
  const match = locale.match(/^([a-zA-Z]{2})(?:-([a-zA-Z]{2}))?$/);
  if (!match) {
    warnOnce(component, `Invalid locale provided: ${locale}. Falling back to default`);
    return '';
  }
  // Normalize to the canonical aa-BB casing.
  return match[2] ? `${match[1].toLowerCase()}-${match[2].toUpperCase()}` : match[1].toLowerCase();
}

function getHtmlElement() {
  return typeof document !== 'undefined' ? document.querySelector('html') : null;
}

function getBrowserLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
