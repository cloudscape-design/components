// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import MockDate from 'mockdate';

import '../../__a11y__/to-validate-a11y';
import Calendar, { CalendarProps } from '../../../lib/components/calendar';
import { KeyCode } from '../../../lib/components/internal/keycode';
import createWrapper, { CalendarWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/calendar/styles.selectors.js';
import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

// The calendar is mostly tested here: src/date-picker/__tests__/date-picker-calendar.test.tsx

const localeDE = new Intl.DateTimeFormat('de-DE', { timeZone: 'GMT' });

const defaultProps: CalendarProps = {
  i18nStrings: {
    todayAriaLabel: 'Today',
    nextMonthAriaLabel: 'next month',
    previousMonthAriaLabel: 'prev month',
  },
  value: '',
};

function renderCalendar(props: CalendarProps = defaultProps) {
  const { container } = render(<Calendar {...props} />);
  const wrapper = createWrapper(container).findCalendar()!;
  return { container, wrapper };
}

function findCalendarWeekdays(wrapper: CalendarWrapper) {
  return wrapper
    .findAll(`.${styles['calendar-date-header']} :not(.${screenreaderOnlyStyles.root})`)
    .map(day => day.getElement().textContent!.trim());
}

function getDayText(wrapper: CalendarWrapper, row: number, col: number) {
  return wrapper.findDateAt(row, col).findByClassName(styles['date-inner'])!.getElement().textContent;
}

describe('Calendar', () => {
  test('check a11y', async () => {
    const { container } = renderCalendar();
    await expect(container).toValidateA11y();
  });
});

describe('Calendar locale US', () => {
  beforeEach(() => {
    const locale = new Intl.DateTimeFormat('en-US', { timeZone: 'EST' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  test('start of the week is Sunday', () => {
    const { wrapper } = renderCalendar();
    expect(findCalendarWeekdays(wrapper)[0]).toBe('Sun');
  });
});

describe('Calendar locale DE', () => {
  beforeEach(() => {
    const locale = new Intl.DateTimeFormat('de-DE', { timeZone: 'GMT' });
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => locale);
  });
  afterEach(() => jest.restoreAllMocks());

  test('start of the week is Monday', () => {
    const { wrapper } = renderCalendar();
    expect(findCalendarWeekdays(wrapper)[0]).toBe('Mo');
  });
});

describe('Calendar header', () => {
  test('previous button navigates to previous month', () => {
    const { wrapper } = renderCalendar({ value: '2022-01-07' });
    expect(wrapper.findHeader().getElement()).toHaveTextContent('January 2022');
    wrapper.findPreviousButton().click();
    expect(wrapper.findHeader().getElement()).toHaveTextContent('December 2021');
  });

  test('next button navigates to next month', () => {
    const { wrapper } = renderCalendar({ value: '2022-01-07' });
    expect(wrapper.findHeader().getElement()).toHaveTextContent('January 2022');
    wrapper.findNextButton().click();
    expect(wrapper.findHeader().getElement()).toHaveTextContent('February 2022');
  });
});

describe('aria labels', () => {
  describe('aria-label', () => {
    test('can be set', () => {
      const { container } = render(<Calendar {...defaultProps} ariaLabel="This is a label for the calendar" />);
      const wrapper = createWrapper(container);

      expect(wrapper.findCalendar()!.getElement()).toHaveAttribute('aria-label', 'This is a label for the calendar');
    });
  });

  describe('aria-labelledby', () => {
    test('can be set', () => {
      const { container } = render(<Calendar {...defaultProps} ariaLabelledby="calendar-label" />);
      const wrapper = createWrapper(container);

      expect(wrapper.findCalendar()!.getElement()).toHaveAttribute(
        'aria-labelledby',
        expect.stringContaining('calendar-label')
      );
    });
  });

  describe('aria-describedby', () => {
    test('can be set', () => {
      const { container } = render(<Calendar {...defaultProps} ariaDescribedby="calendar-description" />);
      const wrapper = createWrapper(container);

      expect(wrapper.findCalendar()!.getElement()).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('calendar-description')
      );
    });
  });

  describe('should add `todayAriaLabel` to today', () => {
    const getTodayLabelText = (container: HTMLElement) => {
      return container
        .querySelector(`.${styles['calendar-date-current']}`)!
        .querySelector(`.${screenreaderOnlyStyles.root}`)!.textContent;
    };

    test('from i18nStrings', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          i18nStrings={{
            todayAriaLabel: 'TEST TODAY',
          }}
        />
      );
      expect(getTodayLabelText(container)).toMatch('TEST TODAY');
    });

    test('from deprecated top-level property', () => {
      const { container } = render(<Calendar {...defaultProps} i18nStrings={undefined} todayAriaLabel="TEST TODAY" />);
      expect(getTodayLabelText(container)).toMatch('TEST TODAY');
    });

    test('does not add `undefined` if not provided', () => {
      const { container } = render(<Calendar {...defaultProps} i18nStrings={undefined} />);
      expect(getTodayLabelText(container)).not.toContain('undefined');
    });
  });

  describe('should add `nextMonthAriaLabel` to appropriate button', () => {
    test('from i18nStrings', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          i18nStrings={{
            nextMonthAriaLabel: 'TEST NEXT MONTH',
          }}
        />
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findCalendar()!.findNextButton().getElement()!.getAttribute('aria-label')).toMatch(
        'TEST NEXT MONTH'
      );
    });

    test('from deprecated top-level property', () => {
      const { container } = render(
        <Calendar {...defaultProps} i18nStrings={undefined} nextMonthAriaLabel="TEST NEXT MONTH" />
      );
      const wrapper = createWrapper(container);
      expect(wrapper.findCalendar()!.findNextButton().getElement()!.getAttribute('aria-label')).toMatch(
        'TEST NEXT MONTH'
      );
    });
  });
});

describe('should add `previousMonthAriaLabel` to appropriate button in the calendar', () => {
  test('from i18nStrings', () => {
    const { container } = render(
      <Calendar
        {...defaultProps}
        i18nStrings={{
          previousMonthAriaLabel: 'TEST PREVIOUS MONTH',
        }}
      />
    );
    const wrapper = createWrapper(container);
    expect(wrapper.findCalendar()!.findPreviousButton().getElement()!.getAttribute('aria-label')).toMatch(
      'TEST PREVIOUS MONTH'
    );
  });

  test('from deprecated top-level property', () => {
    const { container } = render(
      <Calendar {...defaultProps} i18nStrings={undefined} previousMonthAriaLabel="TEST PREVIOUS MONTH" />
    );
    const wrapper = createWrapper(container);
    expect(wrapper.findCalendar()!.findPreviousButton().getElement()!.getAttribute('aria-label')).toMatch(
      'TEST PREVIOUS MONTH'
    );
  });
});

describe('selected date', () => {
  beforeEach(() => jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => localeDE));
  afterEach(() => jest.restoreAllMocks());

  test('aria-selected is set for selected date only', () => {
    const { container } = render(<Calendar {...defaultProps} value="2022-01-07" />);
    const wrapper = createWrapper(container).findCalendar()!;
    const selectedDateRow = 2;
    const selectedDateCol = 5;

    expect(getDayText(wrapper, selectedDateRow, selectedDateCol)).toBe('7');

    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 7; col++) {
        const matchesSelected = row === selectedDateRow && col === selectedDateCol;
        expect(wrapper.findDateAt(row, col).getElement()).toHaveAttribute('aria-selected', String(matchesSelected));
      }
    }
  });

  test('aria-selected is not set when selected date is disabled', () => {
    const { container } = render(
      <Calendar {...defaultProps} value="2022-01-07" isDateEnabled={date => date.getDate() !== 7} />
    );
    const wrapper = createWrapper(container).findCalendar()!;
    const selectedDateRow = 2;
    const selectedDateCol = 5;

    expect(getDayText(wrapper, selectedDateRow, selectedDateCol)).toBe('7');

    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 7; col++) {
        expect(wrapper.findDateAt(row, col).getElement()).not.toHaveAttribute('aria-selected', 'true');
      }
    }
  });
});

describe('disabled date', () => {
  beforeEach(() => jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => localeDE));
  afterEach(() => jest.restoreAllMocks());

  test('aria-disabled is set for all disabled dates', () => {
    const { container } = render(
      <Calendar {...defaultProps} value="2022-01-07" isDateEnabled={date => date.getDay() !== 4} />
    );
    const wrapper = createWrapper(container).findCalendar()!;
    const disabledDateCol = 4;

    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 7; col++) {
        const matchesDisabled = col === disabledDateCol;
        expect(wrapper.findDateAt(row, col).getElement()).toHaveAttribute('aria-disabled', String(matchesDisabled));
      }
    }
  });

  describe('disabled with reason', () => {
    test('has no tooltip open by default', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'disabled on Sundays';
            }

            return '';
          }}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      expect(wrapper.findDateAt(1, 6).findDisabledReason()).toBe(null);
    });

    test('has no tooltip without disabledReason', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      wrapper.findDateAt(1, 6).focus();

      expect(wrapper.findDateAt(1, 6).findDisabledReason()).toBe(null);
    });

    test('open tooltip on focus', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      wrapper.findDateAt(1, 6).focus();

      expect(wrapper.findDateAt(1, 6).findDisabledReason()!.getElement()).toHaveTextContent('Disabled on Saturdays');
    });

    test('closes tooltip on blur', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      wrapper.findDateAt(1, 6).focus();

      expect(wrapper.findDateAt(1, 6).findDisabledReason()!.getElement()).toHaveTextContent('Disabled on Saturdays');

      wrapper.findDateAt(1, 6).blur();

      expect(wrapper.findDateAt(1, 6).findDisabledReason()).toBe(null);
    });

    test('open tooltip on mouseenter', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      fireEvent.mouseEnter(wrapper.findDateAt(1, 6).getElement());

      expect(wrapper.findDateAt(1, 6).findDisabledReason()!.getElement()).toHaveTextContent('Disabled on Saturdays');
    });

    test('close tooltip on mouseleave', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      fireEvent.mouseEnter(wrapper.findDateAt(1, 6).getElement());

      expect(wrapper.findDateAt(1, 6).findDisabledReason()!.getElement()).toHaveTextContent('Disabled on Saturdays');

      fireEvent.mouseLeave(wrapper.findDateAt(1, 6).getElement());

      expect(wrapper.findDateAt(1, 6).findDisabledReason()).toBe(null);
    });

    test('has no aria-describedby by default', () => {
      const { container } = render(<Calendar {...defaultProps} value="2022-01-03" />);
      const wrapper = createWrapper(container).findCalendar()!;

      expect(wrapper.findDateAt(1, 6).getElement()).not.toHaveAttribute('aria-describedby');
    });

    test('has no aria-describedby without disabledReason', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
        />
      );
      const wrapper = createWrapper(container).findCalendar()!;

      expect(wrapper.findDateAt(1, 6).getElement()).not.toHaveAttribute('aria-describedby');
    });

    test('has aria-describedby with disabledReason', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );

      const wrapper = createWrapper(container).findCalendar()!;

      expect(wrapper.findDateAt(1, 6).getElement()).toHaveAttribute('aria-describedby');
    });

    test('has hidden element (linked to aria-describedby) with disabledReason', () => {
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-03"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
        />
      );

      const wrapper = createWrapper(container).findCalendar()!;

      expect(wrapper.findDateAt(1, 6).find('span[hidden]')!.getElement()).toHaveTextContent('Disabled on Saturdays');
    });

    test('space keydown does not trigger onChange when disabled with reason', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-01"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
          onChange={onChange}
        />
      );

      const wrapper = createWrapper(container).findCalendar()!;

      wrapper.findDateAt(1, 6).focus();
      fireEvent.keyDown(wrapper.findDateAt(1, 6).getElement(), { keyCode: KeyCode.space });

      expect(onChange).not.toHaveBeenCalled();
    });

    test('enter keydown does not trigger onChange when disabled with reason', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Calendar
          {...defaultProps}
          value="2022-01-01"
          isDateEnabled={(date: Date) => date.getDay() !== 6 && date.getDay() !== 0}
          dateDisabledReason={(date: Date) => {
            if (date.getDay() === 6) {
              return 'Disabled on Saturdays';
            }

            if (date.getDay() === 0) {
              return 'Disabled on Sundays';
            }

            return '';
          }}
          onChange={onChange}
        />
      );

      const wrapper = createWrapper(container).findCalendar()!;

      wrapper.findDateAt(1, 6).focus();
      fireEvent.keyDown(wrapper.findDateAt(1, 6).getElement(), { keyCode: KeyCode.enter });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

describe('current date', () => {
  beforeEach(() => {
    MockDate.set(new Date(2022, 0, 5));
    jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => localeDE);
  });
  afterEach(() => {
    MockDate.reset();
    jest.restoreAllMocks();
  });

  test('aria-disabled is set for all disabled dates', () => {
    const { container } = render(
      <Calendar {...defaultProps} value="2022-01-07" isDateEnabled={date => date.getDay() !== 4} />
    );
    const wrapper = createWrapper(container).findCalendar()!;
    const currentDateRow = 2;
    const currentDateCol = 3;

    expect(getDayText(wrapper, currentDateRow, currentDateCol)).toBe('5');
    expect(wrapper.findDateAt(currentDateRow, currentDateCol).getElement()).toHaveAttribute('aria-current', 'date');

    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 7; col++) {
        if (row !== currentDateRow || col !== currentDateCol) {
          expect(wrapper.findDateAt(row, col).getElement()).not.toHaveAttribute('aria-current');
        }
      }
    }
  });
});

describe('test API', () => {
  test('findPreviousMonthButton (deprecated) returns the same element as findPreviousButton', () => {
    const { wrapper } = renderCalendar();
    const previousButton = wrapper.findPreviousButton().getElement();
    const previousMonthButton = wrapper.findPreviousMonthButton().getElement();
    expect(previousButton).toBeTruthy();
    expect(previousMonthButton).toBe(previousButton);
  });

  test('findNextMonthButton (deprecated) returns the same element as findNextButton', () => {
    const { wrapper } = renderCalendar();
    const nextButton = wrapper.findNextButton().getElement();
    const nextMonthButton = wrapper.findNextMonthButton().getElement();
    expect(nextButton).toBeTruthy();
    expect(nextMonthButton).toBe(nextButton);
  });
});
