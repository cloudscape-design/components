// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../avatar/styles.selectors.js';
import popoverStyles from '../../../popover/styles.selectors.js';
import createWrapper from '../index.js';

export default class AvatarWrapper extends ComponentWrapper<HTMLSpanElement> {
  static rootSelector: string = styles.root;

  findAvatarBody(): ElementWrapper<HTMLDivElement> {
    return this.findByClassName(styles.avatar)!;
  }

  findTooltip(): null | ElementWrapper {
    return createWrapper().findByClassName(popoverStyles.content);
  }
}
