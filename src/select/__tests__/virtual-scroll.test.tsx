// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps: SelectProps = {
  options: [
    { value: '1', label: 'One' },
    { value: '2', lang: 'Two' },
    { value: '3', lang: 'Three' },
  ],
  virtualScroll: true,
  selectedOption: null,
  onChange: () => {},
};

function renderWithWrapper(ui: React.ReactElement) {
  const { container } = render(ui);
  return createWrapper(container).findSelect()!;
}

describe('Virtual scroll support', () => {
  test('should render plain virtual list', () => {
    const wrapper = renderWithWrapper(<Select {...defaultProps} />);
    wrapper.openDropdown();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(3);
  });

  test('should render virtual list with groups', () => {
    const wrapper = renderWithWrapper(
      <Select
        {...defaultProps}
        options={[
          { label: 'Group 1', options: [{ value: '1' }, { value: '2' }] },
          { label: 'Group 2', options: [{ value: '3' }] },
        ]}
      />
    );
    wrapper.openDropdown();
    expect(wrapper.findDropdown().findOptions()).toHaveLength(3);
    expect(wrapper.findDropdown().findOptionInGroup(1, 1)).toBeTruthy();
    expect(wrapper.findDropdown().findOptionInGroup(2, 1)).toBeTruthy();
  });

  test('should select an option in virtual list', () => {
    const onChange = jest.fn();
    const wrapper = renderWithWrapper(<Select {...defaultProps} onChange={event => onChange(event.detail)} />);
    wrapper.openDropdown();
    wrapper.selectOptionByValue('2');
    expect(onChange).toHaveBeenCalledWith({ selectedOption: defaultProps.options![1] });
  });
});
