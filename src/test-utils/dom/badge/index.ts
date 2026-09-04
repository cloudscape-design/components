// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import IconWrapper from '../icon';

import styles from '../../../badge/styles.selectors.js';
import testUtilStyles from '../../../badge/test-classes/styles.selectors.js';

export default class BadgeWrapper extends ComponentWrapper<HTMLSpanElement> {
  static rootSelector: string = styles.badge;

  findIcon(): IconWrapper | null {
    return this.findComponent(`.${testUtilStyles.icon}`, IconWrapper);
  }

  findContent(): ElementWrapper | null {
    return this.find(`.${testUtilStyles.content}`);
  }
}
