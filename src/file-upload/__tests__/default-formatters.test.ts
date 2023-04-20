// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { formatFileSize } from '../default-formatters';

describe('file upload default formatters', () => {
  test('rounds file size to KB', () => {
    expect(formatFileSize(0)).toBe('0.00 KB');
    expect(formatFileSize(10)).toBe('0.01 KB');
    expect(formatFileSize(100)).toBe('0.10 KB');
    expect(formatFileSize(1000)).toBe('1.00 KB');
    expect(formatFileSize(10_000)).toBe('10.00 KB');
    expect(formatFileSize(100_000)).toBe('100.00 KB');
    expect(formatFileSize(1_000_000 - 6)).toBe('999.99 KB');
    expect(formatFileSize(1_000_000 - 5)).toBe('1000.00 KB');
  });

  test('rounds file size to MB', () => {
    expect(formatFileSize(1_000_000)).toBe('1.00 MB');
    expect(formatFileSize(1_000_000 + 5001)).toBe('1.01 MB');
    expect(formatFileSize(1_000_000_000 - 5001)).toBe('999.99 MB');
    expect(formatFileSize(1_000_000_000 - 5000)).toBe('1000.00 MB');
  });

  test('rounds file size to GB', () => {
    expect(formatFileSize(1_000_000_000)).toBe('1.00 GB');
  });

  test('rounds file size to TB', () => {
    expect(formatFileSize(1_000_000_000_000)).toBe('1.00 TB');
  });
});
