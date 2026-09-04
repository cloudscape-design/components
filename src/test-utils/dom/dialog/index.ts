// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import styles from '../../../dialog/styles.selectors.js';
import testStyles from '../../../dialog/test-classes/styles.selectors.js';

export default class DialogWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  /**
   * Finds the dialog heading. This element is also the dialog's accessible name
   * (referenced by the `role="dialog"` element via `aria-labelledby`).
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(testStyles.header);
  }

  /**
   * Finds the content slot of the dialog.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(testStyles.content);
  }

  /**
   * Finds the footer slot of the dialog.
   */
  findFooter(): ElementWrapper | null {
    return this.findByClassName(testStyles.footer);
  }

  /**
   * Finds the dismiss (close) button, which is always present.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${testStyles['dismiss-button']}`, ButtonWrapper);
  }
}
