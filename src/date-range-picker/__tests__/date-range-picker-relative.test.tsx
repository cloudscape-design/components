// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';
import Mockdate from 'mockdate';
import createWrapper, { DateRangePickerWrapper } from '../../../lib/components/test-utils/dom';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import { i18nStrings } from './i18n-strings';
import { changeMode } from './change-mode';
import { isValidRange } from './is-valid-range';
import '../../__a11y__/to-validate-a11y';

const defaultProps: DateRangePickerProps = {
  locale: 'en-US',
  i18nStrings,
  value: null,
  onChange: () => {},
  relativeOptions: [
    { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
    { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
    { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
    { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
  ],
  isValidRange,
};

const outsideId = 'outside';
function renderDateRangePicker(props: DateRangePickerProps = defaultProps) {
  const ref = React.createRef<HTMLInputElement>();
  const { container, getByTestId } = render(
    <div>
      <button type="button" data-testid={outsideId}>
        click me
      </button>
      <DateRangePicker {...props} ref={ref} />
    </div>
  );
  const wrapper = createWrapper(container).findDateRangePicker()!;

  return { container, wrapper, ref, getByTestId };
}

function getCustomRelativeRangeUnits(wrapper: DateRangePickerWrapper) {
  return wrapper
    .findDropdown()!
    .findCustomRelativeRangeUnit()!
    .findDropdown()
    .findOptions()
    .map(option => option.getElement().textContent!.trim());
}

describe('Date range picker', () => {
  describe('relative mode', () => {
    beforeEach(() => Mockdate.set(new Date('2020-10-01T12:30:20')));
    afterEach(() => Mockdate.reset());

    test('a11y', async () => {
      const { container, wrapper } = renderDateRangePicker({
        ...defaultProps,
      });
      act(() => wrapper.findLabel().click());

      await expect(container).toValidateA11y();
    });

    test('selecting a pre-defined option', () => {
      const onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>> = jest.fn();
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        onChange: event => onChangeSpy(event.detail),
      });

      act(() => wrapper.findLabel().click());

      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('previous-5-minutes')!.click());
      act(() => wrapper.findDropdown()!.findApplyButton().click());
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          value: {
            type: 'relative',
            amount: 5,
            unit: 'minute',
            key: 'previous-5-minutes',
          },
        })
      );
    });

    test('selecting a custom option', () => {
      const onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>> = jest.fn();
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        onChange: event => onChangeSpy(event.detail),
      });

      act(() => wrapper.findLabel().click());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[4].findLabel().click());

      act(() => wrapper.findDropdown()!.findCustomRelativeRangeDuration()!.setInputValue('14'));
      act(() => wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown());
      act(() => wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.selectOption(5));

      act(() => wrapper.findDropdown()!.findApplyButton().click());

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          value: {
            type: 'relative',
            amount: 14,
            unit: 'week',
          },
        })
      );
    });

    test('remembers the selected option when switching modes', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
      });

      act(() => wrapper.findLabel().click());
      act(() => wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[2].findLabel().click());

      changeMode(wrapper, 'absolute');
      expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBeNull();

      changeMode(wrapper, 'relative');
      expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).not.toBeNull();

      expect(
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[2].findNativeInput().getElement()
      ).toBeChecked();
    });

    test('uses absolute mode by default when no relative options given', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        relativeOptions: [],
      });

      act(() => wrapper.findLabel().click());

      const modeSelector = wrapper.findDropdown()!.findSelectionModeSwitch().findModesAsSegments();
      expect(modeSelector.findSelectedSegment()!.getElement().textContent).toBe('Absolute range');
    });

    test('shows no radios when no relative options given', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        relativeOptions: [],
      });

      act(() => wrapper.findLabel().click());
      changeMode(wrapper, 'relative');

      expect(!!wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBe(false);
    });

    test('shows custom range description when no relative options given', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        relativeOptions: [],
      });

      act(() => wrapper.findLabel().click());
      changeMode(wrapper, 'relative');

      expect(wrapper.findDropdown()!.getElement().textContent).toContain('Set a custom range in the past');
    });

    test('shows all custom units by default', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        rangeSelectorMode: 'relative-only',
        relativeOptions: [],
      });
      act(() => wrapper.findLabel().click());

      wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
      expect(getCustomRelativeRangeUnits(wrapper)).toEqual([
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years',
      ]);
    });

    test('shows only days and above units in dateOnly mode', () => {
      const { wrapper } = renderDateRangePicker({
        ...defaultProps,
        rangeSelectorMode: 'relative-only',
        relativeOptions: [],
        dateOnly: true,
      });
      act(() => wrapper.findLabel().click());

      wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
      expect(getCustomRelativeRangeUnits(wrapper)).toEqual(['days', 'weeks', 'months', 'years']);
    });
  });
});
