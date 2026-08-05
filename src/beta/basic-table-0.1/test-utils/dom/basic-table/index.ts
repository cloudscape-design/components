// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../basic-table/styles.selectors.js';

export default class BasicTableWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  // The column headers (`<th>`), in visual column order.
  findColumnHeaders(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['header-cell']);
  }

  // The header row (`<tr>` inside the header rowgroup).
  findHeaderRow(): ElementWrapper | null {
    return this.findByClassName(styles['header-row']);
  }

  // The body rows (`<tr>`), excluding the loading/empty state row.
  findRows(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.row);
  }

  // The body row at the given zero-based index, or null when out of range.
  findRowByIndex(index: number): ElementWrapper | null {
    return this.findRows()[index] ?? null;
  }

  // The loading status text shown while the table is loading.
  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }
}
