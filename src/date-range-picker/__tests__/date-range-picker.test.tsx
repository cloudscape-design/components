// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';
import Mockdate from 'mockdate';
import createWrapper from '../../../lib/components/test-utils/dom';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import FormField from '../../../lib/components/form-field';
import DateRangePickerWrapper from '../../../lib/components/test-utils/dom/date-range-picker';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import { i18nStrings } from './i18n-strings';
import { isValidRange } from './is-valid-range';
import { changeMode } from './change-mode';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from '../../../lib/components/date-range-picker/styles.css.js';
import TestI18nProvider from '../../../lib/components/i18n/testing';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

let spy: jest.SpyInstance;
beforeEach(() => {
  spy = jest.spyOn(Date.prototype, 'getTimezoneOffset').mockImplementation(() => 0);
});
afterEach(() => {
  spy.mockRestore();
});

const defaultProps: DateRangePickerProps = {
  locale: 'en-US',
  i18nStrings,
  value: null,
  onChange: () => {},
  relativeOptions: [
    { amount: 5, unit: 'hour', type: 'relative', key: 'five-hours' },
    { amount: 10, unit: 'hour', type: 'relative', key: 'ten-hours' },
  ],
  isValidRange,
};

const absoluteValue: DateRangePickerProps.Value = { type: 'absolute', startDate: '2018-01-02', endDate: '2018-01-05' };
const relativeValue: DateRangePickerProps.Value = { type: 'relative', amount: 5, unit: 'minute' };

function renderDateRangePicker(props: DateRangePickerProps = defaultProps) {
  const { container } = render(<DateRangePicker {...props} />);
  const wrapper = createWrapper(container).findDateRangePicker()!;
  return { wrapper };
}

function expectToHaveFocus(element: HTMLElement) {
  expect(element === document.activeElement || element.contains(document.activeElement)).toBe(true);
}

describe('Date range picker', () => {
  describe('accessibility attributes', () => {
    test('aria-describedby', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, ariaDescribedby: '#element' });
      expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-describedby', '#element');

      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.getElement()).toHaveAttribute('aria-describedby', '#element');
    });

    test('aria-labelledby', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, ariaLabelledby: '#element' });
      expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-labelledby', '#element');

      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.getElement()).toHaveAttribute('aria-labelledby', '#element');
    });

    test('aria-invalid', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, invalid: true });
      expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-invalid', 'true');
    });

    test('controlId', () => {
      const { wrapper } = renderDateRangePicker({ ...defaultProps, controlId: 'test' });
      expect(wrapper.findTrigger().getElement()).toHaveAttribute('id', 'test');
    });

    test('does not pass through form field context to dropdown elements', () => {
      const { container } = render(
        <FormField label="Label">
          <DateRangePicker {...defaultProps} />
        </FormField>
      );
      const wrapper = createWrapper(container).findDateRangePicker()!;
      act(() => wrapper.openDropdown());
      const dropdown = wrapper.findDropdown()!;

      expect(dropdown.findRelativeRangeRadioGroup()!.getElement()).toHaveAccessibleName(
        i18nStrings.relativeRangeSelectionHeading
      );

      dropdown.findRelativeRangeRadioGroup()?.findButtons().at(-1)!.findNativeInput().click();
      expect(dropdown.findCustomRelativeRangeDuration()!.findNativeInput().getElement()).toHaveAccessibleName(
        i18nStrings.customRelativeRangeDurationLabel
      );
      expect(dropdown.findCustomRelativeRangeUnit()!.findTrigger().getElement()).toHaveAccessibleName(
        [i18nStrings.customRelativeRangeUnitLabel, 'minutes'].join(' ')
      );

      changeMode(wrapper, 'absolute');

      expect(dropdown.findStartDateInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
        i18nStrings.startDateLabel
      );
      expect(dropdown.findStartTimeInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
        i18nStrings.startTimeLabel
      );
      expect(dropdown.findEndDateInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
        i18nStrings.endDateLabel
      );
      expect(dropdown.findEndTimeInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
        i18nStrings.endTimeLabel
      );
    });
  });

  test('opens relative range mode by default', () => {
    const { wrapper } = renderDateRangePicker();
    act(() => wrapper.openDropdown());
    expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).not.toBeNull();
  });

  test('opens absolute range mode by default if no relative ranges are provided', () => {
    const { wrapper } = renderDateRangePicker({ ...defaultProps, relativeOptions: [] });
    act(() => wrapper.openDropdown());
    expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBeNull();
  });

  test('shows the clear button by default', () => {
    const { wrapper } = renderDateRangePicker();
    act(() => wrapper.openDropdown());
    expect(wrapper.findDropdown()!.findClearButton()).not.toBeNull();
  });

  test('hides the clear button if specified', () => {
    const { wrapper } = renderDateRangePicker({ ...defaultProps, showClearButton: false });
    act(() => wrapper.openDropdown());
    expect(wrapper.findDropdown()!.findClearButton()).toBeNull();
  });

  describe('checkControlled', () => {
    test('should log a warning when no onChange is undefined', () => {
      renderDateRangePicker({ ...defaultProps, onChange: undefined });
      expect(warnOnce).toHaveBeenCalledTimes(1);
      expect(warnOnce).toHaveBeenCalledWith(
        'DateRangePicker',
        'You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
      );
    });

    test('should not log a warning when onChange is provided', () => {
      renderDateRangePicker({ ...defaultProps, onChange: () => {} });
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    let onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>>;
    let wrapper: DateRangePickerWrapper;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      ({ wrapper } = renderDateRangePicker({
        ...defaultProps,
        onChange: event => onChangeSpy(event.detail),
        isValidRange: value => {
          if (value === null) {
            return {
              valid: false,
              errorMessage: 'No range selected',
            };
          }
          const invalid = value.type === 'relative' && value.amount === 10;
          return invalid ? { valid: false, errorMessage: '10 is not allowed.' } : { valid: true };
        },
      }));
    });

    test('falls back to value = null when invalid value type is provided', () => {
      const value: any = { type: 'invalid' };
      renderDateRangePicker({ ...defaultProps, value });

      expect(warnOnce).toHaveBeenCalledTimes(1);
      expect(warnOnce).toHaveBeenCalledWith(
        'DateRangePicker',
        'You provided an invalid value. Reverting back to default.'
      );
    });

    test('produces the value even if validation does not catch an incomplete range', () => {
      act(() => wrapper.openDropdown());

      changeMode(wrapper, 'absolute');
      act(() => wrapper.findDropdown()!.findDateAt('right', 3, 4).click());

      act(() => wrapper.findDropdown()!.findApplyButton().click());

      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining({ endDate: 'T23:59:59+00:00', type: 'absolute' }),
        })
      );
    });

    test('should not fire onChange if the date is invalid', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('ten-hours')!.click());
      act(() => wrapper.findDropdown()!.findApplyButton().click());

      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });

    test('does not display the error message until after the first submit', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('ten-hours')!.click());
      expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

      act(() => wrapper.findDropdown()!.findApplyButton().click());
      expect(wrapper.findDropdown()!.findValidationError()?.getElement()).toHaveTextContent('10 is not allowed.');
      expect(wrapper.findDropdown()!.findByClassName(styles['validation-section'])!.find('[aria-live]')).not.toBe(null);
    });

    test('after rendering the error once, displays subsequent errors in real time', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('ten-hours')!.click());
      act(() => wrapper.findDropdown()!.findApplyButton().click());

      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('five-hours')!.click());
      expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('ten-hours')!.click());
      expect(wrapper.findDropdown()!.findValidationError()?.getElement()).toHaveTextContent('10 is not allowed.');
    });

    test('resets validation state when switching between modes', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('ten-hours')!.click());
      expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

      act(() => wrapper.findDropdown()!.findApplyButton().click());
      expect(wrapper.findDropdown()!.findValidationError()?.getElement()).toHaveTextContent('10 is not allowed.');

      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

      changeMode(wrapper, 'relative');
      expect(wrapper.findDropdown()!.findValidationError()).toBeNull();
    });
  });

  describe('change event', () => {
    let onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>>;
    let wrapper: DateRangePickerWrapper;

    beforeEach(() => Mockdate.set(new Date('2020-10-01T12:30:20')));
    afterEach(() => Mockdate.reset());

    beforeEach(() => {
      onChangeSpy = jest.fn();
      ({ wrapper } = renderDateRangePicker({
        ...defaultProps,
        onChange: event => onChangeSpy(event.detail),
      }));
    });

    test('should fire when clearing the selection', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findClearButton()!.click());

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          value: null,
        })
      );
    });

    test('should not fire when canceling the selection', () => {
      act(() => wrapper.openDropdown());
      act(() => wrapper.findDropdown()!.findCancelButton().click());

      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('range selector mode', () => {
    (['absolute-only', 'relative-only'] as const).forEach(rangeSelectorMode =>
      test(`shows no mode switcher when mode = ${rangeSelectorMode} and value = null`, () => {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, rangeSelectorMode });
        act(() => wrapper.openDropdown());

        expect(wrapper.findDropdown()!.findSelectionModeSwitch()).toBeNull();
      })
    );

    (
      [
        ['absolute-only', relativeValue],
        ['relative-only', absoluteValue],
      ] as const
    ).forEach(([rangeSelectorMode, value]) =>
      test(`uses null as value when mode = ${rangeSelectorMode} and value.type = ${value.type}`, () => {
        const { wrapper } = renderDateRangePicker({ ...defaultProps, rangeSelectorMode, value });
        act(() => wrapper.openDropdown());

        expect(wrapper.findTrigger().getElement()).toHaveTextContent('');
      })
    );

    test('focuses dropdown when opened', () => {
      const { wrapper } = renderDateRangePicker();
      act(() => wrapper.openDropdown());

      expectToHaveFocus(wrapper.findDropdown()!.getElement());
    });

    test('shows warning when range selector mode and value type are not compatible', () => {
      const compatible: [DateRangePickerProps.RangeSelectorMode, null | DateRangePickerProps.Value][] = [
        ['default', null],
        ['default', absoluteValue],
        ['default', relativeValue],
        ['absolute-only', null],
        ['absolute-only', absoluteValue],
        ['relative-only', null],
        ['relative-only', relativeValue],
      ];
      for (const [rangeSelectorMode, value] of compatible) {
        renderDateRangePicker({ ...defaultProps, rangeSelectorMode, value });
      }
      expect(warnOnce).not.toHaveBeenCalled();

      const incompatible: [DateRangePickerProps.RangeSelectorMode, null | DateRangePickerProps.Value][] = [
        ['absolute-only', relativeValue],
        ['relative-only', absoluteValue],
      ];
      for (const [rangeSelectorMode, value] of incompatible) {
        renderDateRangePicker({ ...defaultProps, rangeSelectorMode, value });
      }
      expect(warnOnce).toHaveBeenCalledTimes(2);
      expect(warnOnce).toHaveBeenCalledWith(
        'DateRangePicker',
        'The provided value does not correspond to the current range selector mode. Reverting back to default.'
      );
    });
  });

  describe('i18n', () => {
    test('supports using mode selector and modal footer props from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'date-range-picker': {
              'i18nStrings.relativeModeTitle': 'Custom relative',
              'i18nStrings.absoluteModeTitle': 'Custom absolute',
              'i18nStrings.clearButtonLabel': 'Custom clear',
              'i18nStrings.cancelButtonLabel': 'Custom cancel',
              'i18nStrings.applyButtonLabel': 'Custom apply',
            },
          }}
        >
          <DateRangePicker {...defaultProps} i18nStrings={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findDateRangePicker()!;
      wrapper.openDropdown();
      const modeSwitch = wrapper.findDropdown()!.findSelectionModeSwitch()!.findModesAsSelect()!;
      modeSwitch.openDropdown();
      expect(modeSwitch.findDropdown().findOption(1)!.getElement()).toHaveTextContent('Custom relative');
      expect(modeSwitch.findDropdown().findOption(2)!.getElement()).toHaveTextContent('Custom absolute');
      expect(wrapper.findDropdown()!.findClearButton()!.getElement()).toHaveTextContent('Custom clear');
      expect(wrapper.findDropdown()!.findCancelButton()!.getElement()).toHaveTextContent('Custom cancel');
      expect(wrapper.findDropdown()!.findApplyButton()!.getElement()).toHaveTextContent('Custom apply');
    });
  });
});
