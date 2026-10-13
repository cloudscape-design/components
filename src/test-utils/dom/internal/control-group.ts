// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import componentStyles from '../../../internal/components/control-group/styles.selectors.js';
import testUtilStyles from '../../../internal/components/control-group/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  /**
   * Returns the individual fused controls. The wrapper root may be either the group element or
   * the outer inline-label wrapper (when an inline label is set), so controls are matched
   * anywhere beneath the root. The hidden measurement ghost duplicates the controls, so the
   * ghost's copies (nested under the ghost element from the component stylesheet) are excluded.
   */
  findControls(): Array<ElementWrapper> {
    return this.findAll(`.${testUtilStyles.control}:not(.${componentStyles.ghost} .${testUtilStyles.control})`);
  }

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
