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

export class KeyValuePairsItemWrapper extends ComponentWrapper {
  findGroupTitle(): ElementWrapper | null {
    return this.findComponent(`.${BoxWrapper.rootSelector}`, ElementWrapper);
  }

  findGroupPairs(): Array<KeyValuePairsPairWrapper> | null {
    return this.findByClassName(styles.list)!
      .findAllByClassName(styles.pair)
      .map(i => new KeyValuePairsPairWrapper(i.getElement()));
  }

  findPair(): KeyValuePairsPairWrapper | null {
    const element = this.findByClassName(styles.pair)!.getElement();
    return element ? new KeyValuePairsPairWrapper(element) : null;
  }
}

export default class KeyValuePairsWrapper extends ComponentWrapper {
  static rootSelector: string = styles['key-value-pairs'];

  findItems(): Array<KeyValuePairsItemWrapper> {
    return this.findAllByClassName(styles.item).map(i => new KeyValuePairsItemWrapper(i.getElement()));
  }
}
