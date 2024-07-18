// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import AttributeEditorWrapper, { AttributeEditorRowWrapper } from '../attribute-editor';
import LinkWrapper from '../link';

import attributeEditorStyles from '../../../attribute-editor/styles.selectors.js';
import styles from '../../../tag-editor/styles.selectors.js';

export class TagEditorRowWrapper extends AttributeEditorRowWrapper {
  findUndoButton(): LinkWrapper | null {
    return this.findComponent(`.${styles['undo-button']}`, LinkWrapper);
  }
}

export default class TagEditorWrapper extends AttributeEditorWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns a row for a given index.
   *
   * @param row 1-based row index
   */
  findRow(row: number): TagEditorRowWrapper | null {
    return this.findComponent(`.${attributeEditorStyles.row}:nth-child(${row})`, TagEditorRowWrapper);
  }

  /**
   * Returns all rows.
   *
   * To find a specific row use the `findRow(n)` function as chaining `findRows().get(n)` can return unexpected results.
   * @see findRow
   */
  findRows(): Array<TagEditorRowWrapper> {
    return this.findAllByClassName(attributeEditorStyles.row).map(i => new TagEditorRowWrapper(i.getElement()));
  }

  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }
}
