// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import { MultiselectProps } from '../interfaces';
import { optionsWithoutGroups, renderMultiselect } from './common';

const renderMultiselectWithSelectAll = (props?: Partial<MultiselectProps>) => {
  const { wrapper } = renderMultiselect({ ...(props || {}), enableSelectAll: true });
  return wrapper;
};
describe('Multiselect with "Select all" control', () => {
  describe('Mouse interactions', () => {
    test('selects all options when none are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ onChange });
      wrapper.openDropdown();
      wrapper.selectOption(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
      );
    });
    test('deselects all options when all are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ selectedOptions: optionsWithoutGroups, onChange });
      wrapper.openDropdown();
      wrapper.selectOption(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
    });
    test('closes the dropdown after clicking when `keepOpen` is false', () => {
      const wrapper = renderMultiselectWithSelectAll({ keepOpen: false });
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown();
      expect(dropdown.findOptionByValue('1')).not.toBeNull();
      wrapper.selectOption(1);
      expect(dropdown.findOptionByValue('1')).toBeNull();
    });
  });

  describe('Keyboard interactions', () => {
    test('selects all options when none are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ onChange });
      wrapper.openDropdown();
      const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
      // When opening the dropdown no option gets highlighted if none is selected. Move one position down to highlight the "Select all" control.
      optionsContainer.keydown(KeyCode.down);
      optionsContainer.keydown(KeyCode.space);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
      );
    });
    test('deselects all options when all are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ selectedOptions: optionsWithoutGroups, onChange });
      wrapper.openDropdown();
      const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
      // When opening the dropdown the first selected option is highlighted. Move one position up to highlight the "Select all" control.
      optionsContainer.keydown(KeyCode.up);
      optionsContainer.keydown(KeyCode.space);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
    });
    test('closes the dropdown after clicking when `keepOpen` is false', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ keepOpen: false, onChange });
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown();
      const optionsContainer = dropdown.findOptionsContainer()!;
      // When opening the dropdown no option gets highlighted if none is selected. Move one position down to highlight the "Select all" control.
      optionsContainer.keydown(KeyCode.down);
      optionsContainer.keydown(KeyCode.space);
      expect(dropdown.findOptionByValue('1')).toBeNull();
    });
  });

  test('is disabled when there are no options to select', () => {
    const wrapper = renderMultiselectWithSelectAll({ options: [] });
    wrapper.openDropdown();
    const options = wrapper.findDropdown().findOptions();
    expect(options.length).toBe(1);
    expect(options[0].getElement().getAttribute('aria-disabled')).toBe('true');
  });
});
