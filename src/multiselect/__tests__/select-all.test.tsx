// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import { optionsWithoutGroups, renderMultiselect } from './common';

describe('Multiselect with "Select all" control', () => {
  describe('Mouse interactions', () => {
    test('selects all options when none are selected', () => {
      const onChange = jest.fn();
      const { wrapper } = renderMultiselect({ enableSelectAll: true, onChange });
      wrapper.openDropdown();
      wrapper.selectOption(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
      );
    });
    test('deselects all options when all are selected', () => {
      const onChange = jest.fn();
      const { wrapper } = renderMultiselect({ enableSelectAll: true, selectedOptions: optionsWithoutGroups, onChange });
      wrapper.openDropdown();
      wrapper.selectOption(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
    });
    test('closes the dropdown after clicking when `keepOpen` is false', () => {
      const { wrapper } = renderMultiselect({ enableSelectAll: true, keepOpen: false });
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
      const { wrapper } = renderMultiselect({ enableSelectAll: true, onChange });
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
      const { wrapper } = renderMultiselect({ enableSelectAll: true, selectedOptions: optionsWithoutGroups, onChange });
      wrapper.openDropdown();
      const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
      // When opening the dropdown the first selected option is highlighted. Move one position up to highlight the "Select all" control.
      optionsContainer.keydown(KeyCode.up);
      optionsContainer.keydown(KeyCode.space);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
    });
    test('closes the dropdown after clicking when `keepOpen` is false', () => {
      const onChange = jest.fn();
      const { wrapper } = renderMultiselect({ enableSelectAll: true, keepOpen: false, onChange });
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown();
      const optionsContainer = dropdown.findOptionsContainer()!;
      // When opening the dropdown no option gets highlighted if none is selected. Move one position down to highlight the "Select all" control.
      optionsContainer.keydown(KeyCode.down);
      optionsContainer.keydown(KeyCode.space);
      expect(dropdown.findOptionByValue('1')).toBeNull();
    });
  });
});
