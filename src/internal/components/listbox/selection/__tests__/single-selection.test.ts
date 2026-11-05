// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from '../../../../../types/option';
import { DropdownOption } from '../../../option/interfaces';
import { flattenOptions } from '../../../option/utils/flatten-options';
import { singleSelection } from '../single-selection';

const flatten = (options: ReadonlyArray<OptionDefinition | OptionGroup>) => flattenOptions(options).flatOptions;
const findByValue = (list: ReadonlyArray<DropdownOption>, value: string | undefined) =>
  list.find(item => (item.option as OptionDefinition).value === value)!;
const findGroup = (list: ReadonlyArray<DropdownOption>) => list.find(item => item.type === 'parent')!;

describe('singleSelection', () => {
  test('choosing an option returns only that option as the next selection', () => {
    const list = flatten([{ value: '1' }, { value: '2' }]);
    const model = singleSelection([]);
    expect(model.getNextSelection(findByValue(list, '2'))).toEqual([{ value: '2' }]);
  });

  test('re-choosing the already selected option keeps it selected', () => {
    const list = flatten([{ value: '1' }, { value: '2' }]);
    const model = singleSelection([{ value: '2' }]);
    expect(model.getNextSelection(findByValue(list, '2'))).toEqual([{ value: '2' }]);
  });

  test('a selected child with an empty-string value is not counted as a group selection', () => {
    const list = flatten([{ label: 'Group', options: [{ value: '' }, { value: 'b' }] }]);
    const model = singleSelection([{ value: '' }]);
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: false });
  });

  test('a group with some but not all children selected is indeterminate and not selected', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const model = singleSelection([{ value: 'a' }]);
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: true });
  });

  test('a group whose only child is the selected one is not indeterminate (all children selected)', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }] }]);
    const model = singleSelection([{ value: 'a' }]);
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: false });
  });

  test('a non-group option has no group state', () => {
    const list = flatten([{ value: '1' }]);
    const model = singleSelection([{ value: '1' }]);
    expect(model.getGroupState(findByValue(list, '1'))).toEqual({ selected: false, indeterminate: false });
  });

  test('only the first selected option is kept', () => {
    expect(singleSelection([{ value: '1' }, { value: '2' }]).selectedOptions).toEqual([{ value: '1' }]);
  });

  test('a selected option without a value does not mark its group as indeterminate', () => {
    const list = flatten([{ label: 'Group', options: [{ label: 'No value' }, { value: 'b' }] }]);
    const model = singleSelection([{ label: 'No value' }]);
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: false });
  });
});
