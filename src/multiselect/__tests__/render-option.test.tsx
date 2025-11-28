// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { optionsWithGroups } from './common';

describe('Multiselect renderOption', () => {
  function renderMultiselect(props?: Partial<MultiselectProps>) {
    const { container } = render(
      <Multiselect selectedOptions={[]} onChange={() => {}} options={props?.options ?? []} {...props} />
    );
    return createWrapper(container).findMultiselect()!;
  }

  test('renders custom option content', () => {
    const renderOption = jest.fn(item => <div data-testid="custom">{item.option.label}</div>);
    const wrapper = renderMultiselect({ options: optionsWithGroups, renderOption });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalled();
    expect(wrapper.findDropdown().getElement().querySelector('[data-testid="custom"]')).toBeTruthy();
  });

  test('receives correct item properties for child option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const childOption = { label: 'Test', value: '1' };
    const wrapper = renderMultiselect({
      options: [childOption],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        option: expect.objectContaining(childOption),
        selected: false,
        highlighted: false,
        disabled: false,
        type: 'child',
      })
    );
  });

  test('receives correct item properties for parent option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const groupOption = { label: 'Group', value: 'g1', options: [{ label: 'Child', value: 'c1' }] };
    const wrapper = renderMultiselect({
      options: [groupOption],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        option: expect.objectContaining(groupOption),
        selected: false,
        highlighted: false,
        disabled: false,
        type: 'parent',
      })
    );
  });

  test('receives correct item properties for select-all option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const wrapper = renderMultiselect({
      options: [{ label: 'Test', value: '1' }],
      renderOption,
      enableSelectAll: true,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'select-all',
      })
    );
  });

  test('reflects highlighted state', () => {
    const renderOption = jest.fn(item => <div>{item.highlighted ? 'highlighted' : 'normal'}</div>);
    const wrapper = renderMultiselect({ options: [{ label: 'First', value: '1' }], renderOption });
    wrapper.openDropdown();
    wrapper.findDropdown().findOptionsContainer()!.keydown(KeyCode.down);
    expect(wrapper.findDropdown().getElement().textContent).toContain('highlighted');
  });

  test('reflects disabled state', () => {
    const renderOption = jest.fn(item => <div>{item.disabled ? 'disabled' : 'enabled'}</div>);
    const wrapper = renderMultiselect({
      options: [{ label: 'Test', value: '1', disabled: true }],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }));
  });

  test('reflects selected state', () => {
    const renderOption = jest.fn(item => <div>{item.selected ? 'selected' : 'unselected'}</div>);
    const option = { label: 'Test', value: '1' };
    const wrapper = renderMultiselect({
      options: [option],
      selectedOptions: [option],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(expect.objectContaining({ selected: true }));
  });

  test('reflects partial selection state for parent option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const groupOption = {
      label: 'Group',
      value: 'g1',
      options: [
        { label: 'Child1', value: 'c1' },
        { label: 'Child2', value: 'c2' },
      ],
    };
    const wrapper = renderMultiselect({
      options: [groupOption],
      selectedOptions: [{ label: 'Child1', value: 'c1' }],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'parent',
        selected: false,
      })
    );
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'child',
        selected: true,
      })
    );
  });

  test('allows selection with custom rendered options', () => {
    const onChange = jest.fn();
    const renderOption = jest.fn(item => <div>{item.option.value}</div>);
    const wrapper = renderMultiselect({
      options: [
        { label: 'Test', value: '1' },
        { label: 'Test 2', value: '2' },
      ],
      renderOption,
      onChange,
    });
    wrapper.openDropdown();
    wrapper.selectOptionByValue('2');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { selectedOptions: [expect.objectContaining({ value: '2' })] } })
    );
  });
});
