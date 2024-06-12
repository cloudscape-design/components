// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../progress-bar/styles.selectors.js';
import ButtonWrapper from '../button';

export default class ProgressBarWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findPercentageText(): ElementWrapper | null {
    return this.findByClassName(styles.percentage);
  }

  findResultButton(): ButtonWrapper | null {
    return this.findByClassName(styles['result-button'])?.findButton() || null;
  }

  /**
   * Returns the result text.
   *
   * @param status
   *
   * [optional] Status of the result text. It can be aither "error" or "succes".
   * If not specified, the method returns the result text that is currently displayed, independently of the result status.
   */
  findResultText(status?: string): ElementWrapper | null {
    const statusClassName = status ? `.${styles[`result-container-${status}`]} ` : '';
    return this.find(`${statusClassName}.${styles['result-text']}`);
  }

  findAdditionalInfo(): ElementWrapper | null {
    return this.findByClassName(styles['additional-info']);
  }
}
