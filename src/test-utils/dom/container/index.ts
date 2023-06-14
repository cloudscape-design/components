// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../container/styles.selectors.js';

export default class ContainerWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }
}
