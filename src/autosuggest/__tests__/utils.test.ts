// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AutosuggestItem } from '../interfaces';
import { filterOptions } from '../utils/utils';

const option = (item: Partial<AutosuggestItem> & { value: string }): AutosuggestItem => ({
  option: { value: item.value },
  ...item,
});

const group = (label: string): AutosuggestItem => ({ type: 'parent', label, option: { label } });

describe('filterOptions', () => {
  test('matches on value, label, description and labelTag', () => {
    const options = [
      option({ value: 'one' }),
      option({ value: '2', label: 'two' }),
      option({ value: '3', description: 'three' }),
      option({ value: '4', labelTag: 'four' }),
    ];
    expect(filterOptions(options, 'one')).toEqual([options[0]]);
    expect(filterOptions(options, 'two')).toEqual([options[1]]);
    expect(filterOptions(options, 'three')).toEqual([options[2]]);
    expect(filterOptions(options, 'four')).toEqual([options[3]]);
  });

  test('matches on tags and filteringTags', () => {
    const options = [option({ value: '1', tags: ['alpha'] }), option({ value: '2', filteringTags: ['beta'] })];
    expect(filterOptions(options, 'alpha')).toEqual([options[0]]);
    expect(filterOptions(options, 'beta')).toEqual([options[1]]);
  });

  test('matching is case-insensitive in both directions', () => {
    const options = [option({ value: 'AbC' })];
    expect(filterOptions(options, 'abc')).toEqual(options);
    expect(filterOptions(options, 'ABC')).toEqual(options);
  });

  test('keeps groups that have matching children and drops empty ones', () => {
    const options = [group('Group 1'), option({ value: 'match' }), group('Group 2'), option({ value: 'other' })];
    expect(filterOptions(options, 'match')).toEqual([options[0], options[1]]);
  });

  test('returns all options for an empty search text', () => {
    const options = [option({ value: 'one' }), option({ value: 'two' })];
    expect(filterOptions(options, '')).toEqual(options);
  });
});
