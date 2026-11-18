// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from '../../../../types/option';
import { DropdownOption } from '../../option/interfaces';
import { flattenOptions } from '../../option/utils/flatten-options';
import { getOptionId } from '../../options-list/utils/use-ids';
import { multiSelection } from '../selection/multi-selection';
import { singleSelection } from '../selection/single-selection';
import { connectOptionsByValue } from '../utils/connect-options';
import {
  getListboxOptionProps,
  getListMouseHandlers,
  getSelectableOption,
  isAnnouncedSelected,
  isHighlightable,
} from '../utils/option-props';

const flatten = (options: ReadonlyArray<OptionDefinition | OptionGroup>) => flattenOptions(options).flatOptions;
const selectedSetOf = (options: ReadonlyArray<DropdownOption>, selected: ReadonlyArray<OptionDefinition>) =>
  new Set(connectOptionsByValue(options, selected));

describe('isHighlightable', () => {
  test('group headers are highlightable only with interactive groups', () => {
    const header: DropdownOption = { type: 'parent', option: { label: 'Group', options: [] } };
    expect(isHighlightable(header, false)).toBe(false);
    expect(isHighlightable(header, true)).toBe(true);
    expect(isHighlightable({ option: { value: '1' } }, false)).toBe(true);
    expect(isHighlightable(undefined, true)).toBe(false);
  });
});

describe('getListboxOptionProps', () => {
  test('single selection marks the selected option and highlight', () => {
    const options = flatten([{ value: '1' }, { value: '2' }]);
    const selected = [{ value: '2' }];
    const context = {
      options,
      selectedSet: selectedSetOf(options, selected),
      selection: singleSelection(selected),
      highlightedOption: options[0],
      interactiveGroups: false,
      listId: 'list',
    };
    expect(getListboxOptionProps(options[0], 0, context)).toEqual({
      key: 0,
      option: options[0],
      highlighted: true,
      selected: false,
      isNextSelected: true,
      isPreviousSelected: false,
      indeterminate: false,
      'data-mouse-target': 0,
      id: getOptionId('list', 0),
    });
    expect(getListboxOptionProps(options[1], 1, context)).toMatchObject({ highlighted: false, selected: true });
  });

  test('multi selection uses group state for headers and group neighbours', () => {
    const options = flatten([
      { label: 'A', options: [{ value: 'a1' }, { value: 'a2' }] },
      { label: 'B', options: [{ value: 'b1' }] },
    ]);
    const selected = [{ value: 'a1' }, { value: 'b1' }];
    const context = {
      options,
      selectedSet: selectedSetOf(options, selected),
      selection: multiSelection(selected, { options, interactiveGroups: true }),
      highlightedOption: undefined,
      interactiveGroups: true,
      listId: 'list',
    };
    // [A, a1, a2, B, b1]
    expect(getListboxOptionProps(options[0], 0, context)).toMatchObject({ selected: false, indeterminate: true });
    expect(getListboxOptionProps(options[3], 3, context)).toMatchObject({ selected: true, indeterminate: false });
    // a2's next neighbour is the fully selected group B; its previous neighbour a1 is selected.
    expect(getListboxOptionProps(options[2], 2, context)).toMatchObject({
      selected: false,
      isNextSelected: true,
      isPreviousSelected: true,
    });
  });

  test('select-all gets group state but never counts as a selected neighbour', () => {
    const items = flatten([{ value: '1' }]);
    const selectAll: DropdownOption = { type: 'select-all', option: { label: 'Select all' } };
    const options = [selectAll, ...items];
    const selected = [{ value: '1' }];
    const context = {
      options,
      selectedSet: selectedSetOf(items, selected),
      selection: multiSelection(selected, { options: items }),
      highlightedOption: undefined,
      interactiveGroups: true,
      listId: 'list',
    };
    expect(getListboxOptionProps(selectAll, 0, context)).toMatchObject({ selected: true, isNextSelected: true });
    expect(getListboxOptionProps(options[1], 1, context)).toMatchObject({ selected: true, isPreviousSelected: false });
  });

  test('non-highlightable group headers get data-mouse-target -1', () => {
    const options = flatten([{ label: 'A', options: [{ value: 'a1' }] }]);
    const context = {
      options,
      selectedSet: new Set<DropdownOption>(),
      selection: singleSelection([]),
      highlightedOption: undefined,
      interactiveGroups: false,
      listId: 'list',
    };
    expect(getListboxOptionProps(options[0], 0, context)['data-mouse-target']).toBe(-1);
    expect(getListboxOptionProps(options[1], 1, context)['data-mouse-target']).toBe(1);
  });
});

describe('isAnnouncedSelected', () => {
  test('announces selected options and fully selected groups', () => {
    const options = flatten([{ label: 'A', options: [{ value: 'a1' }] }, { value: '2' }]);
    const selected = [{ value: 'a1' }];
    const selectedSet = selectedSetOf(options, selected);
    const selection = multiSelection(selected, { options, interactiveGroups: true });
    expect(isAnnouncedSelected(undefined, selectedSet, selection)).toBe(false);
    expect(isAnnouncedSelected(options[0], selectedSet, selection)).toBe(true);
    expect(isAnnouncedSelected(options[1], selectedSet, selection)).toBe(true);
    expect(isAnnouncedSelected(options[2], selectedSet, selection)).toBe(false);
  });
});

describe('getSelectableOption', () => {
  const isEnabled = (option: DropdownOption) => !option.option.disabled;
  const first: DropdownOption = { option: { value: '1' } };
  const highlighted: DropdownOption = { option: { value: '2' } };
  const disabled: DropdownOption = { option: { value: '3', disabled: true } };

  test('returns the given option, or the highlighted option when omitted', () => {
    expect(getSelectableOption(first, highlighted, isEnabled)).toBe(first);
    expect(getSelectableOption(undefined, highlighted, isEnabled)).toBe(highlighted);
  });

  test('returns undefined when there is nothing to choose or it is not interactive', () => {
    expect(getSelectableOption(undefined, undefined, isEnabled)).toBeUndefined();
    expect(getSelectableOption(disabled, highlighted, isEnabled)).toBeUndefined();
    expect(getSelectableOption(undefined, disabled, isEnabled)).toBeUndefined();
  });
});

describe('getListMouseHandlers', () => {
  const options = flatten([{ value: '1' }, { value: '2' }]);

  test('selects and highlights the option under the pointer', () => {
    const selectOption = jest.fn();
    const setHighlightedIndexWithMouse = jest.fn();
    const handlers = getListMouseHandlers({ options, selectOption, setHighlightedIndexWithMouse });
    handlers.onMouseUp(1);
    handlers.onMouseMove(0);
    expect(selectOption).toHaveBeenCalledWith(options[1]);
    expect(setHighlightedIndexWithMouse).toHaveBeenCalledWith(0);
  });

  test('ignores pointer events outside a highlightable option', () => {
    const selectOption = jest.fn();
    const setHighlightedIndexWithMouse = jest.fn();
    const handlers = getListMouseHandlers({ options, selectOption, setHighlightedIndexWithMouse });
    handlers.onMouseUp(-1);
    handlers.onMouseMove(-1);
    expect(selectOption).not.toHaveBeenCalled();
    expect(setHighlightedIndexWithMouse).not.toHaveBeenCalled();
  });
});
