// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import testUtilStyles from '../../../internal/components/control-group/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  // Root at the group root, which the component always renders (the inline-label wrapper only
  // exists when a label is set). This keeps the wrapper usable for both labeled and unlabeled
  // groups; `findControls` searches its descendants and `findInlineLabel` walks up to the label.
  static rootSelector: string = testUtilStyles.root;

  /**
   * Returns the individual fused controls. The direct-child selector excludes the hidden
   * measurement duplicate, whose controls are nested under the ghost.
   */
  findControls(): Array<ElementWrapper> {
    return this.findAll(`:scope > .${testUtilStyles.control}`);
  }

  /**
   * Returns the visible inline label element, or null if no label is set.
   *
   * The label is a sibling of an ancestor of the group root
   * (inline-label-wrapper > label + inline-label-trigger-wrapper > group), so a root-anchored
   * descendant search cannot reach it. We instead walk up the DOM to the inline-label wrapper and
   * find the label inside it; when no wrapper exists (unlabeled group) there is no label. This
   * upward walk is DOM-only (`@usesDom`), so it is omitted from the selectors wrapper, where CSS
   * selectors cannot express an ancestor lookup.
   */
  @usesDom
  findInlineLabel(): ElementWrapper | null {
    const wrapper = this.getElement().closest(`.${testUtilStyles['inline-label-wrapper']}`);
    return wrapper ? createWrapper(wrapper).findByClassName(testUtilStyles['inline-label']) : null;
  }
}
