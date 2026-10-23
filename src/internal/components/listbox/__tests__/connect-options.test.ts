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

  test('should return an empty array when there are no selected options', () => {
    expect(connectOptionsByValue([{ option: { value: '1' } }], [])).toEqual([]);
  });

  test('should preserve the order of the selected options', () => {
    const options = [{ option: { value: '1' } }, { option: { value: '2' } }, { option: { value: '3' } }];
    const result = connectOptionsByValue(options, [{ value: '3' }, { value: '1' }]);
    expect(result).toEqual([{ option: { value: '3' } }, { option: { value: '1' } }]);
  });

  test('should skip parent options when matching by value', () => {
    const child = { option: { value: '1' }, type: 'child' as const };
    const parent = { option: { value: '1' }, type: 'parent' as const };
    const result = connectOptionsByValue([parent, child], [{ value: '1' }]);
    expect(result[0]).toBe(child);
  });

  test('should return the first matching option when multiple share the same value', () => {
    const first = { option: { value: '1', label: 'first' } };
    const second = { option: { value: '1', label: 'second' } };
    const result = connectOptionsByValue([first, second], [{ value: '1' }]);
    expect(result[0]).toBe(first);
  });

  test('should match options with an undefined value', () => {
    const option = { option: { label: 'no value' } };
    const result = connectOptionsByValue([option], [{ label: 'no value' }]);
    expect(result[0]).toBe(option);
  });
});
