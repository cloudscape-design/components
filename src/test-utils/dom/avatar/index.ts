// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../avatar/styles.selectors.js';
import createWrapper from '../index.js';
import tooltipStyles from '../../../internal/components/tooltip/styles.selectors.js';

export default class AvatarWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  findTooltip(): null | ElementWrapper {
    // To be updated once tooltip is made public and avatar is moved to the new repository
    return createWrapper().findByClassName(tooltipStyles.root);
  }
}
