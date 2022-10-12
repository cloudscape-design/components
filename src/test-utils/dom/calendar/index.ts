// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../calendar/styles.selectors.js';
import ButtonWrapper from '../button';

export class CalendarDayWrapper extends ComponentWrapper {
  static rootSelector: string = styles['calendar-day'];

  findLabel(): ElementWrapper {
    return this.find(`:not(.${styles['visually-hidden']})`)!;
  }
}

export default class CalendarWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  /**
   * Returns a day container on the calendar.
   *
   * @param row 1-based row index of the day.
   * @param column 1-based column index of the day.
   */
  findDateAt(row: number, column: number): CalendarDayWrapper {
    return this.findComponent(
      `.${styles['calendar-week']}:nth-child(${row}) .${CalendarDayWrapper.rootSelector}:nth-child(${column})`,
      CalendarDayWrapper
    )!;
  }

  findHeader(): ElementWrapper {
    return this.findByClassName(styles['calendar-header'])!;
  }

  findPreviousMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-prev-month-btn']}`, ButtonWrapper)!;
  }

  findNextMonthButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-next-month-btn']}`, ButtonWrapper)!;
  }

  findSelectedDate(): CalendarDayWrapper {
    return this.findComponent(`.${styles['calendar-day-selected']}`, CalendarDayWrapper)!;
  }
}
