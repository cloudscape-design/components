// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../calendar/styles.selectors.js';
import ButtonWrapper from '../button';

export default class CalendarWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  /**
   * Returns a day container on the calendar.
   *
   * @param row 1-based row index of the day.
   * @param column 1-based column index of the day.
   */
  findDateAt(row: number, column: number): ElementWrapper {
    return this.find(`.${styles['calendar-week']}:nth-child(${row}) .${styles['calendar-day']}:nth-child(${column})`)!;
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

  findSelectedDate(): ElementWrapper {
    return this.find(`.${styles['calendar-day-selected']}`)!;
  }
}
