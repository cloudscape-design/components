// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import styles from '../../../dialog/styles.selectors.js';
import testStyles from '../../../dialog/test-classes/styles.selectors.js';

export default class DialogWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  /**
   * Finds the header slot of the dialog.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(testStyles.header);
  }

  /**
   * Finds the header actions slot of the dialog.
   */
  findHeaderActions(): ElementWrapper | null {
    return this.findByClassName(testStyles['header-actions']);
  }

  /**
   * Finds the header actions slot of the dialog.
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
   * Finds the dismiss button of the dialog.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${testStyles['dismiss-button']}`, ButtonWrapper);
  }
}
