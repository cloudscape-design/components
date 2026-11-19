// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { MultiselectProps } from '../interfaces';

const options: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  {
    label: 'Group',
    value: 'group',
    options: [
      { label: 'Apple', value: 'a' },
      { label: 'Banana', value: 'b' },
      { label: 'Avocado', value: 'c' },
      { label: 'Apricot', value: 'd', disabled: true },
    ],
  },
];

const renderMultiselect = (props: Partial<MultiselectProps>) => {
  const { container } = render(<Multiselect options={options} selectedOptions={[]} onChange={() => null} {...props} />);
  return createWrapper(container).findMultiselect()!;
};

const selectedValues = (onChange: jest.Mock) =>
  onChange.mock.calls[0][0].detail.selectedOptions.map((option: MultiselectProps.Option) => option.value);

describe('Multiselect selection', () => {
  test('choosing a group while filtering selects only its visible enabled options', () => {
    const onChange = jest.fn();
    const wrapper = renderMultiselect({ onChange, filteringType: 'auto' });
    wrapper.openDropdown();
    wrapper.findFilteringInput()!.setInputValue('A');
    wrapper.selectOptionByValue('group');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(selectedValues(onChange)).toEqual(['a', 'b', 'c']);

    onChange.mockClear();
    wrapper.findFilteringInput()!.setInputValue('Ap');
    wrapper.selectOptionByValue('group');
    expect(selectedValues(onChange)).toEqual(['a']);
  });

  test('choosing a partially selected group appends all its enabled options after other selections', () => {
    const onChange = jest.fn();
    const wrapper = renderMultiselect({
      onChange,
      selectedOptions: [
        { label: 'Banana', value: 'b' },
        { label: 'First', value: '1' },
      ],
    });
    wrapper.openDropdown();
    wrapper.selectOptionByValue('group');
    expect(selectedValues(onChange)).toEqual(['1', 'a', 'b', 'c']);
  });

  test('does not render select all when filtering matches no options', () => {
    const wrapper = renderMultiselect({ enableSelectAll: true, filteringType: 'auto' });
    wrapper.openDropdown();
    expect(wrapper.findDropdown().findSelectAll()).not.toBeNull();
    wrapper.findFilteringInput()!.setInputValue('no such option');
    expect(wrapper.findDropdown().findSelectAll()).toBeNull();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(0);
  });
});
