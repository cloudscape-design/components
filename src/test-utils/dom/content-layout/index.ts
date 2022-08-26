// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../content-layout/styles.selectors.js';

export default class ContentLayoutWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.layout;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }
}
