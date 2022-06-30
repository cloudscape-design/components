// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { connectOptionsByValue, findOptionIndex } from '../utils/connect-options';

describe('findOptionIndex', () => {
  test('should return -1 when no match', () => {
    const index = findOptionIndex([{ value: '1' }], { value: '2' });
    expect(index).toBe(-1);
  });

  test('should return index when there is a match by value', () => {
    const index = findOptionIndex([{ value: '1' }], { value: '1' });
    expect(index).toBe(0);
  });

  test('should return index when there is a match by reference', () => {
    const option = { value: '1' };
    const index = findOptionIndex([option], option);
    expect(index).toBe(0);
  });
});

describe('connectOptionsByValue', () => {
  test('should return initial array if there are no matches', () => {
    const result = connectOptionsByValue([{ option: { value: '1' } }], [{ value: '2' }]);
    expect(result).toEqual([{ option: { value: '2' } }]);
  });

  test('should take an item from the options array if there is a match by value', () => {
    const option = { value: '1', label: '1' };
    const result = connectOptionsByValue([{ option }], [{ value: '1' }]);
    expect(result[0]).toEqual({ option });
  });
});
