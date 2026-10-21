// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from '../../../../../types/option';
import { DropdownOption } from '../../../option/interfaces';
import { flattenOptions } from '../../../option/utils/flatten-options';
import { multiSelection } from '../multi-selection';

const flatten = (options: ReadonlyArray<OptionDefinition | OptionGroup>) => flattenOptions(options).flatOptions;
const findByValue = (list: ReadonlyArray<DropdownOption>, value: string | undefined) =>
  list.find(item => item.type !== 'parent' && (item.option as OptionDefinition).value === value)!;
const findGroup = (list: ReadonlyArray<DropdownOption>) => list.find(item => item.type === 'parent')!;
const values = (options: ReadonlyArray<OptionDefinition>) => options.map(option => option.value).sort();

// Select-all is not part of the flattened option lists; the list builds it separately and feeds it to the model.
const selectAll: DropdownOption = { type: 'select-all', option: { label: 'Select all' } };

describe('multiSelection', () => {
  test('choosing an unselected option adds it, choosing a selected option removes it', () => {
    const list = flatten([{ value: '1' }, { value: '2' }]);
    const added = multiSelection([{ value: '1' }], { options: list }).getNextSelection(findByValue(list, '2'));
    expect(values(added)).toEqual(['1', '2']);
    const removed = multiSelection([{ value: '1' }, { value: '2' }], { options: list }).getNextSelection(
      findByValue(list, '2')
    );
    expect(values(removed)).toEqual(['1']);
  });

  test('an option with an empty-string value toggles like any other option', () => {
    const list = flatten([{ value: '' }, { value: '2' }]);
    const added = multiSelection([], { options: list }).getNextSelection(findByValue(list, ''));
    expect(values(added)).toEqual(['']);
    const removed = multiSelection([{ value: '' }], { options: list }).getNextSelection(findByValue(list, ''));
    expect(removed).toEqual([]);
  });

  test('toggling a group only toggles its enabled children', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b', disabled: true }] }]);
    const model = multiSelection([], { options: list, interactiveGroups: true });
    // The disabled child 'b' is excluded from the toggle set.
    expect(values(model.getNextSelection(findGroup(list)))).toEqual(['a']);
  });

  test('toggling a group only affects children that are currently visible', () => {
    const allList = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const visibleList = flatten([{ label: 'Group', options: [{ value: 'a' }] }]);
    const model = multiSelection([], { options: visibleList, allOptions: allList, interactiveGroups: true });
    // 'b' is filtered out of the visible options, so toggling the group leaves it untouched.
    expect(values(model.getNextSelection(findGroup(visibleList)))).toEqual(['a']);
  });

  test('select-all is checked only when every option in allOptions is selected, including filtered-out ones', () => {
    const allList = flatten([{ value: '1' }, { value: '2' }]);
    const visibleList = flatten([{ value: '1' }]);
    // Only the visible option is selected; the hidden option '2' is not, so select-all is not fully checked.
    const partial = multiSelection([{ value: '1' }], {
      options: visibleList,
      allOptions: allList,
      interactiveGroups: true,
    });
    expect(partial.getGroupState(selectAll)).toEqual({ selected: false, indeterminate: true });

    const full = multiSelection([{ value: '1' }, { value: '2' }], {
      options: visibleList,
      allOptions: allList,
      interactiveGroups: true,
    });
    expect(full.getGroupState(selectAll)).toEqual({ selected: true, indeterminate: false });
  });

  test('toggling select-all changes only visible enabled options and keeps hidden selections', () => {
    const allList = flatten([{ value: '1' }, { value: '2' }, { value: '3', disabled: true }]);
    const visibleList = flatten([{ value: '1' }, { value: '3', disabled: true }]);
    // '2' is a hidden selection; '3' is a visible but disabled option.
    const model = multiSelection([{ value: '2' }], {
      options: visibleList,
      allOptions: allList,
      interactiveGroups: true,
    });
    const next = model.getNextSelection(selectAll);
    // Hidden '2' is kept, visible enabled '1' is added, visible disabled '3' is left unchanged.
    expect(values(next)).toEqual(['1', '2']);
  });

  test('toggling select-all off keeps hidden selections and clears the visible enabled options', () => {
    const allList = flatten([{ value: '1' }, { value: '2' }]);
    const visibleList = flatten([{ value: '1' }]);
    // Everything visible is already selected, so toggling select-all deselects the visible options only.
    const model = multiSelection([{ value: '1' }, { value: '2' }], {
      options: visibleList,
      allOptions: allList,
      interactiveGroups: true,
    });
    expect(values(model.getNextSelection(selectAll))).toEqual(['2']);
  });

  test('a group is indeterminate when some but not all children are selected', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const model = multiSelection([{ value: 'a' }], { options: list, interactiveGroups: true });
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: true });
  });

  test('a group is selected when all children are selected', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const model = multiSelection([{ value: 'a' }, { value: 'b' }], { options: list, interactiveGroups: true });
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: true, indeterminate: false });
  });

  test('choosing a disabled option that is not selected leaves the selection unchanged', () => {
    const list = flatten([{ value: '1' }, { value: '2', disabled: true }]);
    const model = multiSelection([{ value: '1' }], { options: list });
    expect(model.getNextSelection(findByValue(list, '2'))).toEqual([{ value: '1' }]);
  });

  test('deselecting a group keeps its selected disabled children', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b', disabled: true }] }]);
    const model = multiSelection([{ value: 'a' }, { value: 'b', disabled: true }], {
      options: list,
      interactiveGroups: true,
    });
    expect(values(model.getNextSelection(findGroup(list)))).toEqual(['b']);
  });

  test('deselecting a group keeps selections outside the group', () => {
    const list = flatten([{ value: 'x' }, { label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const model = multiSelection([{ value: 'x' }, { value: 'a' }, { value: 'b' }], {
      options: list,
      interactiveGroups: true,
    });
    expect(values(model.getNextSelection(findGroup(list)))).toEqual(['x']);
  });

  test('newly chosen options are appended after the existing selection', () => {
    const list = flatten([{ value: '1' }, { value: '2' }, { value: '3' }]);
    const model = multiSelection([{ value: '3' }], { options: list });
    expect(model.getNextSelection(findByValue(list, '1')).map(option => option.value)).toEqual(['3', '1']);
  });

  test('select-all turns off when every visible enabled option is selected, even if a disabled one is not', () => {
    const list = flatten([{ value: '1' }, { value: '2', disabled: true }]);
    const model = multiSelection([{ value: '1' }], { options: list, interactiveGroups: true });
    expect(model.getNextSelection(selectAll)).toEqual([]);
  });

  test('removing an option that is not in the visible list deselects it', () => {
    const list = flatten([{ value: '1' }]);
    const model = multiSelection([{ value: '1' }, { value: '9' }], { options: list });
    expect(values(model.getNextSelection({ option: { value: '9' } }))).toEqual(['1']);
  });

  test('a fully selected group is not shown as selected when groups are not interactive', () => {
    const list = flatten([{ label: 'Group', options: [{ value: 'a' }, { value: 'b' }] }]);
    const model = multiSelection([{ value: 'a' }, { value: 'b' }], { options: list });
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: false });
  });

  test('a selected child with an empty-string value is not counted as a group selection', () => {
    const list = flatten([{ label: 'Group', options: [{ value: '' }, { value: 'b' }] }]);
    const model = multiSelection([{ value: '' }], { options: list, interactiveGroups: true });
    expect(model.getGroupState(findGroup(list))).toEqual({ selected: false, indeterminate: false });
  });
});
