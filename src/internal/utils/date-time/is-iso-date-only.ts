// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks if ISO date-string is date-only.
 */
export function isIsoDateOnly(dateString: string) {
  return dateRegex.test(dateString);
}
