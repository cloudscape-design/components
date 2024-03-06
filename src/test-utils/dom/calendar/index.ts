// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../calendar/styles.selectors.js';
import ButtonWrapper from '../button';

export default class CalendarWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  /**
   * Returns a date container on the calendar.
   *
   * @param row 1-based row index of the day or month.
   * @param column 1-based column index of the day or month.
   */
  findDateAt(row: number, column: number): ElementWrapper {
    return this.find(`.${styles['calendar-row']}:nth-child(${row}) .${styles['calendar-date']}:nth-child(${column})`)!;
  }

  findHeader(): ElementWrapper {
    return this.findByClassName(styles['calendar-header'])!;
  }

  /**
   * Alias for findPreviousButton for compatibility with previous versions
   * @deprecated
   */
  findPreviousMonthButton(): ButtonWrapper {
    return this.findPreviousButton();
  }

  /**
   * Alias for findNextButton for compatibility with previous versions
   * @deprecated
   */
  findNextMonthButton(): ButtonWrapper {
    return this.findNextButton();
  }

  findPreviousButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-prev-btn']}`, ButtonWrapper)!;
  }

  findNextButton(): ButtonWrapper {
    return this.findComponent(`.${styles['calendar-next-btn']}`, ButtonWrapper)!;
  }

  findSelectedDate(): ElementWrapper {
    return this.find(`.${styles['calendar-date-selected']}`)!;
  }
}
