// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { MultiselectProps } from '../interfaces';
import { optionsWithoutGroups, renderMultiselect } from './common';

const renderMultiselectWithSelectAll = (props?: Partial<MultiselectProps>) => {
  const { wrapper } = renderMultiselect({ ...(props || {}), enableSelectAll: true });
  return wrapper;
};
describe('Multiselect with "select all" control', () => {
  describe.each([false, true])('virtualScroll=%s', virtualScroll => {
    describe('Mouse interactions', () => {
      test('selects all options when none are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({ onChange, virtualScroll });
        wrapper.openDropdown();

        wrapper.selectAll();
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
        );
      });

      test('selects all options when some but not all are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({
          onChange,
          selectedOptions: [optionsWithoutGroups[0]],
          virtualScroll,
        });
        wrapper.openDropdown();
        wrapper.selectAll();
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
        );
      });

      test('deselects all options when all are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({
          selectedOptions: optionsWithoutGroups,
          onChange,
          virtualScroll,
        });
        wrapper.openDropdown();
        wrapper.selectAll();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
      });

      test('closes the dropdown after clicking when `keepOpen` is false', () => {
        const wrapper = renderMultiselectWithSelectAll({ keepOpen: false, virtualScroll });
        wrapper.openDropdown();
        const dropdown = wrapper.findDropdown();
        expect(dropdown.findOptionByValue('1')).not.toBeNull();
        wrapper.selectAll();
        expect(dropdown.findOptionByValue('1')).toBeNull();
      });
    });

    describe('Keyboard interactions', () => {
      test('selects all options when none are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({ onChange, virtualScroll });
        wrapper.openDropdown();
        const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
        // When opening the dropdown no option gets highlighted if none is selected. Move one position down to highlight the "Select all" control.
        optionsContainer.keydown(KeyCode.down);
        optionsContainer.keydown(KeyCode.space);
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
        );
      });

      test('selects all options when some but not all are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({
          onChange,
          selectedOptions: [optionsWithoutGroups[0]],
          virtualScroll,
        });
        wrapper.openDropdown();
        const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
        // When opening the dropdown the first selected option is highlighted. Move one position up to highlight the "Select all" control.
        optionsContainer.keydown(KeyCode.up);
        optionsContainer.keydown(KeyCode.space);
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
        );
      });

      test('deselects all options when all are selected', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({
          selectedOptions: optionsWithoutGroups,
          onChange,
          virtualScroll,
        });
        wrapper.openDropdown();
        const optionsContainer = wrapper.findDropdown().findOptionsContainer()!;
        // When opening the dropdown the first selected option is highlighted. Move one position up to highlight the "Select all" control.
        optionsContainer.keydown(KeyCode.up);
        optionsContainer.keydown(KeyCode.space);
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
      });

      test('closes the dropdown after clicking when `keepOpen` is false', () => {
        const onChange = jest.fn();
        const wrapper = renderMultiselectWithSelectAll({ keepOpen: false, onChange, virtualScroll });
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
      const wrapper = renderMultiselectWithSelectAll({ options: [], virtualScroll });
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown();
      const options = dropdown.findOptions();
      expect(options.length).toBe(0);
      expect(dropdown.findSelectAll()!.getElement().getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('i18n', () => {
    test('uses i18nStrings.selectAllText from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ multiselect: { 'i18nStrings.selectAllText': 'Custom Select all text' } }}>
          <Multiselect enableSelectAll={true} options={[]} selectedOptions={[]} />
        </TestI18nProvider>
      );

      const wrapper = createWrapper(container).findMultiselect()!;
      wrapper.openDropdown();
      const selectAll = wrapper.findDropdown().findSelectAll()!;
      expect(selectAll.getElement().textContent).toBe('Custom Select all text');
    });

    test('uses i18nStrings.selectAllText from i18nStrings prop', () => {
      const wrapper = renderMultiselectWithSelectAll({ i18nStrings: { selectAllText: 'Custom Select all text' } });
      wrapper.openDropdown();
      const selectAll = wrapper.findDropdown().findSelectAll()!;
      expect(selectAll.getElement().textContent).toBe('Custom Select all text');
    });

    test('uses i18nStrings.selectAllText from i18nStrings prop when both i18n provider and i18nStrings prop are provided ', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{ multiselect: { 'i18nStrings.selectAllText': 'Custom Select all text from i18n provider' } }}
        >
          <Multiselect
            enableSelectAll={true}
            options={[]}
            selectedOptions={[]}
            i18nStrings={{ selectAllText: 'Custom Select all text from i18nStrings' }}
          />
        </TestI18nProvider>
      );

      const wrapper = createWrapper(container).findMultiselect()!;
      wrapper.openDropdown();
      const selectAll = wrapper.findDropdown().findSelectAll()!;
      expect(selectAll.getElement().textContent).toBe('Custom Select all text from i18nStrings');
    });
  });
});
