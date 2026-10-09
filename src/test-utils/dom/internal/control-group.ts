// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import testUtilStyles from '../../../internal/components/control-group/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  /**
   * Returns the visible inline label element, or null if no label is set.
   */
  findInlineLabel(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles['inline-label']);
  }

  /**
   * Returns the action button, or null if no action is set.
   */
  findActionButton(): ButtonWrapper | null {
    return this.findComponent(`.${testUtilStyles['action-button']}`, ButtonWrapper);
  }
}
