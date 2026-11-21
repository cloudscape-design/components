// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../comparison-table/styles.selectors.js';
import tableStyles from '../../../table/styles.selectors.js';

export default class ComparisonTableWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.root;

  /** Returns all attribute (row header) label elements. */
  findAttributeLabels(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['attribute-label']);
  }

  /** Returns all cells that are highlighted because their attribute row differs across entities. */
  findHighlightedCells(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['cell-highlighted']);
  }

  /** Returns all rendered rows of the underlying table (one per attribute). */
  findRows(): Array<ElementWrapper> {
    return this.findAllByClassName(tableStyles.row);
  }
}
