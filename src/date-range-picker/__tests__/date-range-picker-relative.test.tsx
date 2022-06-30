// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';
import Mockdate from 'mockdate';
import createWrapper from '../../../lib/components/test-utils/dom';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import { i18nStrings } from './i18n-strings';
import { changeMode } from './change-mode';
import { isValidRange } from './is-valid-range';
import { expectNoAxeViolations } from '../../__a11y__/axe';

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
      <button data-testid={outsideId}>click me</button>
      <DateRangePicker {...props} ref={ref} />
    </div>
  );
  const wrapper = createWrapper(container).findDateRangePicker()!;

  return { container, wrapper, ref, getByTestId };
}

describe('Date range picker', () => {
  describe('relative mode', () => {
    beforeEach(() => Mockdate.set(new Date('2020-10-01T12:30:20')));
    afterEach(() => Mockdate.reset());

    // TODO: resolve https://dequeuniversity.com/rules/axe/4.4/aria-required-children?application=axeAPI
    test.skip('a11y checks with opened dropdown', async () => {
      const { container, wrapper } = renderDateRangePicker({
        ...defaultProps,
      });
      act(() => wrapper.findLabel().click());

      await expectNoAxeViolations(container);
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
  });
});
