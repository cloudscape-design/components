// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import styles from '../../../internal/components/chart-popover/styles.selectors.js';
import testClasses from '../../../internal/components/chart-popover/test-classes/styles.selectors.js';
import popoverStyles from '../../../popover/styles.selectors.js';

export default class ChartTooltipWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(testClasses.header);
  }

  findBody(): ElementWrapper | null {
    return this.findByClassName(testClasses.body);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(testClasses.footer);
  }

  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${popoverStyles['dismiss-control']}`, ButtonWrapper);
  }
}
