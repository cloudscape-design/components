// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { formatDefault, formatSize } from '../column-formats';

describe('formatDefault', () => {
  test('shows placeholder when value is undefined', () => {
    expect(formatDefault(undefined)).toEqual('-');
  });

  test('returns actual value when it exists', () => {
    expect(formatDefault('test')).toEqual('test');
  });
});

describe('formatBytes', () => {
  test('shows placeholder when value is undefined', () => {
    expect(formatSize(undefined)).toEqual('-');
  });

  test('converts zero input value to string', () => {
    expect(formatSize(0)).toEqual('0 Bytes');
  });

  test('converts size in Bytes to string', () => {
    expect(formatSize(987)).toEqual('987 Bytes');
  });

  test('converts size in MB to string', () => {
    expect(formatSize(1024 * 1024 * 117 + 1024 * 17)).toEqual('117.02 MB');
  });
});
