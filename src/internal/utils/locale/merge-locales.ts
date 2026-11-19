// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function mergeLocales(locale: string, fullLocale: string) {
  const isShort = locale.length === 2;
  if (isShort && fullLocale.indexOf(locale) === 0) {
    return fullLocale;
  }
  return locale;
}
