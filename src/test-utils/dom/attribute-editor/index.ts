// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import FormFieldWrapper from '../form-field';

import styles from '../../../attribute-editor/styles.selectors.js';
import gridstyles from '../../../grid/styles.selectors.js';

export class AttributeEditorRowWrapper extends ElementWrapper {
  /**
   * Returns all fields. Fields are supplied in the `definition` property of the component.
   */
  findFields(): Array<FormFieldWrapper> {
    return this.findAllByClassName(styles.field).map(f => new FormFieldWrapper(f.getElement()));
  }

  /**
   * Returns a field for a given index
   *
   * @param column 1-based column index
   */
  findField(column: number): FormFieldWrapper | null {
    return this.findComponent(
      `.${styles['row-control']} > .${gridstyles.grid} > .${gridstyles['grid-column']}:nth-child(${column}) > div > .${styles.field}`,
      FormFieldWrapper
    );
  }

  findRemoveButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['remove-button']}`, ButtonWrapper);
  }
}

export default class AttributeEditorWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }

  /**
   * Returns a row for a given index.
   *
   * @param row 1-based row index
   */
  findRow(row: number): AttributeEditorRowWrapper | null {
    return this.findComponent(`.${styles.row}:nth-child(${row})`, AttributeEditorRowWrapper);
  }

  /**
   * Returns all rows.
   *
   * To find a specific row use the `findRow(n)` function as chaining `findRows().get(n)` can return unexpected results.
   * @see findRow
   */
  findRows(): Array<AttributeEditorRowWrapper> {
    return this.findAllByClassName(styles.row).map(i => new AttributeEditorRowWrapper(i.getElement()));
  }

  findAddButton(): ButtonWrapper {
    return this.findComponent(`.${styles['add-button']}`, ButtonWrapper)!;
  }

  findAdditionalInfo(): ElementWrapper | null {
    return this.findByClassName(styles['additional-info']);
  }
}
