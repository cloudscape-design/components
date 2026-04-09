// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../action-card/styles.selectors.js';
import testStyles from '../../../action-card/test-classes/styles.selectors.js';

export default class ActionCardWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  /**
   * Returns the header element of the action card.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(testStyles.header);
  }

  /**
   * Returns the description element of the action card.
   */
  findDescription(): ElementWrapper | null {
    return this.findByClassName(testStyles.description);
  }

  /**
   * Returns the content element of the action card.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(testStyles.body);
  }

  /**
   * Finds the icon slot of the action card.
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(testStyles.icon);
  }
  /**
   * Returns whether the action card is disabled.
   */
  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(testStyles.disabled);
  }
}
