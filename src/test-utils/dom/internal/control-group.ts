// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/control-group/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the individual fused controls.
   */
  findControls(): Array<ElementWrapper> {
    return this.findAll(`:scope > .${styles.control}`);
  }
}
