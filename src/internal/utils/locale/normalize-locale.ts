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
  locale = locale && locale.replace(/^([a-z]{2})_/, '$1-');
  // Check that the value matches aa-BB pattern
  // TODO: support full BCP 47 spec?
  if (locale && !locale.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
    warnOnce(component, `Invalid locale provided: ${locale}. Falling back to default`);
    locale = '';
  }
  return locale;
}

function getHtmlElement() {
  return typeof document !== 'undefined' ? document.querySelector('html') : null;
}

function getBrowserLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
