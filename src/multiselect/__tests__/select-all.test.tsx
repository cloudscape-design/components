// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';
import { MultiselectProps } from '../interfaces';
import { optionsWithGroups } from './common';

const optionsWithoutGroups = optionsWithGroups.reduce(
  (previousValue: MultiselectProps.Option[], currentValue: MultiselectProps.Option) => {
    if ('options' in currentValue) {
      return [...previousValue, ...(currentValue as MultiselectProps.OptionGroup).options];
    }
    return [...previousValue, currentValue];
  },
  []
);

const renderMultiselect = (props?: Partial<MultiselectProps>) => {
  const { container } = render(
    <Multiselect options={optionsWithGroups} selectedOptions={[]} onChange={() => null} {...props} />
  );
  return createWrapper(container).findMultiselect()!;
};

const renderMultiselectWithSelectAll = (props?: Partial<MultiselectProps>) =>
  renderMultiselect({ ...props, enableSelectAll: true });

describe('Multiselect with "select all" control', () => {
  describe('Selection logic', () => {
    test('selects all options when none are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({ onChange });
      wrapper.openDropdown();

      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
      );
    });

    test('selects all options when some but not all are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({
        onChange,
        selectedOptions: [optionsWithoutGroups[0]],
      });
      wrapper.openDropdown();
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: optionsWithoutGroups } })
      );
    });

    test('deselects all options when all are selected', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({
        selectedOptions: optionsWithoutGroups,
        onChange,
      });
      wrapper.openDropdown();
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [] } }));
    });

    test('does not select disabled options', () => {
      const onChange = jest.fn();
      const options = [{ value: '1', disabled: true }, { value: '2' }];
      const wrapper = renderMultiselectWithSelectAll({
        options,
        selectedOptions: [],
        onChange,
      });
      wrapper.openDropdown();
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: [options[1]] } }));
    });

    test('does not deselect disabled options', () => {
      const onChange = jest.fn();
      const options = [{ value: '1', disabled: true }, { value: '2' }];
      const wrapper = renderMultiselectWithSelectAll({
        options,
        selectedOptions: [options[0]],
        onChange,
      });
      wrapper.openDropdown();
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedOptions: options } }));
    });
  });

  test('closes the dropdown after clicking when `keepOpen` is false', () => {
    const wrapper = renderMultiselectWithSelectAll({ keepOpen: false });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown();
    expect(dropdown.findOptionByValue('1')).not.toBeNull();
    wrapper.clickSelectAll();
    expect(dropdown.findOptionByValue('1')).toBeNull();
  });

  test.each([false, true])(
    'is hidden when there are no options to select [virtuaScroll=%s]',
    (virtualScroll: boolean) => {
      const wrapper = renderMultiselectWithSelectAll({ options: [], virtualScroll });
      wrapper.openDropdown();
      const dropdown = wrapper.findDropdown();
      const options = dropdown.findOptions();
      expect(options.length).toBe(0);
      expect(dropdown.findSelectAll()).toBe(null);
    }
  );

  describe('with filtering', () => {
    test('does not select non-visible options', () => {
      const onChange = jest.fn();
      const wrapper = renderMultiselectWithSelectAll({
        filteringType: 'auto',
        onChange,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('First option');
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: [optionsWithGroups[0]] } })
      );
    });

    test('does not deselect non-visible options', () => {
      const onChange = jest.fn();
      const selectedOptions = [optionsWithGroups[0]];
      const wrapper = renderMultiselectWithSelectAll({
        filteringType: 'auto',
        onChange,
        selectedOptions,
      });
      wrapper.openDropdown();
      wrapper.findFilteringInput()!.setInputValue('Fourth option');
      wrapper.clickSelectAll();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { selectedOptions: [...selectedOptions, optionsWithGroups[2]] } })
      );
    });
  });

  describe('Keyboard interactions', () => {
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

    describe.each([false, true])('virtuaScroll=%s', virtualScroll => {
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
    });
  });

  describe('i18n', () => {
    test('uses i18nStrings.selectAllText from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ multiselect: { 'i18nStrings.selectAllText': 'Custom Select all text' } }}>
          <Multiselect enableSelectAll={true} options={optionsWithGroups} selectedOptions={[]} />
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
            options={optionsWithGroups}
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

  describe('Test utils', () => {
    test('`selectAll` throws an error if the dropdown is not open', () => {
      const wrapper = renderMultiselectWithSelectAll();
      expect(() => {
        wrapper.clickSelectAll();
      }).toThrow();
    });

    test('`selectAll` throws an error if the "select all" element is not present', () => {
      const wrapper = renderMultiselect();
      wrapper.openDropdown();
      expect(() => {
        wrapper.clickSelectAll();
      }).toThrow();
    });

    test('does not alter option test indices', () => {
      const wrapper = renderMultiselectWithSelectAll();
      wrapper.openDropdown();
      expect(wrapper.findDropdown().findOption(1)!.findLabel().getElement().textContent).toBe('First option');
    });
  });
});
