// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import testUtilStyles from '../../../internal/components/control-group/test-classes/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  /**
   * Returns the individual fused controls. The direct-child selector excludes the hidden
   * measurement duplicate, whose controls are nested under the ghost.
   */
  findControls(): Array<ElementWrapper> {
    return this.findAll(`:scope > .${testUtilStyles.control}`);
  }
}
