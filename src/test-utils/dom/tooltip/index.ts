// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import createWrapper from '../index.js';

import popoverStyles from '../../../popover/styles.selectors.js';
import styles from '../../../tooltip/styles.selectors.js';

export default class TooltipWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the tooltip content element.
   * Searches within this tooltip's scope to avoid conflicts with popovers.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(popoverStyles.content);
  }

  /**
   * Returns the tooltip element by its trackKey (data-testid attribute).
   * Useful when multiple tooltips are rendered and you need to find a specific one.
   *
   * @param trackKey - The trackKey value used when creating the tooltip
   */
  static findByTrackKey(trackKey: string): TooltipWrapper | null {
    const element = createWrapper().find(`[data-testid="${trackKey}"]`);
    return element ? new TooltipWrapper(element.getElement()) : null;
  }
}
