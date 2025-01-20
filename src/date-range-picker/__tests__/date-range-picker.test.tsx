// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Mockdate from 'mockdate';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import FormField from '../../../lib/components/form-field';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import { LiveRegionController } from '../../../lib/components/live-region/controller.js';
import createWrapper from '../../../lib/components/test-utils/dom';
import DateRangePickerWrapper from '../../../lib/components/test-utils/dom/date-range-picker';
import { changeMode } from './change-mode';
import { i18nStrings } from './i18n-strings';
import { isValidRange } from './is-valid-range';

import segmentedStyles from '../../../lib/components/segmented-control/styles.css.js';

LiveRegionController.defaultDelay = 0;

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

let spy: jest.SpyInstance;
beforeEach(() => {
  jest.clearAllMocks();
  spy = jest.spyOn(Date.prototype, 'getTimezoneOffset').mockImplementation(() => 0);
});
afterEach(() => {
  spy.mockRestore();
});

const dayRelativeOptions = [
  { amount: 5, unit: 'hour', type: 'relative', key: 'five-hours' },
  { amount: 10, unit: 'hour', type: 'relative', key: 'ten-hours' },
] as DateRangePickerProps['relativeOptions'];

const monthRelativeOptions = [
  { amount: 5, unit: 'month', type: 'relative', key: 'five-months' },
  { amount: 10, unit: 'month', type: 'relative', key: 'ten-months' },
] as DateRangePickerProps['relativeOptions'];

const defaultProps: DateRangePickerProps = {
  locale: 'en-US',
  i18nStrings,
  value: null,
  relativeOptions: [],
  onChange: () => {},
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
  describe.each(['day', 'month'] as const)('With granularity of %s', granularity => {
    const updatedProps: DateRangePickerProps = {
      ...defaultProps,
      granularity,
      relativeOptions: granularity === 'day' ? dayRelativeOptions : monthRelativeOptions,
    };
    const optionTen = granularity === 'day' ? 'ten-hours' : 'ten-months';
    const optionFive = granularity === 'day' ? 'five-hours' : 'five-months';
    const findAt = granularity === 'day' ? 'findDateAt' : 'findMonthAt';

    describe('accessibility attributes', () => {
      test('aria-describedby', () => {
        const { wrapper } = renderDateRangePicker({ ...updatedProps, ariaDescribedby: '#element' });
        expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-describedby', '#element');

        wrapper.openDropdown();
        expect(wrapper.findDropdown()!.getElement()).toHaveAttribute('aria-describedby', '#element');
      });

      test('aria-labelledby', () => {
        const { wrapper } = renderDateRangePicker({ ...updatedProps, ariaLabelledby: '#element' });
        expect(wrapper.findTrigger().getElement()).toHaveAttribute(
          'aria-labelledby',
          expect.stringContaining('#element')
        );

        wrapper.openDropdown();
        expect(wrapper.findDropdown()!.getElement()).toHaveAttribute('aria-labelledby', '#element');
      });

      test('aria-invalid', () => {
        const { wrapper } = renderDateRangePicker({ ...updatedProps, invalid: true });
        expect(wrapper.findTrigger().getElement()).toHaveAttribute('aria-invalid', 'true');
      });

      test('controlId', () => {
        const { wrapper } = renderDateRangePicker({ ...updatedProps, controlId: 'test' });
        expect(wrapper.findTrigger().getElement()).toHaveAttribute('id', 'test');
      });

      test('correctly labels the dropdown trigger with the selected value', () => {
        const value = { type: 'relative', amount: 5, unit: 'day' } as const;
        const { container } = render(
          <FormField label="Label">
            <DateRangePicker {...updatedProps} value={value} />
          </FormField>
        );
        const wrapper = createWrapper(container).findDateRangePicker()!;
        expect(wrapper.findTrigger().getElement()).toHaveAccessibleName(
          'Label ' + i18nStrings.formatRelativeRange!(value)
        );
      });

      test('does not pass through form field context to dropdown elements', () => {
        const { container } = render(
          <FormField label="Label">
            <DateRangePicker {...updatedProps} />
          </FormField>
        );
        const wrapper = createWrapper(container).findDateRangePicker()!;
        wrapper.openDropdown();
        const dropdown = wrapper.findDropdown()!;

        expect(dropdown.findRelativeRangeRadioGroup()!.getElement()).toHaveAccessibleName(
          i18nStrings.relativeRangeSelectionHeading
        );

        dropdown.findRelativeRangeRadioGroup()!.findButtons().at(-1)!.findNativeInput().click();
        expect(dropdown.findCustomRelativeRangeDuration()!.findNativeInput().getElement()).toHaveAccessibleName(
          i18nStrings.customRelativeRangeDurationLabel
        );
        expect(dropdown.findCustomRelativeRangeUnit()!.findTrigger().getElement()).toHaveAccessibleName(
          [i18nStrings.customRelativeRangeUnitLabel, granularity === 'day' ? 'minutes' : 'months'].join(' ')
        );

        changeMode(wrapper, 'absolute');

        expect(dropdown.findStartDateInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
          granularity === 'day' ? i18nStrings.startDateLabel : i18nStrings.startMonthLabel
        );
        expect(dropdown.findEndDateInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
          granularity === 'day' ? i18nStrings.endDateLabel : i18nStrings.endMonthLabel
        );
        if (granularity === 'day') {
          expect(dropdown.findStartTimeInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
            i18nStrings.startTimeLabel
          );
          expect(dropdown.findEndTimeInput()!.findNativeInput()!.getElement()).toHaveAccessibleName(
            i18nStrings.endTimeLabel
          );
        } else {
          expect(dropdown.findStartTimeInput()).toBeNull();
          expect(dropdown.findEndTimeInput()).toBeNull();
        }
      });

      test('toolbar accessible name', () => {
        const { wrapper } = renderDateRangePicker();
        wrapper.openDropdown();
        const modeSelector = wrapper.findDropdown()!.findSelectionModeSwitch()!.findModesAsSegments();
        expect(modeSelector.findByClassName(segmentedStyles['segment-part'])!.getElement()).toHaveAccessibleName(
          i18nStrings.modeSelectionLabel
        );
      });
    });

    test('opens relative range mode by default', () => {
      const { wrapper } = renderDateRangePicker({ ...updatedProps } as DateRangePickerProps);
      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).not.toBeNull();
    });

    test('opens absolute range mode by default if no relative ranges are provided', () => {
      const { wrapper } = renderDateRangePicker({ ...updatedProps, relativeOptions: [] });
      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBeNull();
    });

    test('shows the clear button by default', () => {
      const { wrapper } = renderDateRangePicker({ ...updatedProps } as DateRangePickerProps);
      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.findClearButton()).not.toBeNull();
    });

    test('hides the clear button if specified', () => {
      const { wrapper } = renderDateRangePicker({ ...updatedProps, showClearButton: false });
      wrapper.openDropdown();
      expect(wrapper.findDropdown()!.findClearButton()).toBeNull();
    });

    describe('checkControlled', () => {
      test('should log a warning when no onChange is undefined', () => {
        renderDateRangePicker({ ...updatedProps, onChange: undefined });
        expect(warnOnce).toHaveBeenCalledTimes(1);
        expect(warnOnce).toHaveBeenCalledWith(
          'DateRangePicker',
          'You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
        );
      });

      test('should not log a warning when onChange is provided', () => {
        renderDateRangePicker({ ...updatedProps, onChange: () => {} });
        expect(warnOnce).not.toHaveBeenCalled();
      });
    });

    describe('validation', () => {
      let onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>>;
      let wrapper: DateRangePickerWrapper;

      beforeEach(() => {
        onChangeSpy = jest.fn();
        ({ wrapper } = renderDateRangePicker({
          ...updatedProps,
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
        renderDateRangePicker({ ...updatedProps, value });

        expect(warnOnce).toHaveBeenCalledTimes(1);
        expect(warnOnce).toHaveBeenCalledWith(
          'DateRangePicker',
          'You provided an invalid value. Reverting back to default.'
        );
      });

      test('produces the value even if validation does not catch an incomplete range', () => {
        wrapper.openDropdown();

        changeMode(wrapper, 'absolute');
        wrapper.findDropdown()![findAt]('right', 3, 3).click();

        wrapper.findDropdown()!.findApplyButton().click();

        const dayObjectProperties = { endDate: 'T23:59:59+00:00', type: 'absolute' };
        const monthObjectProperties = { endDate: '', startDate: '2025-09', type: 'absolute' };

        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            value: expect.objectContaining(granularity === 'day' ? dayObjectProperties : monthObjectProperties),
          })
        );
      });

      test('should not fire onChange if the date is invalid', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionTen)!.click();
        wrapper.findDropdown()!.findApplyButton().click();

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
      });

      test('does not display the error message until after the first submit', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionTen)!.click();
        expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

        wrapper.findDropdown()!.findApplyButton().click();
        expect(wrapper.findDropdown()!.findValidationError()?.getElement()).toHaveTextContent('10 is not allowed.');
        expect(createWrapper().findAll('[aria-live]')[1]!.getElement()).toHaveTextContent('10 is not allowed.');
      });

      test('after rendering the error once, displays subsequent errors in real time', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionTen)!.click();
        wrapper.findDropdown()!.findApplyButton().click();

        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionFive)!.click();
        expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionTen)!.click();
        expect(wrapper.findDropdown()!.findValidationError()?.getElement()).toHaveTextContent('10 is not allowed.');
      });

      test('resets validation state when switching between modes', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue(optionTen)!.click();
        expect(wrapper.findDropdown()!.findValidationError()).toBeNull();

        wrapper.findDropdown()!.findApplyButton().click();
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
          ...updatedProps,
          onChange: event => onChangeSpy(event.detail),
        }));
      });

      test('should fire when clearing the selection', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findClearButton()!.click();

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            value: null,
          })
        );
      });

      test('should not fire when canceling the selection', () => {
        wrapper.openDropdown();
        wrapper.findDropdown()!.findCancelButton().click();

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe('range selector mode', () => {
      (['absolute-only', 'relative-only'] as const).forEach(rangeSelectorMode =>
        test(`shows no mode switcher when mode = ${rangeSelectorMode} and value = null`, () => {
          const { wrapper } = renderDateRangePicker({ ...updatedProps, rangeSelectorMode });
          wrapper.openDropdown();

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
          const { wrapper } = renderDateRangePicker({ ...updatedProps, rangeSelectorMode, value });
          wrapper.openDropdown();

          expect(wrapper.findTrigger().getElement()).toHaveTextContent('');
        })
      );

      test('focuses dropdown when opened', () => {
        const { wrapper } = renderDateRangePicker();
        wrapper.openDropdown();

        expectToHaveFocus(wrapper.findDropdown()!.getElement());
      });

      describe('value compatibility for compatible cases', () => {
        afterEach(() => {
          jest.clearAllMocks();
        });

        const compatibleCases: [string, DateRangePickerProps.RangeSelectorMode, null | DateRangePickerProps.Value][] = [
          ['default mode with null value', 'default', null],
          ['default mode with absolute value', 'default', absoluteValue],
          ['default mode with relative value', 'default', relativeValue],
          ['absolute-only mode with null value', 'absolute-only', null],
          ['absolute-only mode with absolute value', 'absolute-only', absoluteValue],
          ['relative-only mode with null value', 'relative-only', null],
          ['relative-only mode with relative value', 'relative-only', relativeValue],
        ];

        test.each(compatibleCases)('does not show warning for %s', (_, rangeSelectorMode, value) => {
          renderDateRangePicker({ ...defaultProps, rangeSelectorMode, value });
          expect(warnOnce).not.toHaveBeenCalled();
        });
      });

      describe('value compatibility for incompatible cases', () => {
        afterEach(() => {
          jest.clearAllMocks();
        });

        const incompatibleCases: [string, DateRangePickerProps.RangeSelectorMode, DateRangePickerProps.Value][] = [
          ['absolute-only mode with relative value', 'absolute-only', relativeValue],
          ['relative-only mode with absolute value', 'relative-only', absoluteValue],
        ];

        test.each(incompatibleCases)('shows warning for %s', (_, rangeSelectorMode, value) => {
          renderDateRangePicker({ ...defaultProps, rangeSelectorMode, value });
          expect(warnOnce).toHaveBeenCalledWith(
            'DateRangePicker',
            'The provided value does not correspond to the current range selector mode. Reverting back to default.'
          );
        });

        describe('isValidRange', () => {
          beforeEach(() => Mockdate.set(new Date('2020-10-01T12:30:20')));
          afterEach(() => Mockdate.reset());

          test('calls isValidRange without time part when dateOnly is enabled', () => {
            const expectedStartDate = granularity === 'month' ? `2019-09` : `2020-09-15`;

            const isValidRange = jest.fn().mockReturnValue({ valid: false, errorMessage: 'Error' });
            const { wrapper } = renderDateRangePicker({ ...updatedProps, dateOnly: true, isValidRange });
            wrapper.openDropdown();
            changeMode(wrapper, 'absolute');
            // When endDate hasn't been selected
            wrapper.findDropdown()![findAt]('left', 3, 3).click();
            wrapper.findDropdown()!.findApplyButton().click();
            expect(isValidRange).toHaveBeenLastCalledWith(
              expect.objectContaining({ type: 'absolute', startDate: expectedStartDate, endDate: '' })
            );
            // When full range has been selected
            wrapper.findDropdown()![findAt]('right', 3, 3).click();
            wrapper.findDropdown()!.findApplyButton().click();

            expect(isValidRange).toHaveBeenLastCalledWith(
              expect.objectContaining({
                type: 'absolute',
                startDate: expectedStartDate,
                endDate: granularity === 'day' ? '2020-10-13' : '2020-09',
              })
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
                <DateRangePicker {...updatedProps} i18nStrings={undefined} />
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
    });
  });
});
