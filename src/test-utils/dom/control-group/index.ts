// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import styles from '../../../control-group/styles.selectors.js';
import testUtilStyles from '../../../control-group/test-classes/styles.selectors.js';
import formFieldTestStyles from '../../../form-field/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = testUtilStyles['control-group'];

  /**
   * Finds all control slots (one per child control) in DOM order.
   */
  findControls(): Array<ElementWrapper> {
    // Scope to the visible group (role="group"); the hidden measurement ghost renders a
    // duplicate set of slots that must not be reported.
    return this.findAll(`[role="group"] .${testUtilStyles['control-group-item']}`);
  }

  /**
   * Finds the group-level error message text, if present.
   */
  findError(): ElementWrapper | null {
    return this.find(`.${styles.hints} .${formFieldTestStyles.error} .${formFieldTestStyles['error-message']}`);
  }

  /**
   * Finds the group-level warning message text, if present.
   */
  findWarning(): ElementWrapper | null {
    return this.find(`.${styles.hints} .${formFieldTestStyles.warning} .${formFieldTestStyles['warning-message']}`);
  }

  /**
   * Finds the group-level description, if present.
   */
  findDescription(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles.description);
  }

  /**
   * Finds the remove button rendered when the `dismissible` prop is set, if present.
   */
  findDismissButton(): ButtonWrapper | null {
    // Scope to the visible group; the hidden measurement ghost renders a duplicate.
    return this.findComponent(`[role="group"] .${testUtilStyles['dismiss-button']}`, ButtonWrapper);
  }
}
