// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import AbstractSwitchWrapper from '../internal/abstract-switch';

import styles from '../../../checkbox/styles.selectors.js';

export default class CheckboxWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  private findAbstractSwitch(): AbstractSwitchWrapper {
    return new AbstractSwitchWrapper(this.getElement());
  }

  findLabel(): ElementWrapper {
    return this.findAbstractSwitch().findLabel();
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findAbstractSwitch().findNativeInput();
  }

  findDescription(): ElementWrapper | null {
    return this.findAbstractSwitch().findDescription();
  }
}
