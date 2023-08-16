// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../flashbar/styles.selectors.js';
import ButtonWrapper from '../button';

export default class FlashWrapper extends ComponentWrapper {
  static rootSelector: string = styles['flash-list-item'];

  /**
   * Returns the dismiss button.
   *
   * The dismiss button is only rendered when the `dismissible` property is set to `true`.
   */
  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['dismiss-button']}`, ButtonWrapper);
  }

  /**
   * Returns the action slot.
   */
  findAction(): ElementWrapper | null {
    return this.findByClassName(styles['action-slot']);
  }

  /**
   * Returns the action button.
   *
   * The action button is only rendered when the `buttonText` property is set.
   */
  findActionButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['action-button']}`, ButtonWrapper);
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles['flash-header']);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['flash-content']);
  }
}
