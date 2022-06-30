// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Joins strings with a whitespace, discarding empty strings. Useful to combine multiple aria-labels.
export const joinStrings = (...strings: Array<string | undefined>) => {
  const result = strings.filter(val => val).join(' ');
  return result || undefined;
};
