// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const monthOnlyRegex = /^\d{4}-(?:0[1-9]|1[0-2])$/;

/**
 * Checks if ISO date-string is date-only.
 */
export function isIsoDateOnly(dateString: string) {
  return dateOnlyRegex.test(dateString);
}

/**
 * Checks if ISO date-string is month-only.
 */
export function isIsoMonthOnly(dateString: string) {
  return monthOnlyRegex.test(dateString);
}
