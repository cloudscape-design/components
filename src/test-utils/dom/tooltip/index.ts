// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import popoverStyles from '../../../popover/styles.selectors.js';
import styles from '../../../tooltip/test-classes/styles.selectors.js';

export default class TooltipWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the tooltip content element.
   * Searches within this tooltip's scope to avoid conflicts with popovers.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.content);
  }
}
