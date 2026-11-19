// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import styles from '../../../calendar/styles.selectors.js';

export class CalendarDateWrapper extends ComponentWrapper {
  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${styles['disabled-reason-tooltip']}`);
  }
}

export default class CalendarWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  /**
   * Returns a date container on the calendar.
   *
   * @param row 1-based row index of the day or month.
   * @param column 1-based column index of the day or month.
   */
  findDateAt(row: number, column: number): CalendarDateWrapper {
    return this.findComponent(
      `.${styles['calendar-row']}:nth-child(${row}) .${styles['calendar-date']}:nth-child(${column})`,
      CalendarDateWrapper
    )!;
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
