// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../toggle/styles.selectors.js';
import AbstractSwitchWrapper from '../internal/abstract-switch';

export default class ToggleWrapper extends ComponentWrapper {
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
