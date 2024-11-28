// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  getBaseDate,
  getBaseDay,
  getBaseMonth,
  moveDate,
  moveMonthDown,
  moveMonthUp,
  moveNextDay,
  moveNextMonth,
  moveNextWeek,
  movePrevDay,
  movePrevMonth,
  movePrevWeek,
} from '../navigation';

jest.mock('date-fns', () => ({ ...jest.requireActual('date-fns'), startOfMonth: () => new Date('2022-01-01') }));

const startYear = '2022',
  startMonth = '01',
  startDay = '15';
const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);

function disableDates(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getTime() !== date.getTime());
}
function disableMonths(...blockedDates: string[]) {
  return (date: Date) => blockedDates.every(blocked => new Date(blocked).getMonth() !== date.getMonth());
}

describe('getBaseDate function', () => {
  const isDateFocusable = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns start of year for month granularity when start of year is focusable', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockReturnValue(true);

    const result = getBaseDate({
      date,
      granularity: 'month',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-01-01'));
    expect(isDateFocusable).toHaveBeenCalledWith(new Date('2024-01-01'));
  });

  test('returns start of month for day granularity when start of month is focusable', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockReturnValue(true);

    const result = getBaseDate({
      date,
      granularity: 'day',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-05-01'));
    expect(isDateFocusable).toHaveBeenCalledWith(new Date('2024-05-01'));
  });

  test('returns first enabled date for month granularity when start of year is not focusable', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockImplementation(d => d.getMonth() === 1); // Only February is focusable

    const result = getBaseDate({
      date,
      granularity: 'month',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-02-01'));
  });

  test('returns first enabled date for day granularity when start of month is not focusable', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockImplementation(d => d.getDate() === 3); // Only 3rd of the month is focusable

    const result = getBaseDate({
      date,
      granularity: 'day',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-05-03'));
  });

  test('returns start date for month granularity when no focusable date in the same year', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockReturnValue(false);

    const result = getBaseDate({
      date,
      granularity: 'month',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-01-01'));
  });

  test('returns start date for day granularity when no focusable date in the same month', () => {
    const date = new Date('2024-05-15');
    isDateFocusable.mockReturnValue(false);

    const result = getBaseDate({
      date,
      granularity: 'day',
      isDateFocusable,
    });

    expect(result).toEqual(new Date('2024-05-01'));
  });
});

describe('moveDate function', () => {
  const isDateFocusable = (date: Date) => {
    // Example implementation: consider weekdays as focusable
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  test('moves date forward by days when granularity is not month', () => {
    const startDate = new Date('2024-01-01');
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: 1,
    });
    expect(result).toEqual(new Date('2024-01-02'));
  });

  test('moves month forward by months when granularity is month', () => {
    const startDate = new Date('2024-01-15');
    const result = moveDate({
      startDate,
      granularity: 'month',
      isDateFocusable,
      step: 1,
    });
    expect(result).toEqual(new Date('2024-02-15'));
  });

  test('moves date backward by days when step is negative', () => {
    const startDate = new Date('2024-01-05');
    const result = moveDate({
      startDate,
      granularity: 'month',
      isDateFocusable,
      step: -1,
    });
    expect(result).toEqual(new Date('2023-12-05'));
  });

  test('moves month backward by month when step is negative', () => {
    const startDate = new Date('2024-01-05');
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: -1,
    });
    expect(result).toEqual(new Date('2024-01-04'));
  });

  test('skips unfocusable dates', () => {
    const startDate = new Date('2024-01-05'); // Saturday
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: 1,
    });
    expect(result).toEqual(new Date('2024-01-08')); // Monday
  });

  test('returns start date if no focusable date found within limit (day granularity)', () => {
    const startDate = new Date('2024-01-01');
    const alwaysUnfocusable = () => false;
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable: alwaysUnfocusable,
      step: 1,
    });
    expect(result).toEqual(startDate);
  });

  test('returns start date if no focusable date found within limit (month granularity)', () => {
    const startDate = new Date('2024-01-01');
    const alwaysUnfocusable = () => false;
    const result = moveDate({
      startDate,
      granularity: 'month',
      isDateFocusable: alwaysUnfocusable,
      step: 1,
    });
    expect(result).toEqual(startDate);
  });

  test('handles a week of steps correctly in same month', () => {
    const startDate = new Date('2024-01-01');
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: 7,
    });
    expect(result).toEqual(new Date('2024-01-08'));
  });

  test('handles a week of steps correctly in different month', () => {
    const startDate = new Date('2024-01-01');
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: -7,
    });
    expect(result).toEqual(new Date('2023-12-25'));
  });

  test('handles date near year boundary', () => {
    const startDate = new Date('2024-12-30');
    const result = moveDate({
      startDate,
      granularity: 'day',
      isDateFocusable,
      step: 7,
    });
    expect(result).toEqual(new Date('2025-01-06'));
  });
});

test('moveNextDay', () => {
  expect(moveNextDay(startDate, () => true)).toEqual(new Date('2022-01-16'));
  expect(moveNextDay(startDate, disableDates('2022-01-16', '2022-01-17'))).toEqual(new Date('2022-01-18'));
});

test('movePrevDay', () => {
  expect(movePrevDay(startDate, () => true)).toEqual(new Date('2022-01-14'));
  expect(movePrevDay(startDate, disableDates('2022-01-14', '2022-01-13'))).toEqual(new Date('2022-01-12'));
});

test('moveNextWeek', () => {
  expect(moveNextWeek(startDate, () => true)).toEqual(new Date('2022-01-22'));
  expect(moveNextWeek(startDate, disableDates('2022-01-22', '2022-01-29'))).toEqual(new Date('2022-02-05'));
});

test('movePrevWeek', () => {
  expect(movePrevWeek(startDate, () => true)).toEqual(new Date('2022-01-08'));
  expect(movePrevWeek(startDate, disableDates('2022-01-08', '2022-01-01'))).toEqual(new Date('2021-12-25'));
});

test('getBaseDay', () => {
  expect(getBaseDay(startDate, () => true)).toEqual(new Date('2022-01-01'));
  expect(getBaseDay(startDate, disableDates('2022-01-01', '2022-01-02'))).toEqual(new Date('2022-01-03'));
  expect(getBaseDay(startDate, () => false)).toEqual(new Date('2022-01-01'));
});

test('moveNextMonth', () => {
  expect(moveNextMonth(startDate, () => true)).toEqual(new Date(`2022-02-${startDay}`));
  expect(moveNextMonth(startDate, disableMonths('2022-02-16', '2022-02-17'))).toEqual(new Date(`2022-03-${startDay}`));
});

test('movePrevMonth', () => {
  expect(movePrevMonth(startDate, () => true)).toEqual(new Date(`2021-12-${startDay}`));
  expect(movePrevMonth(startDate, disableMonths('2021-12-14', '2021-12-13'))).toEqual(new Date(`2021-11-${startDay}`));
});

test('moveMonthDown', () => {
  expect(moveMonthDown(startDate, () => true)).toEqual(new Date(`2022-04-${startDay}`));
  expect(moveMonthDown(startDate, disableDates('2022-04-22', '2022-04-29'))).toEqual(new Date(`2022-07-${startDay}`));
});

test('moveMonthUp', () => {
  expect(moveMonthUp(startDate, () => true)).toEqual(new Date(`2021-10-${startDay}`));
  expect(moveMonthUp(startDate, disableDates('2021-10-08', '2021-10-01'))).toEqual(new Date(`2021-07-${startDay}`));
});

test('getBaseMonth', () => {
  expect(getBaseMonth(startDate, () => true)).toEqual(new Date('2022-01-01'));
  expect(getBaseMonth(startDate, disableMonths('2022-01-01', '2022-01-02'))).toEqual(new Date('2022-02-01'));
  expect(getBaseMonth(startDate, () => false)).toEqual(new Date('2022-01-01'));
});
