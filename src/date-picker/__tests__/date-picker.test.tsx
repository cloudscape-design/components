// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import DatePicker, { DatePickerProps } from '../../../lib/components/date-picker';
import DatePickerWrapper from '../../../lib/components/test-utils/dom/date-picker';
import FormField from '../../../lib/components/form-field';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';

const defaultProps: DatePickerProps = {
  todayAriaLabel: 'Today',
  nextMonthAriaLabel: 'Next Month',
  previousMonthAriaLabel: 'Previous Month',
  value: '',
  onChange: () => {},
  openCalendarAriaLabel: selectedDate => 'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : ''),
};

const outsideId = 'outside';
function renderDatePicker(props: DatePickerProps = defaultProps) {
  const ref = React.createRef<HTMLInputElement>();
  const { container, getByTestId } = render(
    <div>
      <button data-testid={outsideId} />
      <DatePicker {...props} ref={ref} />
    </div>
  );
  const wrapper = createWrapper(container).findDatePicker()!;

  return { wrapper, ref, getByTestId };
}

describe('Date picker - direct date input', () => {
  test('delegates properties to the internal native input', () => {
    const { wrapper } = renderDatePicker({
      ...defaultProps,
      placeholder: 'YYYY/MM/DD',
      disabled: true,
      controlId: 'derpId',
      ariaLabel: 'My date picker label',
      readOnly: true,
      name: 'derpName',
    });

    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).toHaveAttribute('disabled');
    expect(nativeInput).toHaveAttribute('readonly');
    expect(nativeInput).toHaveAttribute('id', 'derpId');
    expect(nativeInput).toHaveAttribute('name', 'derpName');
    expect(nativeInput).toHaveAttribute('placeholder', 'YYYY/MM/DD');
    expect(nativeInput).toHaveAttribute('aria-label', 'My date picker label');
  });

  test('disables autocomplete by default', () => {
    const { wrapper } = renderDatePicker();
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('autocomplete', 'off');
  });

  test('does not allow changing autocomplete values', () => {
    const { wrapper } = renderDatePicker({ ...defaultProps, autocomplete: true } as DatePickerProps);
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('autocomplete', 'off');
  });

  test('has auto-correction features turned off', () => {
    const { wrapper } = renderDatePicker();
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput).toHaveAttribute('autocorrect', 'off');
    expect(nativeInput).toHaveAttribute('autocapitalize', 'off');
  });

  test('formats dates with / in place of -', () => {
    const { wrapper } = renderDatePicker({ ...defaultProps, value: '2018-01-02' });
    expect(wrapper.findNativeInput().getElement().value).toBe('2018/01/02');
  });

  describe('aria-describedby', () => {
    test('is not added if not passed ', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaDescribedby: undefined });
      expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-describedby');
    });

    test('can be set to custom value', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaDescribedby: 'my-custom-id' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });

    test('can be customized without controlId', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, controlId: undefined, ariaDescribedby: 'my-custom-id' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });

    test('is inherited from a FormField', () => {
      const { container } = render(
        <FormField label="FormField-provided label" constraintText="FormField-provided constraint text">
          <DatePicker {...defaultProps} />
        </FormField>
      );
      const wrapper = createWrapper(container);

      const formFieldConstraintTextId = wrapper.findFormField()!.findConstraint()!.getElement().id;
      expect(wrapper.findDatePicker()!.findNativeInput().getElement()).toHaveAttribute(
        'aria-describedby',
        formFieldConstraintTextId
      );

      wrapper.findDatePicker()!.findOpenCalendarButton().click();
      expect(wrapper.findDatePicker()!.findCalendar()!.getElement()).not.toHaveAttribute(
        'aria-describedby',
        expect.stringContaining(formFieldConstraintTextId)
      );
    });
  });

  describe('aria-labelledby', () => {
    test('aria-labelledby is not added if not defined', () => {
      const { wrapper } = renderDatePicker();
      expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-labelledby');
    });

    test('aria-labelledby can be set to custom value', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaLabelledby: 'my-custom-id' });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-labelledby', 'my-custom-id');
    });

    test('aria-labelledby is passed to the calendar', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaLabelledby: 'my-custom-id' });
      wrapper.findOpenCalendarButton().click();
      expect(wrapper.findCalendar()!.getElement()).toHaveAttribute('aria-labelledby', 'my-custom-id');
    });

    test('is inherited from a FormField', () => {
      const { container } = render(
        <FormField label="FormField-provided label" constraintText="FormField-provided constraint text">
          <DatePicker {...defaultProps} />
        </FormField>
      );
      const wrapper = createWrapper(container);

      const formFieldLabelId = wrapper.findFormField()!.findLabel()!.getElement().id;
      expect(wrapper.findDatePicker()!.findNativeInput().getElement()).toHaveAttribute(
        'aria-labelledby',
        formFieldLabelId
      );

      wrapper.findDatePicker()!.findOpenCalendarButton().click();
      expect(wrapper.findDatePicker()!.findCalendar()!.getElement()).toHaveAttribute(
        'aria-labelledby',
        formFieldLabelId
      );
    });
  });

  describe('aria-required', () => {
    test('is added to native input if ariaRequired is passed', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaRequired: true });
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-required', 'true');
    });

    test('is not added to native input if ariaRequired is not passed', () => {
      const { wrapper } = renderDatePicker();
      expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-required');
    });

    test('is not added to native input if ariaRequired is falsy', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaRequired: false });
      expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-required');
    });
  });

  describe('aria-label', () => {
    test('aria-label is not added if not defined', () => {
      const { wrapper } = renderDatePicker();
      expect(wrapper.findNativeInput().getElement()).not.toHaveAttribute('aria-label');
    });

    test('aria-label is passed to the calendar', () => {
      const { wrapper } = renderDatePicker({ ...defaultProps, ariaLabel: 'my-custom-label' });
      wrapper.findOpenCalendarButton().click();
      expect(wrapper.findCalendar()!.getElement()).toHaveAttribute('aria-label', 'my-custom-label');
    });
  });

  describe('blur event', () => {
    let onBlurSpy: jest.Mock<NonCancelableEventHandler<DatePickerProps.ChangeDetail>>,
      wrapper: DatePickerWrapper,
      getByTestId: (selector: string) => HTMLElement;

    beforeEach(() => {
      onBlurSpy = jest.fn();
      ({ wrapper, getByTestId } = renderDatePicker({
        ...defaultProps,
        value: '2018-03-01',
        onBlur: onBlurSpy,
      }));
      wrapper.focus();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should fire blur handler when focusing another element', () => {
      getByTestId(outsideId).focus();
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('should fire blur handler on open calendar when focusing another element', () => {
      wrapper.findOpenCalendarButton().click();
      expect(wrapper.findCalendarDropdown()).not.toBeNull();

      getByTestId(outsideId).focus();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('focus and blur event', () => {
    test('fires focus event', () => {
      const onFocusSpy = jest.fn();
      const { wrapper } = renderDatePicker({ ...defaultProps, onFocus: onFocusSpy });
      wrapper.focus();
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    test('Ref can be used to focus the component', () => {
      const { wrapper, ref } = renderDatePicker({ ...defaultProps });
      const inputElement = wrapper.findNativeInput().getElement();
      expect(document.activeElement).not.toBe(inputElement);
      ref.current?.focus();
      expect(document.activeElement).toBe(inputElement);
    });

    test('Ref can be used to focus the component and calls the onFocus callback', () => {
      const onFocusSpy = jest.fn();
      const { ref } = renderDatePicker({ ...defaultProps, onFocus: onFocusSpy });
      ref.current?.focus();
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    describe('programmatic focus', () => {
      test('allows focus() on the element', () => {
        const { wrapper } = renderDatePicker({ ...defaultProps });
        jest.spyOn(wrapper.findNativeInput().getElement(), 'focus');
        wrapper.focus();
        expect(wrapper.findNativeInput().getElement().focus).toHaveBeenCalled();
      });

      test('also fires focus event on the component', () => {
        const onFocusSpy = jest.fn();
        const { wrapper } = renderDatePicker({ ...defaultProps, onFocus: onFocusSpy });
        wrapper.focus();
        expect(onFocusSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('change event', () => {
    let onChangeSpy: jest.Mock<NonCancelableEventHandler<DatePickerProps.ChangeDetail>>, wrapper: DatePickerWrapper;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      ({ wrapper } = renderDatePicker({
        ...defaultProps,
        onChange: onChangeSpy,
      }));
    });

    test('should fire on value change with value detail when setting the input via the helper method', () => {
      wrapper.setInputValue('2018/01/01');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '2018-01-01',
          },
        })
      );
    });

    test('should fire when typing in the input field', () => {
      wrapper.findNativeInput().keydown({ key: '1', keyCode: 49 });
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '1',
          },
        })
      );
    });

    test('should not fire when a letter or invalid character is typed in the input field', () => {
      wrapper.findNativeInput().keydown({ key: 'a', keyCode: 65 });
      wrapper.findNativeInput().keydown({ key: ' ', keyCode: 32 });
      wrapper.findNativeInput().keydown({ key: ';', keyCode: 186 });

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    test('should be called only once when a separator is appended', () => {
      const onChangeSpy = jest.fn();
      const { wrapper } = renderDatePicker({
        ...defaultProps,
        value: '201',
        onChange: onChangeSpy,
      });
      wrapper.findNativeInput().keydown({ key: '8', keyCode: 56 });
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: '2018-',
          },
        })
      );
    });
  });

  describe('checkControlled', () => {
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn');
    });

    afterEach(() => {
      consoleSpy.mockReset();
    });

    test('should log a warning when no onChange is undefined', () => {
      renderDatePicker({ ...defaultProps, onChange: undefined });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AwsUi] [DatePicker] You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
      );
    });

    test('should not log a warning when onChange is provided', () => {
      renderDatePicker({ ...defaultProps, onChange: () => {} });
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});

describe('generates aria-label for the "Open calendar" button', () => {
  test('Without a selected date', () => {
    const { wrapper } = renderDatePicker({
      ...defaultProps,
      locale: 'en-US',
    });
    const button = wrapper.findOpenCalendarButton().getElement();
    expect(button).toHaveAttribute('aria-label', 'Choose Date');
  });
  test('With a selected date', () => {
    const { wrapper } = renderDatePicker({
      ...defaultProps,
      value: '2018-01-02',
      locale: 'en-US',
    });
    const button = wrapper.findOpenCalendarButton().getElement();
    expect(button).toHaveAttribute('aria-label', 'Choose Date, selected date is Tuesday, January 2, 2018');
  });
  test('With an incomplete date', () => {
    const { wrapper } = renderDatePicker({
      ...defaultProps,
      value: '2018-01-0',
      locale: 'en-US',
    });
    const button = wrapper.findOpenCalendarButton().getElement();
    expect(button).toHaveAttribute('aria-label', 'Choose Date');
  });
});
