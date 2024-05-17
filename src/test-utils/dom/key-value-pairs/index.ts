// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../key-value-pairs/styles.selectors.js';
import BoxWrapper from '../box';

export default class KeyValuePairWrapper extends ComponentWrapper {
  static rootSelector: string = styles['key-value-pairs'];

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findColumns(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.column);
  }

  findTitle(): BoxWrapper | null {
    return this.findComponent(`.${BoxWrapper.rootSelector}`, BoxWrapper);
  }

  findKey(): ElementWrapper | null {
    return this.findByClassName(styles['key-label']);
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }
}
