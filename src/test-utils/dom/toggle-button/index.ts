// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import testStyles from '../../../toggle-button/test-classes/styles.selectors.js';

export default class ToggleButtonWrapper extends ButtonWrapper {
  static rootSelector: string = testStyles.root;

  @usesDom
  isPressed(): boolean {
    return this.element.classList.contains(testStyles.pressed);
  }
}
