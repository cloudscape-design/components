// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/control-group/styles.selectors.js';

export default class ControlGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles['inline-label-wrapper'];

  /**
   * Returns the visible inline label element, or null if no label is set.
   */
  findInlineLabel(): ElementWrapper | null {
    return this.findByClassName(styles['inline-label']);
  }
}
