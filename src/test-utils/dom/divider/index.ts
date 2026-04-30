// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../divider/styles.selectors.js';

export default class DividerWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.divider;

  /** Returns the label element, or `null` if no label is set. */
  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles['divider-label']);
  }
}
