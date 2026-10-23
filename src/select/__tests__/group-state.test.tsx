// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import Select from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { renderHook } from '../../__tests__/render-hook';
import { singleSelection } from '../../internal/components/listbox/selection/single-selection';
import { flattenOptions } from '../../internal/components/option/utils/flatten-options';
import { OptionDefinition, OptionGroup } from '../../types/option';
import { SelectProps } from '../interfaces';
import { useSelect } from '../utils/use-select';

import selectableStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

const values = (...values: string[]) => values.map(value => ({ value }));

const renderUseSelect = (
  options: ReadonlyArray<OptionDefinition | OptionGroup>,
  selectedOptions: ReadonlyArray<OptionDefinition>,
  withSelection = true
) => {
  const { flatOptions } = flattenOptions(options);
  const hook = renderHook(useSelect, {
    initialProps: {
      selectedOptions,
      selection: withSelection ? singleSelection(selectedOptions) : undefined,
      updateSelectedOption: () => {},
      options: flatOptions,
      externalRef: createRef(),
      filteringType: 'none',
      fireLoadItems: () => {},
      setFilteringValue: () => {},
      statusType: 'finished' as const,
    },
  });
  const { getOptionProps } = hook.result.current;
  return { flatOptions, getOptionProps };
};

const groupStates = (
  options: ReadonlyArray<OptionDefinition | OptionGroup>,
  selectedOptions: ReadonlyArray<OptionDefinition>
) => {
  const { flatOptions, getOptionProps } = renderUseSelect(options, selectedOptions);
  return flatOptions
    .map((option, index) => ({ option, props: getOptionProps(option, index) }))
    .filter(({ option }) => option.type === 'parent')
    .map(({ props }) => ({ selected: props.selected, indeterminate: props.indeterminate }));
};

describe('useSelect group state with single selection', () => {
  test('a group with one of several children selected is indeterminate, not selected', () => {
    expect(groupStates([{ label: 'Group', options: values('a', 'b', 'c') }], values('b'))).toEqual([
      { selected: false, indeterminate: true },
    ]);
  });

  test('the same value in two groups makes both groups indeterminate', () => {
    expect(
      groupStates(
        [
          { label: 'Group 1', options: values('a', 'shared') },
          { label: 'Group 2', options: values('shared', 'b') },
        ],
        values('shared')
      )
    ).toEqual([
      { selected: false, indeterminate: true },
      { selected: false, indeterminate: true },
    ]);
  });

  test('a selected value that is not in the options leaves groups unselected', () => {
    expect(groupStates([{ label: 'Group', options: values('a', 'b') }], values('x'))).toEqual([
      { selected: false, indeterminate: false },
    ]);
  });

  test('omitting selection gives the same option props as passing single selection', () => {
    const options = [{ value: 'top' }, { label: 'Group', options: values('a', 'b', 'c') }];
    const selectedOptions = values('b');
    const withModel = renderUseSelect(options, selectedOptions, true);
    const withoutModel = renderUseSelect(options, selectedOptions, false);
    // Ids come from a per-hook unique id, so they're left out of the comparison.
    const propsWithoutId = ({ getOptionProps, flatOptions }: ReturnType<typeof renderUseSelect>) =>
      flatOptions.map((option, index) => {
        const props = { ...getOptionProps(option, index) };
        delete props.id;
        return props;
      });
    expect(propsWithoutId(withoutModel)).toEqual(propsWithoutId(withModel));
  });
});

describe('Select group row state', () => {
  const renderSelect = (props: Partial<SelectProps>) => {
    const { container } = render(<Select options={[]} selectedOption={null} onChange={() => null} {...props} />);
    return createWrapper(container).findSelect()!;
  };
  const rowOf = (element: HTMLElement) => element.closest(`.${selectableStyles['selectable-item']}`)!;

  test('selecting a child in a multi-child group does not mark the group header as selected', () => {
    const wrapper = renderSelect({
      options: [{ value: 'top' }, { label: 'Group', options: values('a', 'b', 'c') }],
      selectedOption: { value: 'b' },
    });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown();

    expect(rowOf(dropdown.findGroup(1)!.getElement())).not.toHaveClass(selectableStyles.selected);
    expect(rowOf(dropdown.findOptionByValue('top')!.getElement())).not.toHaveClass(
      selectableStyles['next-item-selected']
    );
    expect(rowOf(dropdown.findOptionByValue('a')!.getElement())).not.toHaveClass(
      selectableStyles['previous-item-selected']
    );
    expect(rowOf(dropdown.findOptionByValue('b')!.getElement())).toHaveClass(selectableStyles.selected);
  });

  test('selecting the only child of a group does not mark the group header as selected', () => {
    const wrapper = renderSelect({
      options: [{ label: 'Group', options: values('a') }],
      selectedOption: { value: 'a' },
    });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown();

    expect(rowOf(dropdown.findGroup(1)!.getElement())).not.toHaveClass(selectableStyles.selected);
    expect(rowOf(dropdown.findOptionByValue('a')!.getElement())).toHaveClass(selectableStyles.selected);
  });
});
