// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Cache for Intl.DateTimeFormat instances.
 *
 * Creating Intl.DateTimeFormat objects is expensive because the browser must
 * parse locale data and resolve options. This cache stores formatter instances
 * keyed by locale and options, allowing reuse across multiple format calls.
 *
 * The cache uses a simple Map with a string key derived from the locale and
 * serialized options. Since the number of unique locale/option combinations
 * in a typical application is small and bounded, we don't implement cache
 * eviction.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Returns a cached Intl.DateTimeFormat instance for the given locale and options.
 * If no cached instance exists, creates one and stores it in the cache.
 */
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

/**
 * Creates a cache key from locale and options.
 * Options are sorted by key to ensure consistent cache hits regardless of property order.
 */
function createCacheKey(locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  const localeKey = locale ?? '';
  const optionsKey = Object.keys(options)
    .sort()
    .map(key => `${key}:${options[key as keyof Intl.DateTimeFormatOptions]}`)
    .join(',');
  return `${localeKey}|${optionsKey}`;
}
