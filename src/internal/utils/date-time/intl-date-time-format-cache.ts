// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Constructing Intl.DateTimeFormat is expensive (the browser parses locale data and
// resolves options), so we cache instances keyed by locale and options for reuse.

// No eviction: the number of unique locale/option combinations in an application is
// small and bounded.
const formatterCache = new Map<string, Intl.DateTimeFormat>();

export function getDateTimeFormat(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const cacheKey = createCacheKey(locale, options);
  const cached = formatterCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  formatterCache.set(cacheKey, formatter);
  return formatter;
}

// Options are sorted by key so the cache hits regardless of property order.
function createCacheKey(locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  const localeKey = locale ?? '';
  const optionsKey = Object.keys(options)
    .sort()
    .map(key => `${key}:${options[key as keyof Intl.DateTimeFormatOptions]}`)
    .join(',');
  return `${localeKey}|${optionsKey}`;
}
