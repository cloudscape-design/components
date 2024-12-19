// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Mockdate from 'mockdate';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { NonCancelableEventHandler } from '../../../lib/components/internal/events';
import createWrapper, { DateRangePickerWrapper } from '../../../lib/components/test-utils/dom';
import { changeMode } from './change-mode';
import { i18nStrings } from './i18n-strings';
import { isValidRange } from './is-valid-range';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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
    (['day', 'month'] as DateRangePickerProps['granularity'][]).forEach(granularity => {
      beforeEach(() => Mockdate.set(new Date('2020-10-01T12:30:20')));
      afterEach(() => Mockdate.reset());

      const testMessagePrefix = granularity === 'month' ? 'Month granularity has no effect when ' : '';

      test(`${testMessagePrefix}a11y`, async () => {
        const { container, wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
        });
        wrapper.findTrigger().click();

        await expect(container).toValidateA11y();
      });

      test(`${testMessagePrefix}selecting a pre-defined option`, () => {
        const onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>> = jest.fn();
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          onChange: event => onChangeSpy(event.detail),
        });

        wrapper.findTrigger().click();

        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findInputByValue('previous-5-minutes')!.click();
        wrapper.findDropdown()!.findApplyButton().click();
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

      //todo  determine custom options   add one for dateOnly too
      test(`${testMessagePrefix}selecting a custom option`, () => {
        const onChangeSpy: jest.Mock<NonCancelableEventHandler<DateRangePickerProps.ChangeDetail>> = jest.fn();
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          relativeOptions:
            granularity === 'day'
              ? defaultProps.relativeOptions
              : [
                  ...defaultProps.relativeOptions,
                  { key: 'previous-3-months', amount: 3, unit: 'month', type: 'relative' },
                  // { key: 'previous-2-years', amount: 2, unit: 'years', type: 'relative' },
                ],
          onChange: event => onChangeSpy(event.detail),
        });

        wrapper.findTrigger().click();
        wrapper
          .findDropdown()!
          .findRelativeRangeRadioGroup()!
          .findButtons()
          [granularity === 'day' ? 4 : 5].findLabel()
          .click();

        wrapper
          .findDropdown()!
          .findCustomRelativeRangeDuration()!
          .setInputValue(granularity === 'day' ? '14' : '12');
        wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
        //options are filtered or disabled with only
        wrapper
          .findDropdown()!
          .findCustomRelativeRangeUnit()!
          .selectOption(granularity === 'day' ? 5 : 1);

        wrapper.findDropdown()!.findApplyButton().click();

        expect(onChangeSpy).toHaveBeenCalledTimes(1);

        const changeValue =
          granularity === 'day'
            ? {
                value: {
                  type: 'relative',
                  amount: 14,
                  unit: 'week',
                },
              }
            : {
                value: {
                  type: 'relative',
                  amount: 12,
                  unit: 'month',
                },
              };
        expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining(changeValue));
      });

      test(`${testMessagePrefix}custom unit and duration has correct aria-attributes`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          onChange: () => undefined,
        });

        wrapper.findTrigger().click();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[4].findLabel().click();

        const durationAriaLabelId = wrapper
          .findDropdown()!
          .findCustomRelativeRangeDuration()!
          .findNativeInput()
          .getElement()
          .getAttribute('aria-labelledby')!
          .split(' ')[0];
        expect(wrapper.find(`#${durationAriaLabelId}`)!.getElement()).toHaveTextContent(
          i18nStrings.customRelativeRangeDurationLabel!
        );

        const unitAriaLabelId = wrapper
          .findDropdown()!
          .findCustomRelativeRangeUnit()!
          .findTrigger()
          .getElement()
          .getAttribute('aria-labelledby')!
          .split(' ')[0];
        expect(wrapper.find(`#${unitAriaLabelId}`)!.getElement()).toHaveTextContent(
          i18nStrings.customRelativeRangeUnitLabel!
        );
      });

      test(`${testMessagePrefix}remembers the selected option when switching modes`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
        });

        wrapper.findTrigger().click();
        wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[2].findLabel().click();

        changeMode(wrapper, 'absolute');
        expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBeNull();

        changeMode(wrapper, 'relative');
        expect(wrapper.findDropdown()!.findRelativeRangeRadioGroup()).not.toBeNull();

        expect(
          wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[2].findNativeInput().getElement()
        ).toBeChecked();
      });

      test(`${testMessagePrefix}uses absolute mode by default when no relative options given`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          relativeOptions: [],
        });

        wrapper.findTrigger().click();

        const modeSelector = wrapper.findDropdown()!.findSelectionModeSwitch().findModesAsSegments();
        expect(modeSelector.findSelectedSegment()!.getElement().textContent).toBe('Absolute range');
      });

      test(`${testMessagePrefix}shows no radios when no relative options given`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          relativeOptions: [],
        });

        wrapper.findTrigger().click();
        changeMode(wrapper, 'relative');

        expect(!!wrapper.findDropdown()!.findRelativeRangeRadioGroup()).toBe(false);
      });

      test(`${testMessagePrefix}shows custom range description when no relative options given`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          relativeOptions: [],
        });

        wrapper.findTrigger().click();
        changeMode(wrapper, 'relative');

        expect(wrapper.findDropdown()!.getElement().textContent).toContain('Set a custom range in the past');
      });

      test(`${testMessagePrefix}shows all custom units by default`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          rangeSelectorMode: 'relative-only',
          relativeOptions: [],
        });
        wrapper.findTrigger().click();

        wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();

        const unitsResult = [
          ...(granularity === 'day' ? ['seconds', 'minutes', 'hours', 'days', 'weeks'] : []),
          'months',
          'years',
        ].sort();
        expect(getCustomRelativeRangeUnits(wrapper).sort()).toEqual(unitsResult);
      });

      test(`${testMessagePrefix}shows only days and above units in dateOnly mode`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          rangeSelectorMode: 'relative-only',
          relativeOptions: [],
          dateOnly: true,
        });
        wrapper.findTrigger().click();

        wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
        const unitsResult = [...(granularity === 'day' ? ['days', 'weeks'] : []), 'months', 'years'].sort();
        expect(getCustomRelativeRangeUnits(wrapper).sort()).toEqual(unitsResult);
      });

      test(`${testMessagePrefix}shows custom units list if specified`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          rangeSelectorMode: 'relative-only',
          relativeOptions: [],
          customRelativeRangeUnits: ['hour', 'minute'],
        });
        wrapper.findTrigger().click();

        wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
        expect(getCustomRelativeRangeUnits(wrapper)).toEqual(['hours', 'minutes']);
      });

      test(`${testMessagePrefix}ensures default unit is a valid one specified from list`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          rangeSelectorMode: 'relative-only',
          relativeOptions: [],
          customRelativeRangeUnits: ['hour', 'day'],
        });
        wrapper.findTrigger().click();
        expect(wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.getElement()).toHaveTextContent('hours');
      });

      test(`${testMessagePrefix}warns about (and ignores) invalid custom units`, () => {
        const { wrapper } = renderDateRangePicker({
          ...defaultProps,
          granularity,
          rangeSelectorMode: 'relative-only',
          relativeOptions: [],
          customRelativeRangeUnits: ['hour', 'minute', 'foo' as any],
        });
        wrapper.findTrigger().click();
        expect(warnOnce).toHaveBeenCalledWith(
          'DateRangePicker',
          'Invalid unit found in customRelativeRangeUnits: foo. This entry will be ignored.'
        );

        wrapper.findDropdown()!.findCustomRelativeRangeUnit()!.openDropdown();
        expect(getCustomRelativeRangeUnits(wrapper)).toEqual(['hours', 'minutes']);
      });

      describe('i18n', () => {
        test(`${testMessagePrefix}supports using relative range props from i18n provider`, () => {
          const { container } = render(
            <TestI18nProvider
              messages={{
                'date-range-picker': {
                  'i18nStrings.relativeRangeSelectionHeading': 'Custom choose range',
                  'i18nStrings.formatRelativeRange': 'Custom last {amount} {unit}',
                  'i18nStrings.customRelativeRangeOptionLabel': 'Custom custom range',
                  'i18nStrings.customRelativeRangeOptionDescription': 'Custom custom range description',
                },
              }}
            >
              <DateRangePicker {...defaultProps} rangeSelectorMode="relative-only" i18nStrings={undefined} />
            </TestI18nProvider>
          );

          const wrapper = createWrapper(container).findDateRangePicker()!;

          wrapper.openDropdown();
          expect(
            createWrapper(wrapper.findDropdown()!.getElement()).findFormField()!.findLabel()!.getElement()
          ).toHaveTextContent('Custom choose range');
          expect(
            wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[0].findLabel()!.getElement()
          ).toHaveTextContent('Custom last 5 minute');
          expect(
            wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[4]!.findLabel()!.getElement()
          ).toHaveTextContent('Custom custom range');
          expect(
            wrapper.findDropdown()!.findRelativeRangeRadioGroup()!.findButtons()[4]!.findDescription()!.getElement()
          ).toHaveTextContent('Custom custom range description');
        });
      });
    });
  });
});
