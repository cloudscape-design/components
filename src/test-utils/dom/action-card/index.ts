// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../action-card/styles.selectors.js';

export default class ActionCardWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = styles.root;

  /**
   * Returns the header element of the action card.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  /**
   * Returns the description element of the action card.
   */
  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * Returns the content element of the action card.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * Returns the icon element of the action card.
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(styles.icon);
  }

  /**
   * Returns whether the action card is disabled.
   */
  @usesDom
  isDisabled(): boolean {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }
}
