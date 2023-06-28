// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../button/styles.selectors.js';
import spinnerStyles from '../../../spinner/styles.selectors.js';

export default class ButtonWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = styles.button;

  findLoadingIndicator(): ElementWrapper | null {
    return this.find(`.${styles['icon-left']}.${spinnerStyles.root}`);
  }

  findTextRegion(): ElementWrapper | null {
    return this.find(`.${styles.content}`);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }
}
