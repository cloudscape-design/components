// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import structuredItemStyles from '../../../internal/components/structured-item/test-classes/styles.selectors.js';
import styles from '../../../item-card/styles.selectors.js';
import testStyles from '../../../item-card/test-classes/styles.selectors.js';

export default class ItemCardWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  /**
   * Finds the action slot of the item card.
   */
  findActions(): ElementWrapper | null {
    return this.findByClassName(structuredItemStyles.actions);
  }

  /**
   * Finds the content slot of the item card.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.body);
  }

  /**
   * Finds the description slot of the item card.
   */
  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * Finds the header slot of the item card.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles['header-inner']);
  }

  /**
   * Finds the footer slot of the item card.
   */
  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }

  /**
   * Finds the icon slot of the item card.
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(testStyles.icon);
  }
}
