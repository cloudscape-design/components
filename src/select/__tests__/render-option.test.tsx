// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defaultOptions } from './common';

describe('Select renderOption', () => {
  function renderSelect(props?: Partial<SelectProps>) {
    const { container } = render(
      <Select selectedOption={null} onChange={() => {}} options={props?.options ?? []} {...props} />
    );
    return createWrapper(container).findSelect()!;
  }

  test('renders custom option content', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const wrapper = renderSelect({ options: defaultOptions, renderOption });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalled();
    const elementWrapper = wrapper.findDropdown().findOption(1)!.getElement();
    expect(elementWrapper).not.toBeNull();
    expect(elementWrapper).toHaveTextContent('Custom');
  });

  test('receives correct item properties for item option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const childOption = { label: 'Test', value: '1' };
    const wrapper = renderSelect({
      options: [childOption],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          option: expect.objectContaining(childOption),
          selected: false,
          highlighted: false,
          disabled: false,
          type: 'item',
        }),
      })
    );
  });
  test('receives correct item properties for group option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const groupOption = { label: 'Group', value: 'g1', options: [{ label: 'Child', value: 'c1' }] };
    const wrapper = renderSelect({
      options: [groupOption],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          option: expect.objectContaining(groupOption),
          disabled: false,
          type: 'group',
        }),
      })
    );
  });

  test('receives correct item properties for trigger option', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const selectedOption = { label: 'Test', value: '1' };
    const wrapper = renderSelect({
      options: [selectedOption],
      selectedOption,
      triggerVariant: 'option',
      renderOption,
    });
    const triggerWrapper = wrapper.findTrigger()!;
    expect(triggerWrapper).not.toBeNull();
    expect(triggerWrapper.getElement()).toHaveTextContent('Custom');
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        filterText: undefined,
        item: expect.objectContaining({
          type: 'trigger',
          option: expect.objectContaining(selectedOption),
        }),
      })
    );
  });

  test('reflects highlighted state', () => {
    const renderOption = jest.fn(props => <div>{props.item.highlighted ? 'highlighted' : 'normal'}</div>);
    const wrapper = renderSelect({ options: [{ label: 'First', value: '1' }], renderOption });
    wrapper.openDropdown();
    wrapper.findDropdown().findOptionsContainer()!.keydown(KeyCode.down);
    expect(wrapper.findDropdown().getElement().textContent).toContain('highlighted');
  });
  test('reflects selected state', () => {
    const renderOption = jest.fn(props => <div>{props.item.selected ? 'selected' : 'not-selected'}</div>);
    const option = { label: 'Test', value: '1' };
    const wrapper = renderSelect({
      options: [option],
      selectedOption: option,
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ selected: true }),
      })
    );
  });
  test('renders children within groups correctly', () => {
    const renderOption = jest.fn(props => (
      <div>
        {props.item.type}-{props.item.option.label}
      </div>
    ));
    const wrapper = renderSelect({
      options: [{ label: 'Group', options: [{ label: 'Child', value: 'c1' }] }],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ type: 'item' }),
      })
    );
  });

  test('receives correct parent attribute for child item in group', () => {
    const renderOption = jest.fn(() => <div>Custom</div>);
    const groupOption = { label: 'Parent Group', value: 'g1', options: [{ label: 'Child Item', value: 'c1' }] };
    const wrapper = renderSelect({
      options: [groupOption],
      renderOption,
    });
    wrapper.openDropdown();

    // Verify that the child item receives the correct parent attribute
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'item',
          option: expect.objectContaining({ label: 'Child Item', value: 'c1' }),
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining(groupOption),
          }),
        }),
      })
    );
  });
  test('reflects disabled state', () => {
    const renderOption = jest.fn(props => <div>{props.item.disabled ? 'disabled' : 'enabled'}</div>);
    const wrapper = renderSelect({
      options: [{ label: 'Test', value: '1', disabled: true }],
      renderOption,
    });
    wrapper.openDropdown();
    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          disabled: true,
        }),
      })
    );
  });
  test('allows selection with custom rendered options', () => {
    const onChange = jest.fn();
    const renderOption = jest.fn(props => <div>{props.item.option.value}</div>);
    const wrapper = renderSelect({
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
      expect.objectContaining({ detail: { selectedOption: expect.objectContaining({ value: '2' }) } })
    );
  });
});
