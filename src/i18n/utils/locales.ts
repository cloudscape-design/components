// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getMatchableLocales(ietfLanguageTag: string): string[] {
  const parts = ietfLanguageTag.split('-');
  if (parts.length === 1) {
    return [ietfLanguageTag];
  }

  const localeStrings: string[] = [];
  for (let i = parts.length; i > 0; i--) {
    localeStrings.push(parts.slice(0, i).join('-'));
  }
  return localeStrings;
}

export function determineAppLocale(providedLocale?: string): string {
  // If a locale is explicitly provided, use the string directly.
  // Locales have a recommended case, but are matched case-insensitively,
  // so we lowercase it internally.
  if (providedLocale) {
    return providedLocale.toLowerCase();
  }

  if (typeof document !== 'undefined' && document.documentElement.lang) {
    // Otherwise, use the value provided in the HTML tag.
    return document.documentElement.lang.toLowerCase();
  }

  // Lastly, fall back to English.
  return 'en';
}
