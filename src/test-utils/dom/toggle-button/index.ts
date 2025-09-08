// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import buttonStyles from '../../../button/styles.selectors.js';
import styles from '../../../toggle-button/styles.selectors.js';

export default class ToggleButtonWrapper extends ButtonWrapper {
  static rootSelector: string = buttonStyles.button;

  @usesDom
  isPressed(): boolean {
    return this.element.classList.contains(styles.pressed);
  }
}
