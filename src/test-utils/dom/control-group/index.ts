// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../control-group/styles.selectors.js';
import testUtilStyles from '../../../control-group/test-classes/styles.selectors.js';
import formFieldTestStyles from '../../../form-field/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = testUtilStyles['control-group'];

  /**
   * Finds all control slots (one per child control) in DOM order.
   */
  findControls(): Array<ElementWrapper> {
    return this.findAllByClassName(testUtilStyles['control-group-item']);
  }

  /**
   * Finds the group-level error message text, if present.
   */
  findError(): ElementWrapper | null {
    return this.find(`.${styles.hints} .${formFieldTestStyles.error} .${formFieldTestStyles.error__message}`);
  }

  /**
   * Finds the group-level warning message text, if present.
   */
  findWarning(): ElementWrapper | null {
    return this.find(`.${styles.hints} .${formFieldTestStyles.warning} .${formFieldTestStyles.warning__message}`);
  }

  /**
   * Finds the group-level description, if present.
   */
  findDescription(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles.description);
  }
}
