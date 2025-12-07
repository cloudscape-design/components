// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import createWrapper from '../index.js';

import popoverStyles from '../../../popover/styles.selectors.js';
import tooltipStyles from '../../../tooltip/styles.selectors.js';

export default class TooltipWrapper extends ComponentWrapper {
  static rootSelector: string = tooltipStyles.root;

  /**
   * Returns the tooltip content element.
   * Since tooltips are rendered through a Portal, this searches from document root.
   */
  findContent(): ElementWrapper {
    return createWrapper().findByClassName(popoverStyles.content)!;
  }
}
