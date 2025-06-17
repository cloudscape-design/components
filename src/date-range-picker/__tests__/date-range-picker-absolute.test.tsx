// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import DateRangePicker, { DateRangePickerProps } from '../../../lib/components/date-range-picker';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { KeyCode } from '../../../lib/components/internal/keycode';
import createWrapper from '../../../lib/components/test-utils/dom';
import { testIf } from '../../__tests__/utils';
import { i18nStrings } from './i18n-strings';
import { isValidRange } from './is-valid-range';

const initDefaultProps: DateRangePickerProps = {
  locale: 'en-US',
  granularity: 'day',
  i18nStrings,
  value: null,
  placeholder: 'Test Placeholder',
  onChange: () => {},
  relativeOptions: [],
  isValidRange,
};

const outsideId = 'outside';

function renderDateRangePicker(props: DateRangePickerProps = initDefaultProps) {
  const ref = React.createRef<HTMLInputElement>();
  const { container, getByTestId, rerender } = render(
    <div>
      <button data-testid={outsideId} />
      <DateRangePicker {...props} ref={ref} />
    </div>
  );
  const wrapper = createWrapper(container).findDateRangePicker()!;

  const rerenderWrapper = (newProps: DateRangePickerProps = initDefaultProps) =>
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
      describe.each(['iso', 'slashed', 'long-localized'] as DateRangePickerProps.AbsoluteFormat[])(
        'Format of %s',
        absoluteFormat => {
          const inputFormatsToTest = absoluteFormat === 'long-localized' ? ['iso', 'slashed'] : [absoluteFormat];
          describe.each([...inputFormatsToTest] as DateRangePickerProps.DateInputFormat[])(
            `${absoluteFormat === 'long-localized' ? '' : 'non-'}applicable dateInputFormat of %s`,
            dateInputFormat => {
              const isMonthOnly = granularity === 'month';
              const isIso =
                absoluteFormat === 'iso' || (absoluteFormat === 'long-localized' && dateInputFormat === 'iso');
              const separator = isIso ? '-' : '/';
              const findAt = isMonthOnly ? 'findMonthAt' : 'findDateAt';

              const defaultProps = {
                ...initDefaultProps,
                granularity,
                absoluteFormat,
                ...(absoluteFormat === 'long-localized' ? { dateInputFormat } : {}),
              };

              test('a11y day granularity', async () => {
                const { container } = render(
                  <DateRangePicker
                    {...defaultProps}
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
                  wrapper.findDropdown()!.findPreviousButton().click();
                  wrapper.findDropdown()!.findNextButton().click();
                  wrapper.findDropdown()![findAt]('left', 2, 1).click();
                  wrapper.findDropdown()![findAt]('right', 2, 1).click();
                  expect(onSubmit).not.toHaveBeenCalled();
                });
              });

              describe('data formats', () => {
                test(
                  isMonthOnly
                    ? 'granularity of month overrides dateOnly and parses out milliseconds'
                    : 'dateOnly parses out milliseconds',
                  () => {
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      dateOnly: true,
                      value: {
                        type: 'absolute',
                        startDate: '2018-01-02T05:00:00.000+08:45',
                        endDate: '2018-01-05T13:00:00.15+08:45',
                      },
                    });
                    const expectedNumericText = `2018${separator}01${isMonthOnly ? '' : `${separator}02`} — 2018${separator}01${isMonthOnly ? '' : `${separator}05`}`;
                    const expectedHumanReadableText = `January ${isMonthOnly ? '' : `2, `}2018 — January ${isMonthOnly ? '' : `5, `}2018`;
                    const expectedText =
                      absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText;
                    expect(wrapper.findTrigger().getElement()).toHaveTextContent(expectedText);
                  }
                );

                test('accepts optional milliseconds dateOnly is false', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    dateOnly: false,
                    value: {
                      type: 'absolute',
                      startDate: '2018-01-02T05:00:00.000+08:45',
                      endDate: '2018-01-05T13:00:00.15+08:45',
                    },
                  });
                  const expectedNumericText = `2018${separator}01${isMonthOnly ? '' : `${separator}02T05:00:00+08:45`} — 2018${separator}01${isMonthOnly ? '' : `${separator}05T13:00:00+08:45`}`;
                  const expectedHumanReadableText = `January ${isMonthOnly ? '' : `2, `}2018${isMonthOnly ? '' : ', 05:00:00 (UTC+8:45)'} — January ${isMonthOnly ? '' : `5, `}2018${isMonthOnly ? '' : ', 13:00:00 (UTC+8:45)'}`;
                  const expectedText =
                    absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText;
                  expect(wrapper.findTrigger().getElement()).toHaveTextContent(expectedText);
                });
              });

              describe('selection', () => {
                (absoluteFormat === 'long-localized' ? test.skip : test)('formats dates with / in place of -', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2018-01-02T05:00:00+08:45',
                      endDate: '2018-01-05T13:00:00+08:45',
                    },
                  });
                  expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                    isMonthOnly
                      ? `2018${separator}01 — 2018${separator}01`
                      : `2018${separator}01${separator}02T05:00:00+08:45 — 2018${separator}01${separator}05T13:00:00+08:45`
                  );
                });

                test('shows the header of the selected start date by default', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2020-03-02T05:00:00+08:45',
                      endDate: '2020-03-12T13:05:21+08:45',
                    },
                  });

                  wrapper.findTrigger().click();

                  const expectedResult = isMonthOnly ? '20202021' : 'March 2020';
                  expect(wrapper.findDropdown()!.findHeader().getElement()).toHaveTextContent(expectedResult);
                });

                test('pre-fills the dropdown with the selected value', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    granularity,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });

                  wrapper.findTrigger().click();

                  const expectedStartDate = `2021${separator}03${isMonthOnly ? '' : `${separator}02`}`;
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );

                  const expectedEndDate = `2021${separator}03${isMonthOnly ? '' : `${separator}12`}`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedEndDate
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '05:00:00'
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '13:05:21'
                    );
                  }
                  const expectedStartElementText = isMonthOnly ? 'MarMarch 2021' : '2';
                  const expectedEndElementText = isMonthOnly ? 'MarMarch 2021' : '12';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndElementText
                  );
                });

                test('start date can be selected', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });
                  wrapper.findTrigger().click();

                  wrapper.findDropdown()![findAt]('left', 3, 3).click();

                  const expectedStartDate = isMonthOnly ? `2021${separator}09` : `2021${separator}03${separator}16`;

                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );
                  const expectedStartElementText = isMonthOnly ? 'SepSeptember 2021' : '2';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '00:00:00'
                    );
                  }
                });

                test('start date can be selected with keyboard', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });
                  wrapper.findTrigger().click();

                  wrapper.findDropdown()![findAt]('left', 3, 3).focus();
                  wrapper.findDropdown()![findAt]('left', 3, 3).keydown(KeyCode.enter);

                  const expectedStartElementText = isMonthOnly ? 'SepSeptember 2021' : '2';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );
                  const expectedStartDate = isMonthOnly ? `2021${separator}09` : `2021${separator}03${separator}16`;
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );
                  if (!isMonthOnly) {
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
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });
                  wrapper.findTrigger().click();

                  wrapper.findDropdown()![findAt]('left', 2, 2).click();
                  wrapper.findDropdown()![findAt]('right', 3, 3).click();

                  const expectedEndDateElementText = isMonthOnly ? 'SepSeptember 2022' : '13April 13, 2021';
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndDateElementText
                  );
                  const exptectedEndDate = isMonthOnly ? `2022${separator}09` : `2021${separator}04${separator}13`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    exptectedEndDate
                  );
                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '23:59:59'
                    );
                  }
                });

                test('end date can be selected with keyboard day', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });
                  wrapper.findTrigger().click();

                  wrapper.findDropdown()![findAt]('left', 2, 3).click();
                  wrapper.findDropdown()![findAt]('right', 3, 3).focus();
                  wrapper.findDropdown()![findAt]('right', 3, 3).keydown(KeyCode.space);

                  const expectedEndDateElementText = isMonthOnly ? 'SepSeptember 2022' : '13April 13, 2021';
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndDateElementText
                  );
                  const exptectedEndDate = isMonthOnly ? `2022${separator}09` : `2021${separator}04${separator}13`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    exptectedEndDate
                  );
                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '23:59:59'
                    );
                  }
                });

                test('selecting a range in reverse will flip the range correctly', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });
                  wrapper.findTrigger().click();

                  wrapper.findDropdown()![findAt]('right', 3, 3).click();
                  wrapper.findDropdown()![findAt]('left', 3, 3).click();

                  const expectedStartDate = isMonthOnly ? `2021${separator}09` : `2021${separator}03${separator}16`;
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );
                  const expectedEndDate = isMonthOnly ? `2022${separator}09` : `2021${separator}04${separator}13`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedEndDate
                  );
                  const expectedStartElementText = isMonthOnly ? 'SepSeptember 2021' : '2';
                  const expectedEndElementText = isMonthOnly ? 'SepSeptember 2022' : '13April 13, 2021';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndElementText
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '00:00:00'
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '23:59:59'
                    );
                  }
                });

                test('missing start date can be filled (before end date) with day', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });

                  wrapper.findTrigger().click();
                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue('');
                  wrapper.findDropdown()![findAt]('left', 2, 3).click();

                  const expectedStartDate = isMonthOnly ? `2021${separator}03` : `2021${separator}03${separator}09`;
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );
                  const expectedEndDate = isMonthOnly ? `2021${separator}06` : `2021${separator}03${separator}12`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedEndDate
                  );
                  const expectedStartElementText = isMonthOnly ? 'MarMarch 2021' : '2';
                  const expectedEndElementText = isMonthOnly ? 'JunJune 2021' : '12March 12, 2021';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndElementText
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '00:00:00'
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '13:05:21'
                    );
                  }
                });

                test('missing start date can be filled (after end date, requires a swap)', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    value: {
                      type: 'absolute',
                      startDate: '2021-03-02T05:00:00+08:45',
                      endDate: '2021-03-12T13:05:21+08:45',
                    },
                  });

                  wrapper.findTrigger().click();
                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue('');
                  wrapper.findDropdown()![findAt]('left', 3, 3).click();

                  const expectedStartDate = isMonthOnly ? `2021${separator}03` : `2021${separator}03${separator}12`;
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedStartDate
                  );
                  const expectedEndDate = isMonthOnly ? `2021${separator}09` : `2021${separator}03${separator}16`;
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedEndDate
                  );
                  const expectedStartElementText = isMonthOnly ? 'MarMarch 2021' : '12';
                  const expectedEndElementText = isMonthOnly ? 'SepSeptember 2021' : '16March 16, 2021';
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartElementText
                  );
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndElementText
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '00:00:00'
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '23:59:59'
                    );
                  }
                });

                (['hh:mm:ss', 'hh:mm', 'hh'] as DateRangePickerProps['timeInputFormat'][]).forEach(timeInputFormat => {
                  test(
                    isMonthOnly
                      ? `a format ${timeInputFormat} does not change, nor is there a time offset`
                      : `sets start and end time to the beginning and end of day when only selecting a date with format ${timeInputFormat}`,
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
                        .setInputValue(`2018${separator}05${isMonthOnly ? '' : `${separator}10`}`);
                      wrapper
                        .findDropdown()!
                        .findEndDateInput()!
                        .setInputValue(`2018${separator}05${isMonthOnly ? '' : `${separator}12`}`);
                      wrapper.findDropdown()!.findApplyButton().click();
                      expect(onChangeSpy).toHaveBeenCalledWith(
                        expect.objectContaining({
                          value: {
                            type: 'absolute',
                            startDate: isMonthOnly ? '2018-05' : '2018-05-10T00:00:00+08:45',
                            endDate: isMonthOnly ? '2018-05' : '2018-05-12T23:59:59+08:45',
                          },
                        })
                      );
                    }
                  );
                });
              });

              const expectedStartDateValue = `2018${separator}05${isMonthOnly ? '' : `${separator}10`}`;
              const expectedEndDateValue = `2018${separator}05${isMonthOnly ? '' : `${separator}12`}`;

              (isMonthOnly ? describe.skip : describe)('time formats', () => {
                test('hh:mm:ss format uses the provided string', () => {
                  const onChangeSpy = jest.fn();
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    timeInputFormat: 'hh:mm:ss',
                    onChange: event => onChangeSpy(event.detail),
                  });

                  wrapper.findTrigger().click();
                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
                  wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);

                  wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05:00:05');
                  wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23:00:05');

                  wrapper.findDropdown()!.findApplyButton().click();
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-05-10T05:00:05+08:45',
                        endDate: '2018-05-12T23:00:05+08:45',
                      },
                    })
                  );
                });

                test('hh:mm:ss gets hidden when dateOnly', () => {
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

                  wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05:00');
                  wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23:00');

                  wrapper.findDropdown()!.findApplyButton().click();
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-05-10T05:00:00+08:45',
                        endDate: '2018-05-12T23:00:00+08:45',
                      },
                    })
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

                  wrapper.findDropdown()!.findStartTimeInput()!.setInputValue('05');
                  wrapper.findDropdown()!.findEndTimeInput()!.setInputValue('23');
                  wrapper.findDropdown()!.findApplyButton().click();
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-05-10T05:00:00+08:45',
                        endDate: '2018-05-12T23:00:00+08:45',
                      },
                    })
                  );
                });
              });

              (isMonthOnly ? describe.skip : describe)('time offset', () => {
                test('creates values in the provided time offset', () => {
                  const onChangeSpy = jest.fn();
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    timeOffset: 6.5 * 60,
                    onChange: event => onChangeSpy(event.detail),
                  });

                  wrapper.findTrigger().click();
                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
                  wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);
                  wrapper.findDropdown()!.findApplyButton().click();

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-05-10T00:00:00+06:30',
                        endDate: '2018-05-12T23:59:59+06:30',
                      },
                    })
                  );
                });

                test("creates values with the browser's default offset", () => {
                  const onChangeSpy = jest.fn();
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    onChange: event => onChangeSpy(event.detail),
                  });

                  wrapper.findTrigger().click();

                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue(expectedStartDateValue);
                  wrapper.findDropdown()!.findEndDateInput()!.setInputValue(expectedEndDateValue);

                  wrapper.findDropdown()!.findApplyButton().click();

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-05-10T00:00:00+08:45',
                        endDate: '2018-05-12T23:59:59+08:45',
                      },
                    })
                  );
                });

                test('transforms current value into the chosen time offset', () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    timeOffset: -8 * 60,
                    value: {
                      type: 'absolute',
                      startDate: '2018-01-02T05:00:00+04:00',
                      endDate: '2018-01-05T13:00:00+04:00',
                    },
                  });

                  const expectedNumericText = `2018${separator}01${separator}01T17:00:00-08:00 — 2018${separator}01${separator}05T01:00:00-08:00`;
                  const expectedHumanReadableText = `January 1, 2018, 17:00:00 (UTC-8) — January 5, 2018, 01:00:00 (UTC-8)`;
                  expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                    absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText
                  );

                  wrapper.findTrigger().click();

                  expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                    '17:00:00'
                  );
                  expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                    '01:00:00'
                  );
                });

                test("understands the UTC timezone indicator 'Z'", () => {
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    timeOffset: -8 * 60,
                    value: {
                      type: 'absolute',
                      startDate: '2018-01-02T05:00:00Z',
                      endDate: '2018-01-05T13:00:00-04:00',
                    },
                  });

                  const expectedNumericText = `2018${separator}01${separator}01T21:00:00-08:00 — 2018${separator}01${separator}05T09:00:00-08:00`;
                  const expectedHumanReadableText =
                    'January 1, 2018, 21:00:00 (UTC-8) — January 5, 2018, 09:00:00 (UTC-8)';
                  expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                    absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText
                  );

                  wrapper.findTrigger().click();

                  expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                    '21:00:00'
                  );
                  expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                    '09:00:00'
                  );
                });

                test('detects misformatted dates', () => {
                  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

                  try {
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      value: {
                        type: 'absolute',
                        startDate: '2018-01-02T05:00:00+',
                        endDate: '2018-01-05T13:00:00-04:00',
                      },
                    });

                    //todo  fid out why not firing for 'slashed'
                    if (absoluteFormat === 'iso') {
                      expect(consoleSpy).toHaveBeenCalledTimes(1);

                      expect(consoleSpy).toHaveBeenCalledWith(
                        '[AwsUi] [DateRangePicker] You have provided a misformatted start or end date. The component will fall back to an empty value. Dates have to be ISO8601-formatted with an optional time zone offset.'
                      );
                    }

                    expect(wrapper.findTrigger().getElement()).toHaveTextContent('Test Placeholder');
                  } finally {
                    consoleSpy.mockRestore();
                  }
                });

                test('correctly parses offsets >= 10', () => {
                  {
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      timeOffset: 10 * 60,
                      value: {
                        type: 'absolute',
                        startDate: '2018-01-02T00:00:00+10:00',
                        endDate: '2018-01-05T10:00:00+10:00',
                      },
                    });

                    const expectedNumericText = `2018${separator}01${separator}02T00:00:00+10:00 — 2018${separator}01${separator}05T10:00:00+10:00`;
                    const expectedHumanReadableText =
                      'January 2, 2018, 00:00:00 (UTC+10) — January 5, 2018, 10:00:00 (UTC+10)';
                    expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                      absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText
                    );
                  }

                  {
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      timeOffset: 20 * 60,
                      value: {
                        type: 'absolute',
                        startDate: '2018-01-02T00:00:00+20:00',
                        endDate: '2018-01-05T10:00:00+20:00',
                      },
                    });

                    const expectedNumericText2 = `2018${separator}01${separator}02T00:00:00+20:00 — 2018${separator}01${separator}05T10:00:00+20:00`;
                    const expectedHumanReadableText2 =
                      'January 2, 2018, 00:00:00 (UTC+20) — January 5, 2018, 10:00:00 (UTC+20)';
                    expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                      absoluteFormat === 'long-localized' ? expectedHumanReadableText2 : expectedNumericText2
                    );
                  }
                });

                test('creates offset as a function from date', () => {
                  const onChangeSpy = jest.fn();
                  const getTimeOffset = jest
                    .fn()
                    .mockImplementation((date: Date) => (date.getUTCMonth() === 5 ? 120 : 60));
                  const { wrapper } = renderDateRangePicker({
                    ...defaultProps,
                    timeOffset: 6.5 * 60, // to be ignored as getTimeOffset is preferred
                    getTimeOffset,
                    onChange: event => onChangeSpy(event.detail),
                  });

                  wrapper.findTrigger().click();

                  wrapper.findDropdown()!.findStartDateInput()!.setInputValue(`2018${separator}01${separator}01`);
                  wrapper.findDropdown()!.findEndDateInput()!.setInputValue(`2018${separator}06${separator}01`);

                  wrapper.findDropdown()!.findApplyButton().click();

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                      value: {
                        type: 'absolute',
                        startDate: '2018-01-01T00:00:00+01:00',
                        endDate: '2018-06-01T23:59:59+02:00',
                      },
                    })
                  );

                  expect(getTimeOffset).toHaveBeenCalledTimes(!isMonthOnly ? 2 : 0);
                });
              });

              describe('date-only', () => {
                //todo find out why not working with non-iso formats
                testIf(absoluteFormat === 'iso')('shows warning when dateOnly changes', () => {
                  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

                  try {
                    const { rerender } = renderDateRangePicker({ ...defaultProps, granularity, dateOnly: false });
                    rerender({ ...defaultProps, dateOnly: true });
                    rerender({ ...defaultProps, dateOnly: false });

                    expect(consoleSpy).toHaveBeenCalledTimes(!isMonthOnly ? 2 : 0);

                    if (!isMonthOnly) {
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
                  isMonthOnly ? 'date-only has no effect on value' : 'formatted date-only range has no time part',
                  () => {
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      dateOnly: true,
                      value: { type: 'absolute', startDate: '2018-01-02', endDate: '2018-01-05' },
                    });
                    const expectedNumericText = `2018${separator}01${isMonthOnly ? '' : `${separator}02`} — 2018${separator}01${isMonthOnly ? '' : `${separator}05`}`;
                    const expectedHumanReadableText = `January ${isMonthOnly ? '' : '2, '}2018 — January ${isMonthOnly ? '' : '5, '}2018`;
                    expect(wrapper.findTrigger().getElement()).toHaveTextContent(
                      absoluteFormat === 'long-localized' ? expectedHumanReadableText : expectedNumericText
                    );
                  }
                );

                test(
                  isMonthOnly ? 'date-only has no effect on saving' : 'date-only range is saved without time part',
                  () => {
                    const onChangeSpy = jest.fn();
                    const { wrapper } = renderDateRangePicker({
                      ...defaultProps,
                      dateOnly: true,
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
                        isMonthOnly
                          ? { value: { type: 'absolute', startDate: '2018-05', endDate: '2018-05' } }
                          : { value: { type: 'absolute', startDate: '2018-05-10', endDate: '2018-05-12' } }
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
                    value: { type: 'absolute', startDate: '2022-11-24T12:55:00', endDate: '2022-11-28T11:14:00' },
                    customAbsoluteRangeControl: customControl,
                  });
                  wrapper.findTrigger().click();
                  expect(getByTestId('display')).toHaveTextContent(
                    isMonthOnly
                      ? '{"start":{"date":"2022-11","time":""},"end":{"date":"2022-11","time":""}}'
                      : '{"start":{"date":"2022-11-24","time":"12:55:00"},"end":{"date":"2022-11-28","time":"11:14:00"}}'
                  );
                });

                test('can update value in calendar', () => {
                  const { wrapper, getByTestId } = renderDateRangePicker({
                    ...defaultProps,
                    customAbsoluteRangeControl: customControl,
                  });
                  wrapper.findTrigger().click();
                  getByTestId('set-date').click();
                  const expectedDisplay = isMonthOnly
                    ? '{"start":{"date":"2022-01-02","time":"00:00:00"},"end":{"date":"2022-02-06","time":"12:34:56"}}'
                    : '{"start":{"date":"2022-01-02","time":"00:00:00"},"end":{"date":"2022-02-06","time":"12:34:56"}}';
                  expect(getByTestId('display')).toHaveTextContent(expectedDisplay);

                  const expectedStartDateText = isMonthOnly ? 'JanJanuary 2022' : '2';
                  const expectdStartDateValue = `2022${separator}01${isMonthOnly ? '' : `${separator}02`}`;
                  expect(wrapper.findDropdown()!.findSelectedStartDate()!.getElement()).toHaveTextContent(
                    expectedStartDateText
                  );
                  expect(wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectdStartDateValue
                  );

                  const expectedEndDateText = isMonthOnly ? 'FebFebruary 2022' : '6';
                  const expectedEndDateValue = `2022${separator}02${isMonthOnly ? '' : `${separator}06`}`;
                  expect(wrapper.findDropdown()!.findSelectedEndDate()!.getElement()).toHaveTextContent(
                    expectedEndDateText
                  );
                  expect(wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()).toHaveValue(
                    expectedEndDateValue
                  );

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '00:00:00'
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      '12:34:56'
                    );
                  }
                });

                test('can clear value in calendar', () => {
                  const { wrapper, getByTestId } = renderDateRangePicker({
                    ...defaultProps,
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

                  if (isMonthOnly) {
                    expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                    expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                  } else {
                    expect(wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()).toHaveValue(
                      ''
                    );
                    expect(wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()).toHaveValue('');
                  }
                });
              });

              describe('i18n', () => {
                describe.each([true, false] as const)('With dateOnly of %s', dateOnly => {
                  test.skip('supports using absolute range with i18n defaults', () => {
                    const { container } = render(
                      <DateRangePicker
                        {...defaultProps}
                        rangeSelectorMode="absolute-only"
                        i18nStrings={i18nStrings}
                        dateOnly={dateOnly}
                      />
                    );
                    const wrapper = createWrapper(container).findDateRangePicker()!;
                    wrapper.openDropdown();

                    //prev page
                    expect(wrapper.findDropdown()!.findPreviousButton().getElement()).toHaveAccessibleName(
                      i18nStrings[isMonthOnly ? 'previousYearAriaLabel' : 'previousMonthAriaLabel']
                    );

                    //next page
                    expect(wrapper.findDropdown()!.findNextButton().getElement()).toHaveAccessibleName(
                      i18nStrings[isMonthOnly ? 'nextYearAriaLabel' : 'nextMonthAriaLabel']
                    );

                    expect(
                      wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleName(i18nStrings[isMonthOnly ? 'startMonthLabel' : 'startDateLabel']);
                    expect(
                      wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleName(i18nStrings[isMonthOnly ? 'endMonthLabel' : 'endDateLabel']);

                    //todo test fallbacks
                    expect(
                      wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleDescription(
                      isMonthOnly
                        ? isIso
                          ? i18nStrings.isoMonthConstraintText
                          : i18nStrings.slashedMonthConstraintText
                        : dateOnly
                          ? isIso
                            ? i18nStrings.isoDateConstraintText
                            : i18nStrings.slashedDateConstraintText
                          : isIso
                            ? i18nStrings.isoDateTimeConstraintText
                            : i18nStrings.slashedDateTimeConstraintText
                    );

                    if (dateOnly || isMonthOnly) {
                      expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                      expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                    } else {
                      expect(
                        wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()
                      ).toHaveAccessibleName(i18nStrings.startTimeLabel);

                      expect(
                        wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()
                      ).toHaveAccessibleName(i18nStrings.endTimeLabel);
                    }
                    if (isMonthOnly) {
                      expect(wrapper.findDropdown()!.findPreviousButton().getElement()).toHaveAccessibleName(
                        i18nStrings.previousYearAriaLabel
                      );
                      expect(wrapper.findDropdown()!.findNextButton().getElement()).toHaveAccessibleName(
                        i18nStrings.nextYearAriaLabel
                      );
                      expect(wrapper.findDropdown()!.findCurrentMonth().getElement().textContent).toContain(
                        i18nStrings.currentMonthAriaLabel
                      );
                    } else {
                      expect(wrapper.findDropdown()!.findCurrentDay().getElement().textContent).toContain(
                        i18nStrings.todayAriaLabel
                      );
                    }
                  });

                  //todo confirm why this and only this is failing. Has to to with build as it is making assertions on newly added keys
                  test.skip('supports using absolute range customized from i18n provider with fallback for constraint texts', () => {
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
                            //dateOnly
                            'i18nStrings.dateConstraintText': 'Custom date constraint text',
                            'i18nStrings.slashedDateConstraintText': "Custom 'slashed' format date constraint text",
                            'i18nStrings.isoDateConstraintText': "Custom 'iso' format date constraint text",
                            //date & time inputs
                            'i18nStrings.dateTimeConstraintText': 'Custom date & time constraint text',
                            'i18nStrings.slashedDateTimeConstraintText':
                              "Custom 'slashed' format date & time constraint text",
                            'i18nStrings.isoDateTimeConstraintText': "Custom 'iso' format date & time constraint text",
                            //month inputs
                            'i18nStrings.monthConstraintText': 'Custom month constraint text',
                            'i18nStrings.slashedMonthConstraintText': "Custom 'slashed' format month constraint text",
                            'i18nStrings.isoMonthConstraintText': "Custom 'iso' month constraint text",
                            //calendar
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
                        />
                      </TestI18nProvider>
                    );
                    const wrapper = createWrapper(container).findDateRangePicker()!;
                    wrapper.openDropdown();

                    //prev page
                    expect(wrapper.findDropdown()!.findPreviousButton().getElement()).toHaveAccessibleName(
                      isMonthOnly ? 'Custom previous year' : 'Custom previous month'
                    );

                    //next page
                    expect(wrapper.findDropdown()!.findNextButton().getElement()).toHaveAccessibleName(
                      isMonthOnly ? 'Custom next year' : 'Custom next month'
                    );

                    expect(
                      wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleName(isMonthOnly ? 'Custom start month' : 'Custom start date');
                    expect(
                      wrapper.findDropdown()!.findEndDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleName(isMonthOnly ? 'Custom end month' : 'Custom end date');
                    expect(
                      wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleDescription(
                      isMonthOnly
                        ? isIso
                          ? "Custom 'iso' month constraint text"
                          : "Custom 'slashed' format month constraint text"
                        : dateOnly
                          ? isIso
                            ? "Custom 'iso' format date constraint text"
                            : "Custom 'slashed' format date constraint text"
                          : 'Custom date & time constraint text'
                    );

                    if (dateOnly || isMonthOnly) {
                      expect(wrapper.findDropdown()!.findStartTimeInput()).toBeNull();
                      expect(wrapper.findDropdown()!.findEndTimeInput()).toBeNull();
                    } else {
                      expect(
                        wrapper.findDropdown()!.findStartTimeInput()!.findNativeInput().getElement()
                      ).toHaveAccessibleName('Custom start time');

                      expect(
                        wrapper.findDropdown()!.findEndTimeInput()!.findNativeInput().getElement()
                      ).toHaveAccessibleName('Custom end time');
                    }
                    if (!isMonthOnly) {
                      expect(wrapper.findDropdown()!.findPreviousMonthButton().getElement()).toHaveAccessibleName(
                        'Custom previous month'
                      );
                      expect(wrapper.findDropdown()!.findNextMonthButton().getElement()).toHaveAccessibleName(
                        'Custom next month'
                      );
                      expect(wrapper.findDropdown()!.findCurrentDay().getElement().textContent).toContain(
                        'Custom today'
                      );
                    } else {
                      expect(wrapper.findDropdown()!.findCurrentMonth().getElement().textContent).toContain(
                        'Custom this month'
                      );
                    }
                  });

                  //todo get working
                  test.skip('supports using absolute range customized from i18n provider', () => {
                    const { container } = render(
                      <TestI18nProvider
                        messages={{
                          'date-range-picker': {
                            //dateOnly
                            'i18nStrings.dateConstraintText': 'Custom date constraint text',
                            //date & time inputs
                            'i18nStrings.dateTimeConstraintText': 'Custom date & time constraint text',
                            //month inputs
                            'i18nStrings.monthConstraintText': 'Custom month constraint text',
                          },
                        }}
                      >
                        <DateRangePicker
                          {...defaultProps}
                          dateOnly={dateOnly}
                          rangeSelectorMode="absolute-only"
                          i18nStrings={undefined}
                        />
                      </TestI18nProvider>
                    );
                    const wrapper = createWrapper(container).findDateRangePicker()!;
                    wrapper.openDropdown();

                    expect(
                      wrapper.findDropdown()!.findStartDateInput()!.findNativeInput().getElement()
                    ).toHaveAccessibleDescription(
                      isMonthOnly
                        ? 'Custom month constraint text'
                        : dateOnly
                          ? 'Custom date constraint text'
                          : 'Custom date & time constraint text'
                    );
                  });
                });
              });
            }
          );
        }
      );
    });
  });
});
