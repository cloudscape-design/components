// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { KeyCode } from '../../../lib/components/internal/keycode';
import createWrapper from '../../../lib/components/test-utils/dom';
import { i18nStrings } from './i18n-strings';
import { isValidRange } from './is-valid-range';

const defaultProps: DateRangePickerProps = {
  locale: 'en-US',
  granularity: 'day',
  i18nStrings,
  value: null,
  placeholder: 'Test Placeholder',
  onChange: () => {},
  relativeOptions: [],
  isValidRange,
};

const testIf = (isTrue: boolean) => (isTrue ? test : test.skip);

const outsideId = 'outside';
function renderDateRangePicker(props: DateRangePickerProps = defaultProps) {
  const ref = React.createRef<HTMLInputElement>();
  const { container, getByTestId, rerender } = render(
    <div>
      <button data-testid={outsideId} />
      <DateRangePicker {...props} ref={ref} />
    </div>
  );
  const wrapper = createWrapper(container).findDateRangePicker()!;

  const rerenderWrapper = (newProps: DateRangePickerProps = defaultProps) =>
    rerender(
      <div>
        <button data-testid={outsideId} />
        <DateRangePicker {...newProps} ref={ref} />
      </div>
    );

  return { wrapper, rerender: rerenderWrapper, ref, getByTestId };
}

let spy: jest.SpyInstance;
beforeEach(() => {
  spy = jest.spyOn(Date.prototype, 'getTimezoneOffset').mockImplementation(() => -8.75 * 60);
});
afterEach(() => {
  spy.mockRestore();
});

describe('Date range picker', () => {
  describe('absolute mode', () => {
    describe.each(['day', 'month'] as const)('With granularity of %s', granularity => {
      const findAt = granularity === 'day' ? 'findDateAt' : 'findMonthAt';

      test('a11y day granularity', async () => {
        const { container } = render(
          <DateRangePicker
            {...defaultProps}
            granularity={granularity}
            value={{
              type: 'absolute',
              startDate: '2018-01-02T05:00:00.000+08:45',
              endDate: '2018-01-05T13:00:00.15+08:45',
            }}
          />
        );
        const wrapper = createWrapper(container).findDateRangePicker()!;
        wrapper.findTrigger().click();

        await expect(container).toValidateA11y();
      });

      describe('form submission', () => {
        test('should not submit form when pressing buttons', () => {
          const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.persist();
          });

          const { container } = render(
            <form onSubmit={onSubmit}>
              <DateRangePicker
                {...defaultProps}
                granularity={granularity}
                value={{
                  type: 'absolute',
                  startDate: '2018-01-02T05:00:00.000+08:45',
                  endDate: '2018-01-05T13:00:00.15+08:45',
                }}
              />
            </form>
          );
          const wrapper = createWrapper(container).findDateRangePicker()!;

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findPreviousPageButton().click();
          wrapper.findDropdown()!.findNextPageButton().click();
          wrapper.findDropdown()![findAt]('left', 2, 1).click();
          wrapper.findDropdown()![findAt]('right', 2, 1).click();
          expect(onSubmit).not.toHaveBeenCalled();
        });
      });

      describe('data formats', () => {
        test(
          granularity === 'month'
            ? 'granularity of month overrides dateOnly and parses out milliseconds'
            : 'dateOnly parses out milliseconds',
          () => {
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              dateOnly: true,
              granularity,
              value: {
                type: 'absolute',
                startDate: '2018-01-02T05:00:00.000+08:45',
                endDate: '2018-01-05T13:00:00.15+08:45',
              },
            });
            const expectedText = granularity === 'month' ? '2018-01 — 2018-01' : '2018-01-02 — 2018-01-05';
            expect(wrapper.findTrigger().getElement()).toHaveTextContent(expectedText);
          }
        );

        test('accepts optional milliseconds dateOnly is false', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            dateOnly: false,
            granularity,
            value: {
              type: 'absolute',
              startDate: '2018-01-02T05:00:00.000+08:45',
              endDate: '2018-01-05T13:00:00.15+08:45',
            },
          });
          expect(wrapper.findTrigger().getElement()).toHaveTextContent(
            granularity === 'month' ? '2018-01 — 2018-01' : '2018-01-02T05:00:00+08:45 — 2018-01-05T13:00:00+08:45'
          );
        });
      });

      describe('selection', () => {
        test('formats dates with / in place of -', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2018-01-02T05:00:00+08:45', endDate: '2018-01-05T13:00:00+08:45' },
          });
          expect(wrapper.findTrigger().getElement()).toHaveTextContent(
            granularity === 'day' ? '2018-01-02T05:00:00+08:45 — 2018-01-05T13:00:00+08:45' : '2018-01 — 2018-01'
          );
        });

        test('shows the header of the selected start date by default', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2020-03-02T05:00:00+08:45', endDate: '2020-03-12T13:05:21+08:45' },
          });

          wrapper.findTrigger().click();

          const expectedResult = granularity === 'day' ? 'March 2020' : '20202021';
          expect(wrapper.findDropdown()!.findHeader().getElement()).toHaveTextContent(expectedResult);
        });

        test('pre-fills the dropdown with the selected value', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });

          wrapper.findTrigger().click();

          const expectedStartDate = granularity === 'day' ? '2021/03/02' : '2021/03';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );

          const expectedEndDate = granularity === 'day' ? '2021/03/12' : '2021/03';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedEndDate
          );

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '05:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('13:05:21');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
          const expectedStartElementText = granularity === 'day' ? '2' : 'MarMarch 2021';
          const expectedEndElementText = granularity === 'day' ? '12' : 'MarMarch 2021';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(expectedEndElementText);
        });

        test('start date can be selected', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });
          wrapper.findTrigger().click();

          wrapper.findDropdown()![findAt]('left', 3, 3).click();

          const expectedStartDate = granularity === 'day' ? '2021/03/16' : '2021/09';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );
          const expectedStartElementText = granularity === 'day' ? '2' : 'SepSeptember 2021';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
          }
        });

        test('start date can be selected with keyboard', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });
          wrapper.findTrigger().click();

          wrapper.findDropdown()![findAt]('left', 3, 3).focus();
          wrapper.findDropdown()![findAt]('left', 3, 3).keydown(KeyCode.enter);

          const expectedStartElementText = granularity === 'day' ? '2' : 'SepSeptember 2021';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );
          const expectedStartDate = granularity === 'day' ? '2021/03/16' : '2021/09';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );
          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
          }
        });

        test('end date can be selected', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });
          wrapper.findTrigger().click();

          wrapper.findDropdown()![findAt]('left', 2, 2).click();
          wrapper.findDropdown()![findAt]('right', 3, 3).click();

          const expectedEndDateElementText = granularity === 'day' ? '13April 13, 2021' : 'SepSeptember 2022';
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
            expectedEndDateElementText
          );
          const exptectedEndDate = granularity === 'day' ? '2021/04/13' : '2022/09';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            exptectedEndDate
          );
          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('23:59:59');
          } else {
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        test('end date can be selected with keyboard day', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });
          wrapper.findTrigger().click();

          wrapper.findDropdown()![findAt]('left', 2, 3).click();
          wrapper.findDropdown()![findAt]('right', 3, 3).focus();
          wrapper.findDropdown()![findAt]('right', 3, 3).keydown(KeyCode.space);

          const expectedEndDateElementText = granularity === 'day' ? '13April 13, 2021' : 'SepSeptember 2022';
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
            expectedEndDateElementText
          );
          const exptectedEndDate = granularity === 'day' ? '2021/04/13' : '2022/09';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            exptectedEndDate
          );
          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('23:59:59');
          } else {
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        test('selecting a range in reverse will flip the range correctly', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });
          wrapper.findTrigger().click();

          wrapper.findDropdown()![findAt]('right', 3, 3).click();
          wrapper.findDropdown()![findAt]('left', 3, 3).click();

          const expectedStartDate = granularity === 'day' ? '2021/03/16' : '2021/09';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );
          const expectedEndDate = granularity === 'day' ? '2021/04/13' : '2022/09';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedEndDate
          );
          const expectedStartElementText = granularity === 'day' ? '2' : 'SepSeptember 2021';
          const expectedEndElementText = granularity === 'day' ? '13April 13, 2021' : 'SepSeptember 2022';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(expectedEndElementText);

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('23:59:59');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        test('missing start date can be filled (before end date) with day', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue('');
          wrapper.findDropdown()![findAt]('left', 2, 3).click();

          const expectedStartDate = granularity === 'day' ? '2021/03/09' : '2021/03';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );
          const expectedEndDate = granularity === 'day' ? '2021/03/12' : '2021/06';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedEndDate
          );
          const expectedStartElementText = granularity === 'day' ? '2' : 'MarMarch 2021';
          const expectedEndElementText = granularity === 'day' ? '12March 12, 2021' : 'JunJune 2021';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(expectedEndElementText);

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('13:05:21');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        test('missing start date can be filled (after end date, requires a swap)', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2021-03-02T05:00:00+08:45', endDate: '2021-03-12T13:05:21+08:45' },
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue('');
          wrapper.findDropdown()![findAt]('left', 3, 3).click();

          const expectedStartDate = granularity === 'day' ? '2021/03/12' : '2021/03';
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedStartDate
          );
          const expectedEndDate = granularity === 'day' ? '2021/03/16' : '2021/09';
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedEndDate
          );
          const expectedStartElementText = granularity === 'day' ? '12' : 'MarMarch 2021';
          const expectedEndElementText = granularity === 'day' ? '16March 16, 2021' : 'SepSeptember 2021';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartElementText
          );
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(expectedEndElementText);

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('23:59:59');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        (['hh:mm:ss', 'hh:mm', 'hh'] as DateRangePickerProps['timeInputFormat'][]).forEach(timeInputFormat => {
          testIf(granularity === 'day')(
            granularity === 'day'
              ? `sets start and end time to the beginning and end of day when only selecting a date with format ${timeInputFormat}`
              : `a format ${timeInputFormat} does not change, nor is there a time offset`,
            () => {
              const onChangeSpy = jest.fn();
              const { wrapper } = renderDateRangePicker({
                ...defaultProps,
                timeInputFormat,
                onChange: event => onChangeSpy(event.detail),
              });

              wrapper.findTrigger().click();
              wrapper
                .findDropdown()!
                .findStartDateInput()!
                .setInputValue(granularity === 'day' ? '2018/05/10' : '2018/05');
              wrapper
                .findDropdown()!
                .findEndDateInput()!
                .setInputValue(granularity === 'day' ? '2018/05/12' : '2018/05');
              wrapper.findDropdown()!.findApplyButton().click();
              expect(onChangeSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                  value: {
                    type: 'absolute',
                    startDate: granularity === 'month' ? '2018-05' : '2018-05-10T00:00:00+08:45',
                    endDate: granularity === 'month' ? '2018-05' : '2018-05-12T23:59:59+08:45',
                  },
                })
              );
            }
          );
        });
      });

      const expectedStartDateValue = granularity === 'day' ? '2018/05/10' : '2018/05';
      const expectedEndDateValue = granularity === 'day' ? '2018/05/12' : '2018/05';

      describe('time formats', () => {
        test('hh:mm:ss format uses the provided string', () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeInputFormat: 'hh:mm:ss',
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);
          if (granularity === 'day') {
            wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05:00:05');
            wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23:00:05');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
          wrapper.findDropdown()!.findApplyButton().click();
          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05-10T05:00:05+08:45',
                      endDate: '2018-05-12T23:00:05+08:45',
                    },
                  }
                : {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05',
                      endDate: '2018-05',
                    },
                  }
            )
          );
        });

        testIf(granularity === 'day')('hh:mm:ss gets hidded when dateOnly', () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            dateOnly: true,
            timeInputFormat: 'hh:mm:ss',
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);

          expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
          expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();

          wrapper.findDropdown()!.findApplyButton().click();
          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              value: {
                type: 'absolute',
                startDate: '2018-05-10',
                endDate: '2018-05-12',
              },
            })
          );
        });

        test('hh:mm format gets padded with 00 for ss when provided via input', () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeInputFormat: 'hh:mm',
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);
          if (granularity === 'day') {
            wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05:00');
            wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23:00');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
          wrapper.findDropdown()!.findApplyButton().click();
          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05-10T05:00:00+08:45',
                      endDate: '2018-05-12T23:00:00+08:45',
                    },
                  }
                : {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05',
                      endDate: '2018-05',
                    },
                  }
            )
          );
        });

        test('hh format gets padded with 00:00 for mm:ss when provided via input', () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeInputFormat: 'hh',
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);

          if (granularity === 'day') {
            wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05');
            wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
          wrapper.findDropdown()!.findApplyButton().click();
          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05-10T05:00:00+08:45',
                      endDate: '2018-05-12T23:00:00+08:45',
                    },
                  }
                : {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05',
                      endDate: '2018-05',
                    },
                  }
            )
          );
        });
      });

      describe('time offset', () => {
        test('creates values in the provided time offset', () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeOffset: 6.5 * 60,
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();
          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);
          wrapper.findDropdown()!.findApplyButton().click();

          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05-10T00:00:00+06:30',
                      endDate: '2018-05-12T23:59:59+06:30',
                    },
                  }
                : { value: { endDate: '2018-05', startDate: '2018-05', type: 'absolute' } }
            )
          );
        });

        test("creates values with the browser's default offset", () => {
          const onChangeSpy = jest.fn();
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();

          wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);

          wrapper.findDropdown()!.findApplyButton().click();

          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-05-10T00:00:00+08:45',
                      endDate: '2018-05-12T23:59:59+08:45',
                    },
                  }
                : { value: { endDate: '2018-05', startDate: '2018-05', type: 'absolute' } }
            )
          );
        });

        test('transforms current value into the chosen time offset', () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeOffset: -8 * 60,
            value: {
              type: 'absolute',
              startDate: '2018-01-02T05:00:00+04:00',
              endDate: '2018-01-05T13:00:00+04:00',
            },
          });

          const expectedText =
            granularity === 'day' ? '2018-01-01T17:00:00-08:00 — 2018-01-05T01:00:00-08:00' : '2018-01 — 2018-01';
          expect(wrapper.findTrigger().getElement()).toHaveTextContent(expectedText);

          if (granularity === 'day') {
            wrapper.findTrigger().click();

            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '17:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('01:00:00');
          }
        });

        test("understands the UTC timezone indicator 'Z'", () => {
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            timeOffset: -8 * 60,
            granularity,
            value: {
              type: 'absolute',
              startDate: '2018-01-02T05:00:00Z',
              endDate: '2018-01-05T13:00:00-04:00',
            },
          });

          const expectedText =
            granularity === 'day' ? '2018-01-01T21:00:00-08:00 — 2018-01-05T09:00:00-08:00' : '2018-01 — 2018-01';
          expect(wrapper.findTrigger().getElement()).toHaveTextContent(expectedText);

          if (granularity === 'day') {
            wrapper.findTrigger().click();

            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '21:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('09:00:00');
          }
        });

        test('detects misformatted dates', () => {
          const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

          try {
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              granularity,
              value: {
                type: 'absolute',
                startDate: '2018-01-02T05:00:00+',
                endDate: '2018-01-05T13:00:00-04:00',
              },
            });
            expect(consoleSpy).toHaveBeenCalledTimes(granularity === 'day' ? 1 : 0);

            if (granularity === 'day') {
              expect(consoleSpy).toHaveBeenCalledWith(
                '[AwsUi] [DateRangePicker] You have provided a misformatted start or end date. The component will fall back to an empty value. Dates have to be ISO8601-formatted with an optional time zone offset.'
              );
            }
            expect(wrapper.findTrigger().getElement()).toHaveTextContent(
              granularity === 'day' ? 'Test Placeholder' : '2018-01 — 2018-01'
            );
          } finally {
            consoleSpy.mockRestore();
          }
        });

        test('correctly parses offsets >= 10', () => {
          {
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              timeOffset: 10 * 60,
              granularity,
              value: {
                type: 'absolute',
                startDate: '2018-01-02T00:00:00+10:00',
                endDate: '2018-01-05T10:00:00+10:00',
              },
            });

            expect(wrapper.findTrigger().getElement()).toHaveTextContent(
              granularity === 'day' ? '2018-01-02T00:00:00+10:00 — 2018-01-05T10:00:00+10:00' : '2018-01 — 2018-01'
            );
          }

          {
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              timeOffset: 20 * 60,
              granularity,
              value: {
                type: 'absolute',
                startDate: '2018-01-02T00:00:00+20:00',
                endDate: '2018-01-05T10:00:00+20:00',
              },
            });

            expect(wrapper.findTrigger().getElement()).toHaveTextContent(
              granularity === 'day' ? '2018-01-02T00:00:00+20:00 — 2018-01-05T10:00:00+20:00' : '2018-01 — 2018-01'
            );
          }
        });

        test('creates offset as a function from date', () => {
          const onChangeSpy = jest.fn();
          const getTimeOffset = jest.fn().mockImplementation((date: Date) => (date.getUTCMonth() === 5 ? 120 : 60));
          const { wrapper } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            timeOffset: 6.5 * 60, // to be ignored as getTimeOffset is preferred
            getTimeOffset,
            onChange: event => onChangeSpy(event.detail),
          });

          wrapper.findTrigger().click();

          wrapper.findDropdown()!.findStartDateInput()!.setInputValue('2018/01/01');
          wrapper.findDropdown()!.findEndDateInput()!.setInputValue('2018/06/01');

          wrapper.findDropdown()!.findApplyButton().click();

          expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining(
              granularity === 'day'
                ? {
                    value: {
                      type: 'absolute',
                      startDate: '2018-01-01T00:00:00+01:00',
                      endDate: '2018-06-01T23:59:59+02:00',
                    },
                  }
                : { value: { endDate: '2018-06', startDate: '2018-01', type: 'absolute' } }
            )
          );

          expect(getTimeOffset).toBeCalledTimes(granularity === 'day' ? 2 : 0);
        });
      });

      describe('date-only', () => {
        test('shows warning when dateOnly changes', () => {
          const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

          try {
            const { rerender } = renderDateRangePicker({ ...defaultProps, granularity, dateOnly: false });
            rerender({ ...defaultProps, granularity, dateOnly: true });
            rerender({ ...defaultProps, granularity, dateOnly: false });

            expect(consoleSpy).toHaveBeenCalledTimes(granularity === 'day' ? 2 : 0);
            if (granularity === 'day') {
              expect(consoleSpy).toHaveBeenCalledWith(
                '[AwsUi] [DateRangePicker] The provided `dateOnly` flag has been changed from "false" to "true" which can lead to unexpected value format. Consider using separate components.'
              );
              expect(consoleSpy).toHaveBeenCalledWith(
                '[AwsUi] [DateRangePicker] The provided `dateOnly` flag has been changed from "true" to "false" which can lead to unexpected value format. Consider using separate components.'
              );
            }
          } finally {
            consoleSpy.mockRestore();
          }
        });

        test(
          granularity === 'month' ? 'date-only has no effect on value' : 'formatted date-only range has no time part',
          () => {
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              granularity,
              dateOnly: true,
              value: { type: 'absolute', startDate: '2018-01-02', endDate: '2018-01-05' },
            });
            expect(wrapper.findTrigger().getElement()).toHaveTextContent(
              granularity === 'month' ? '2018-01 — 2018-01' : '2018-01-02 — 2018-01-05'
            );
          }
        );

        test(
          granularity === 'month' ? 'date-only has no effect on saving' : 'date-only range is saved without time part',
          () => {
            const onChangeSpy = jest.fn();
            const { wrapper } = renderDateRangePicker({
              ...defaultProps,
              dateOnly: true,
              granularity,
              onChange: event => onChangeSpy(event.detail),
            });

            wrapper.findTrigger().click();
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
            wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
            wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);
            wrapper.findDropdown()!.findApplyButton().click();

            expect(onChangeSpy).toHaveBeenCalledWith(
              expect.objectContaining(
                granularity === 'day'
                  ? { value: { type: 'absolute', startDate: '2018-05-10', endDate: '2018-05-12' } }
                  : { value: { type: 'absolute', startDate: '2018-05', endDate: '2018-05' } }
              )
            );
          }
        );
      });

      describe('custom control', () => {
        const customControl: DateRangePickerProps.AbsoluteRangeControl = (value, setValue) => (
          <>
            <div data-testid="display">{JSON.stringify(value)}</div>
            <button
              data-testid="set-date"
              onClick={() =>
                setValue({
                  start: { date: '2022-01-02', time: '00:00:00' },
                  end: { date: '2022-02-06', time: '12:34:56' },
                })
              }
            ></button>
            <button
              data-testid="clear-date"
              onClick={() => setValue({ start: { date: '', time: '' }, end: { date: '', time: '' } })}
            ></button>
          </>
        );
        test('renders current value from calendar', () => {
          const { wrapper, getByTestId } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2022-11-24T12:55:00', endDate: '2022-11-28T11:14:00' },
            customAbsoluteRangeControl: customControl,
          });
          wrapper.findTrigger().click();
          expect(getByTestId('display')).toHaveTextContent(
            granularity === 'day'
              ? '{"start":{"date":"2022-11-24","time":"12:55:00"},"end":{"date":"2022-11-28","time":"11:14:00"}}'
              : '{"start":{"date":"2022-11","time":""},"end":{"date":"2022-11","time":""}}'
          );
        });

        test('can update value in calendar', () => {
          const { wrapper, getByTestId } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            customAbsoluteRangeControl: customControl,
          });
          wrapper.findTrigger().click();
          getByTestId('set-date').click();
          const expectedDisplay =
            granularity === 'day'
              ? '{"start":{"date":"2022-01-02","time":"00:00:00"},"end":{"date":"2022-02-06","time":"12:34:56"}}'
              : '{"start":{"date":"2022-01-02","time":"00:00:00"},"end":{"date":"2022-02-06","time":"12:34:56"}}';
          expect(getByTestId('display')).toHaveTextContent(expectedDisplay);

          const expectedStartDateText = granularity === 'day' ? '2' : 'JanJanuary 2022';
          const expectdStartDateValue = granularity === 'day' ? '2022/01/02' : '2022/01';
          expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
            expectedStartDateText
          );
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectdStartDateValue
          );

          const expectedEndDateText = granularity === 'day' ? '6' : 'FebFebruary 2022';
          const expectedEndDateValue = granularity === 'day' ? '2022/02/06' : '2022/02';
          expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(expectedEndDateText);
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
            expectedEndDateValue
          );

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
              '00:00:00'
            );
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('12:34:56');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });

        test('can clear value in calendar with day granularity', () => {
          const { wrapper, getByTestId } = renderDateRangePicker({
            ...defaultProps,
            granularity,
            value: { type: 'absolute', startDate: '2022-11-24T12:55:00', endDate: '2022-11-28T11:14:00' },
            customAbsoluteRangeControl: customControl,
          });
          wrapper.findTrigger().click();
          getByTestId('clear-date').click();
          expect(getByTestId('display')).toHaveTextContent(
            '{"start":{"date":"","time":""},"end":{"date":"","time":""}}'
          );
          expect(wrapper.findDropdown()!.findSelectedStartDate()).toBeNull();
          expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue('');

          expect(wrapper.findDropdown()!.findSelectedEndDate()).toBeNull();
          expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue('');

          if (granularity === 'day') {
            expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue('');
            expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('');
          } else {
            expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
            expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
          }
        });
      });

      describe('i18n', () => {
        describe.each([true, false] as const)('With dateOnly of %s', dateOnly => {
          test('supports using absolute range with i18n defaults', () => {
            const { container } = render(
              <DateRangePicker
                {...defaultProps}
                rangeSelectorMode="absolute-only"
                i18nStrings={i18nStrings}
                granularity={granularity}
                dateOnly={dateOnly}
              />
            );
            const wrapper = createWrapper(container).findDateRangePicker()!;
            wrapper.openDropdown();

            //prev page
            expect(wrapper.findDropdown()!.findPreviousPageButton().getElement()).toHaveAccessibleName(
              i18nStrings[granularity === 'day' ? 'previousMonthAriaLabel' : 'previousYearAriaLabel']
            );

            //next page
            expect(wrapper.findDropdown()!.findNextPageButton().getElement()).toHaveAccessibleName(
              i18nStrings[granularity === 'day' ? 'nextMonthAriaLabel' : 'nextYearAriaLabel']
            );

            expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveAccessibleName(
              i18nStrings[granularity === 'day' ? 'startDateLabel' : 'startMonthLabel']
            );
            expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveAccessibleName(
              i18nStrings[granularity === 'day' ? 'endDateLabel' : 'endMonthLabel']
            );

            expect(
              wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
            ).toHaveAccessibleDescription(
              granularity === 'month'
                ? i18nStrings.monthConstraintText
                : dateOnly
                  ? i18nStrings.dateConstraintText
                  : i18nStrings.dateTimeConstraintText
            );

            if (dateOnly || granularity === 'month') {
              expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
              expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
            } else {
              expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveAccessibleName(
                i18nStrings.startTimeLabel
              );

              expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveAccessibleName(
                i18nStrings.endTimeLabel
              );
            }
            if (granularity === 'day') {
              expect(wrapper.findDropdown()!.findCurrentDay().getElement().textContent).toContain(
                i18nStrings.todayAriaLabel
              );
            } else {
              expect(wrapper.findDropdown()!.findPreviousMonthButton().getElement()).toHaveAccessibleName(
                i18nStrings.previousYearAriaLabel
              );
              expect(wrapper.findDropdown()!.findNextMonthButton().getElement()).toHaveAccessibleName(
                i18nStrings.nextYearAriaLabel
              );
              expect(wrapper.findDropdown()!.findCurrentMonth().getElement().textContent).toContain(
                i18nStrings.currentMonthAriaLabel
              );
            }
          });

          test('supports using absolute range customized from i18n provider', () => {
            const { container } = render(
              <TestI18nProvider
                messages={{
                  'date-range-picker': {
                    'i18nStrings.startMonthLabel': 'Custom start month',
                    'i18nStrings.startDateLabel': 'Custom start date',
                    'i18nStrings.startTimeLabel': 'Custom start time',
                    'i18nStrings.endMonthLabel': 'Custom end month',
                    'i18nStrings.endDateLabel': 'Custom end date',
                    'i18nStrings.endTimeLabel': 'Custom end time',
                    'i18nStrings.dateConstraintText': 'Custom date constraint text',
                    'i18nStrings.dateTimeConstraintText': 'Custom date & time constraint text',
                    'i18nStrings.monthConstraintText': 'Custom month constraint text',
                    'i18nStrings.todayAriaLabel': 'Custom today',
                    'i18nStrings.nextMonthAriaLabel': 'Custom next month',
                    'i18nStrings.previousMonthAriaLabel': 'Custom previous month',
                    'i18nStrings.currentMonthAriaLabel': 'Custom this month',
                    'i18nStrings.previousYearAriaLabel': 'Custom previous year',
                    'i18nStrings.nextYearAriaLabel': 'Custom next year',
                  },
                }}
              >
                <DateRangePicker
                  {...defaultProps}
                  dateOnly={dateOnly}
                  rangeSelectorMode="absolute-only"
                  i18nStrings={undefined}
                  granularity={granularity}
                />
              </TestI18nProvider>
            );
            const wrapper = createWrapper(container).findDateRangePicker()!;
            wrapper.openDropdown();

            //prev page
            expect(wrapper.findDropdown()!.findPreviousPageButton().getElement()).toHaveAccessibleName(
              granularity === 'day' ? 'Custom previous month' : 'Custom previous year'
            );

            //next page
            expect(wrapper.findDropdown()!.findNextPageButton().getElement()).toHaveAccessibleName(
              granularity === 'day' ? 'Custom next month' : 'Custom next year'
            );

            expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveAccessibleName(
              granularity === 'day' ? 'Custom start date' : 'Custom start month'
            );
            expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveAccessibleName(
              granularity === 'day' ? 'Custom end date' : 'Custom end month'
            );
            expect(
              wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
            ).toHaveAccessibleDescription(
              granularity === 'month'
                ? 'Custom month constraint text'
                : dateOnly
                  ? 'Custom date constraint text'
                  : 'Custom date & time constraint text'
            );

            if (dateOnly || granularity === 'month') {
              expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
              expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
            } else {
              expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveAccessibleName(
                'Custom start time'
              );

              expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveAccessibleName(
                'Custom end time'
              );
            }
            if (granularity === 'day') {
              expect(wrapper.findDropdown()!.findPreviousMonthButton().getElement()).toHaveAccessibleName(
                'Custom previous month'
              );
              expect(wrapper.findDropdown()!.findNextMonthButton().getElement()).toHaveAccessibleName(
                'Custom next month'
              );
              expect(wrapper.findDropdown()!.findCurrentDay().getElement().textContent).toContain('Custom today');
            } else {
              expect(wrapper.findDropdown()!.findCurrentMonth().getElement().textContent).toContain(
                'Custom this month'
              );
            }
          });
        });
      });
    });
  });
});
