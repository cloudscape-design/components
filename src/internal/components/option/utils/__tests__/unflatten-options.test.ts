// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../interfaces';
import { unflattenOptions } from '../unflatten-options';

describe('unflattenOptions', () => {
  test('should handle parent with children', () => {
    const options: DropdownOption[] = [
      { type: 'parent', option: { label: 'Group 1' } },
      { type: 'child', option: { label: 'Child 1' } },
      { type: 'child', option: { label: 'Child 2' } },
    ];

    const result = unflattenOptions(options);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('parent');
    expect(result[0].index).toBe(0);
    if (result[0].type === 'parent') {
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children[0].index).toBe(1);
      expect(result[0].children[1].index).toBe(2);
    }
  });

  test('should handle standalone options without type', () => {
    const options: DropdownOption[] = [{ option: { label: 'Option 1' } }, { option: { label: 'Option 2' } }];

    const result = unflattenOptions(options);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('child');
    expect(result[0].index).toBe(0);
    expect(result[1].type).toBe('child');
    expect(result[1].index).toBe(1);
  });

  test('should reset parent when encountering option without type', () => {
    const options: DropdownOption[] = [
      { option: { label: 'Standalone 1' } },
      { type: 'parent', option: { label: 'Group 1' } },
      { type: 'child', option: { label: 'Child 1' } },
      { option: { label: 'Standalone 2' } },
      { type: 'child', option: { label: 'Child 2' } },
    ];

    const result = unflattenOptions(options);

    expect(result).toHaveLength(4);

    expect(result[0].type).toBe('child');
    expect(result[0].option.option.label).toBe('Standalone 1');
    expect(result[1].type).toBe('parent');
    if (result[1].type === 'parent') {
      expect(result[1].children).toHaveLength(1);
      expect(result[1].children[0].option.option.label).toBe('Child 1');
    }
    expect(result[2].type).toBe('child');
    expect(result[2].option.option.label).toBe('Standalone 2');
    expect(result[3].type).toBe('child');
    expect(result[3].option.option.label).toBe('Child 2');
  });

  test('should handle empty options array', () => {
    const result = unflattenOptions([]);
    expect(result).toHaveLength(0);
  });

  test('should handle parent without children', () => {
    const options: DropdownOption[] = [
      { type: 'parent', option: { label: 'Group 1' } },
      { type: 'parent', option: { label: 'Group 2' } },
    ];

    const result = unflattenOptions(options);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('parent');
    expect(result[1].type).toBe('parent');
    if (result[0].type === 'parent') {
      expect(result[0].children).toHaveLength(0);
    }
    if (result[1].type === 'parent') {
      expect(result[1].children).toHaveLength(0);
    }
  });
});
