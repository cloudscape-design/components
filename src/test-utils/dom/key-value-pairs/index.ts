// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../key-value-pairs/styles.selectors.js';
import BoxWrapper from '../box';

export class KeyValuePairsPairWrapper extends ComponentWrapper {
  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles['key-label']);
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }
}

export class KeyValuePairsColumnWrapper extends ComponentWrapper {
  findTitle(): BoxWrapper | null {
    return this.findComponent(`.${BoxWrapper.rootSelector}`, BoxWrapper);
  }

  findPairs(): Array<KeyValuePairsPairWrapper> {
    return this.findAllByClassName(styles.item).map(i => new KeyValuePairsPairWrapper(i.getElement()));
  }
}

export default class KeyValuePairsWrapper extends ComponentWrapper {
  static rootSelector: string = styles['key-value-pairs'];

  findColumns(): Array<KeyValuePairsColumnWrapper> {
    return this.findAllByClassName(styles.column).map(i => new KeyValuePairsColumnWrapper(i.getElement()));
  }
}
