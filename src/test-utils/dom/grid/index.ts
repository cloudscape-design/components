// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils.js';

import styles from '../../../grid/styles.selectors.js';

export default class GridWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.grid;

  /**
   * Returns a column from the grid for a given index.
   * @param columnIndex 1-based index of the column to return.
   */
  findColumn(columnIndex: number): ElementWrapper<HTMLDivElement> | null {
    return this.find(`.${styles['grid-column']}:nth-child(${columnIndex}) > div`);
  }

  /**
   * Returns the wrapper of the first column that matches the specified test ID.
   * Looks for the `data-testid` attribute that is assigned via `gridDefinition` prop.
   * If no matching column is found, returns `null`.
   *
   * @param {string} testId
   * @returns {HTMLDivElement | null}
   */
  findColumnByTestId(testId: string): ElementWrapper<HTMLDivElement> | null {
    const escapedTestId = escapeSelector(testId);
    return this.find(`.${styles['grid-column']}[data-testid="${escapedTestId}"] > div`);
  }
}
