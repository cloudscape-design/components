// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../drawer/styles.selectors.js';

export default class DrawerWrapper extends ComponentWrapper {
  static rootSelector: string = styles.drawer;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['test-utils-drawer-content']);
  }
}
