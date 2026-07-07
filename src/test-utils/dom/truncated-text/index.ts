// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper } from '@cloudscape-design/test-utils-core/dom';

import TooltipWrapper from '../tooltip';

import tooltipTestUtilsStyles from '../../../tooltip/test-classes/styles.selectors.js';
import styles from '../../../truncated-text/test-classes/styles.selectors.js';

export default class TruncatedTextWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.root;

  findTooltip(): TooltipWrapper | null {
    const tooltipElement = createWrapper().findByClassName(tooltipTestUtilsStyles.root);
    return tooltipElement && new TooltipWrapper(tooltipElement.getElement());
  }
}
