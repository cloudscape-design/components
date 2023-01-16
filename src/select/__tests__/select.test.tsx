// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Select, { SelectProps } from '../../../lib/components/select';
import selectPartsStyles from '../../../lib/components/select/parts/styles.css.js';
import '../../__a11y__/to-validate-a11y';
import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';

const VALUE_WITH_SPECIAL_CHARS = 'Option 4, test"2';
const defaultOptions: SelectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  {
    label: 'Group',
    options: [
      {
        label: 'Third',
        value: '3',
      },
      {
        label: 'Forth',
        value: VALUE_WITH_SPECIAL_CHARS,
      },
    ],
  },
];

describe.each([false, true])('expandToViewport=%s', expandToViewport => {
  const defaultProps = {
    options: defaultOptions,
    selectedOption: null,
    onChange: () => {},
    expandToViewport,
  };

  function renderSelect(props?: Partial<SelectProps>) {
    const { container, rerender } = render(<Select {...defaultProps} {...props} />);
    const wrapper = createWrapper(container).findSelect()!;
    const patchedRerender = (props?: Partial<SelectProps>) => rerender(<Select {...defaultProps} {...props} />);
    return { container, wrapper, rerender: patchedRerender };
  }

  test('renders selected option', () => {
    const { wrapper } = renderSelect({ selectedOption: { label: 'First', value: '1' } });
    expect(wrapper.findTrigger().getElement().textContent).toBe('First');
  });

  test('allows deselecting an option programmatically', () => {
    const { wrapper, rerender } = renderSelect({ selectedOption: { label: 'First', value: '1' } });
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('First');
    rerender({ selectedOption: null });
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('');
  });

  test('opens and closes dropdown', () => {
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    expect(wrapper.findDropdown({ expandToViewport })!.findOptionByValue('1')).toBeTruthy();
    wrapper.closeDropdown({ expandToViewport });
    expect(wrapper.findDropdown({ expandToViewport })?.findOpenDropdown()).toBeFalsy();
  });

  test('selects top-level option', () => {
    const onChange = jest.fn();
    const { wrapper } = renderSelect({ onChange });
    wrapper.openDropdown();
    wrapper.selectOption(1, { expandToViewport });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          selectedOption: defaultOptions[0],
        },
      })
    );
  });

  test('finds option by value with special characters', () => {
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    expect(wrapper.findDropdown({ expandToViewport })!.findOptionByValue(VALUE_WITH_SPECIAL_CHARS)).toBeTruthy();
  });

  test('throws an error when attempting to select an option with closed dropdown', () => {
    const { wrapper } = renderSelect();
    expect(() => wrapper.selectOption(1, { expandToViewport })).toThrow(
      'Unable to select an option when dropdown is closed'
    );
  });

  test('throws an error when option index is not valid', () => {
    const { wrapper } = renderSelect();
    expect(() => wrapper.selectOption(0, { expandToViewport })).toThrow(
      'Option index should be a 1-based integer number'
    );
  });

  test('throws an error when trying to select a non-existing option index', () => {
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    expect(() => wrapper.selectOption(5, { expandToViewport })).toThrow(
      "Can't select the option, because there is no option with the index 5"
    );
  });

  test('throws an error when trying to select a non-existing value', () => {
    const { wrapper } = renderSelect();
    wrapper.openDropdown();
    expect(() => wrapper.selectOptionByValue('totally-fictional', { expandToViewport })).toThrow(
      'Can\'t select the option, because there is no option with the value "totally-fictional"'
    );
  });

  test('selects an option in a group', () => {
    const onChange = jest.fn();
    const { wrapper } = renderSelect({ onChange });
    wrapper.openDropdown();
    wrapper.selectOptionByValue('3', { expandToViewport });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          selectedOption: (defaultOptions[2] as SelectProps.OptionGroup).options[0],
        },
      })
    );
  });

  test('allows setting a disabled option through API and display it', () => {
    const { wrapper } = renderSelect({
      selectedOption: { label: 'Fifth', value: '5', disabled: true },
      options: [...defaultOptions, { label: 'Fifth', value: '5', disabled: true }],
    });
    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Fifth');
  });

  describe('Filtering feature', () => {
    test('fires onLoadItems event after a delay', async () => {
      const onLoadItems = jest.fn();
      const { wrapper } = renderSelect({
        filteringType: 'manual',
        options: defaultOptions,
        onLoadItems: event => onLoadItems(event.detail),
      });
      wrapper.openDropdown();
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: true, samePage: false });
      onLoadItems.mockClear();
      wrapper.findFilteringInput({ expandToViewport })!.setInputValue('test');
      expect(wrapper.findFilteringInput({ expandToViewport })!.findNativeInput().getElement()).toHaveValue('test');
      await waitFor(() =>
        expect(onLoadItems).toHaveBeenCalledWith({ filteringText: 'test', firstPage: true, samePage: false })
      );
    });

    test('fires onLoadItems to load next page after scroll', () => {
      const onLoadItems = jest.fn();
      const { wrapper } = renderSelect({
        filteringType: 'manual',
        options: defaultOptions,
        statusType: 'pending',
        onLoadItems: event => onLoadItems(event.detail),
      });
      wrapper.openDropdown();
      onLoadItems.mockClear();
      wrapper.findDropdown({ expandToViewport }).findOptionsContainer()!.fireEvent(new CustomEvent('scroll'));
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: false });
    });

    test('fires onLoadItems to retry failed request', () => {
      const onLoadItems = jest.fn();
      const { wrapper } = renderSelect({
        filteringType: 'manual',
        options: defaultOptions,
        recoveryText: 'Retry',
        statusType: 'error',
        onLoadItems: event => onLoadItems(event.detail),
      });
      wrapper.openDropdown();
      onLoadItems.mockClear();
      wrapper.findErrorRecoveryButton({ expandToViewport })!.click();
      expect(onLoadItems).toHaveBeenCalledWith({ filteringText: '', firstPage: false, samePage: true });
    });

    test('applies automatic client-side filtering when it is enabled', () => {
      const { wrapper } = renderSelect({ filteringType: 'auto', options: defaultOptions });
      wrapper.openDropdown();
      expect(wrapper.findDropdown({ expandToViewport }).findOptions()).toHaveLength(4);
      wrapper.findFilteringInput({ expandToViewport })!.setInputValue('Second');
      expect(wrapper.findDropdown({ expandToViewport }).findOptions()).toHaveLength(1);
    });
  });

  describe('Placeholder Support', () => {
    test('renders placeholder when no option is selected', () => {
      const { wrapper } = renderSelect({ placeholder: 'placeholder text content' });
      expect(wrapper.findPlaceholder()).not.toBeNull();
      expect(wrapper.findPlaceholder()!.getElement()).toHaveTextContent('placeholder text content');
    });

    test('can update a placeholder', () => {
      const { wrapper, rerender } = renderSelect({ placeholder: 'placeholder text content' });
      expect(wrapper.findPlaceholder()!.getElement()).toHaveTextContent('placeholder text content');
      rerender({ selectedOption: null, placeholder: 'updated placeholder text content' });
      expect(wrapper.findPlaceholder()!.getElement()).toHaveTextContent('updated placeholder text content');
    });

    test('removes placeholder after selecting an option', () => {
      const { wrapper, rerender } = renderSelect({ placeholder: 'placeholder text content' });
      expect(wrapper.findPlaceholder()).not.toBeNull();
      rerender({
        selectedOption: { label: 'First', value: '1' },
        placeholder: 'placeholder text content',
      });
      expect(wrapper.findPlaceholder()).toBeNull();
    });

    test('shows placeholder again after setting selectedOption to null', () => {
      const { wrapper, rerender } = renderSelect({
        selectedOption: { label: 'First', value: '1' },
        placeholder: 'placeholder text content',
      });
      expect(wrapper.findPlaceholder()).toBeNull();
      rerender({ selectedOption: null, placeholder: 'placeholder text content' });
      expect(wrapper.findPlaceholder()).not.toBeNull();
    });
  });

  describe('Dropdown states', () => {
    [
      ['loading', true],
      ['error', true],
      ['finished', false],
    ].forEach(([statusType, isSticky]) => {
      test(`should display ${statusType} status text as ${isSticky ? 'sticky' : 'non-sticky'} footer`, () => {
        const statusText = { [`${statusType}Text`]: `Test ${statusType} text` };
        const { wrapper } = renderSelect({ statusType: statusType as any, ...statusText });
        wrapper.openDropdown();
        const statusIndicator = wrapper.findStatusIndicator({ expandToViewport })!;
        expect(statusIndicator.getElement()).toHaveTextContent(`Test ${statusType} text`);
        const dropdown = wrapper.findDropdown({ expandToViewport })!.findOpenDropdown()!;
        expect(Boolean(dropdown.findByClassName(selectPartsStyles['list-bottom']))).toBe(!isSticky);
      });

      test(`check a11y for ${statusType} and ${isSticky ? 'sticky' : 'non-sticky'} footer`, async () => {
        const statusText = { [`${statusType}Text`]: `Test ${statusType} text` };
        const { container, wrapper } = renderSelect({
          statusType: statusType as any,
          ...statusText,
          ariaLabel: 'input',
        });
        wrapper.openDropdown();

        await expect(container).toValidateA11y();
      });
    });
    test('should display error status icon with provided aria label', () => {
      const { wrapper } = renderSelect({
        statusType: 'error',
        errorText: 'Test error text',
        errorIconAriaLabel: 'Test error text',
      });

      wrapper.openDropdown();

      const statusIcon = wrapper
        .findStatusIndicator({ expandToViewport })!
        .findByClassName(statusIconStyles.icon)!
        .getElement();
      expect(statusIcon).toHaveAttribute('aria-label', 'Test error text');
      expect(statusIcon).toHaveAttribute('role', 'img');
    });
  });

  describe('Disabled state', () => {
    test('enabled by default', () => {
      const { wrapper } = renderSelect();
      expect(wrapper.isDisabled()).toEqual(false);
      wrapper.openDropdown();
      expect(wrapper.findDropdown({ expandToViewport })!.findOpenDropdown()).toBeTruthy();
    });

    test('can be disabled', () => {
      const { wrapper } = renderSelect({ disabled: true });
      expect(wrapper.isDisabled()).toEqual(true);
      wrapper.openDropdown();
      expect(wrapper.findDropdown({ expandToViewport })?.findOpenDropdown()).toBeFalsy();
    });
  });

  test('should render with focus when autoFocus=true', () => {
    const { wrapper } = renderSelect({ autoFocus: true });
    expect(wrapper.findTrigger().getElement()).toHaveFocus();
  });
});
