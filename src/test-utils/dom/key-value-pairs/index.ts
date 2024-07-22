// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import BoxWrapper from '../box';

import columnLayoutStyles from '../../../column-layout/flexible-column-layout/styles.selectors.js';
import styles from '../../../key-value-pairs/styles.selectors.js';

export class KeyValuePairsPairWrapper extends ComponentWrapper {
  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles['key-label']);
  }

  findValue(): ElementWrapper | null {
    return this.findByClassName(styles.detail);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }
}

export class KeyValuePairsItemWrapper extends KeyValuePairsPairWrapper {
  findGroupTitle(): ElementWrapper | null {
    return this.findComponent(`.${BoxWrapper.rootSelector}`, ElementWrapper);
  }

  findGroupPairs(): Array<KeyValuePairsPairWrapper> | null {
    return this.findAllByClassName(styles['group-list-item']).map(i => new KeyValuePairsPairWrapper(i.getElement()));
  }
}

export default class KeyValuePairsWrapper extends ComponentWrapper {
  static rootSelector: string = styles['key-value-pairs'];

  findItems(): Array<KeyValuePairsItemWrapper> {
    return this.findAllByClassName(columnLayoutStyles.item).map(i => new KeyValuePairsItemWrapper(i.getElement()));
  }
}
