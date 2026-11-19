// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Extracts the count value from table header/filter text.
 *
 * Parses various counter string formats and extracts the relevant numeric value:
 * - "Items (100)" - Extracts 100 (first number found)
 * - "1/100" - Extracts 100 (denominator of fraction, representing total count)
 * - "100+" - Extracts 100 (first number found)
 */
export const parseCountValue = (countText: string | undefined): number | undefined => {
  if (!countText || typeof countText !== 'string') {
    return undefined;
  }

  const target = countText.includes('/') ? countText.split('/')[1] : countText;
  const match = target.match(/\d+/);
  return match ? parseInt(match[0], 10) : undefined;
};
