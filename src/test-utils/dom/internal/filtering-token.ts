// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import SelectWrapper from '../select';
import styles from '../../../internal/components/filtering-token/styles.selectors.js';

export default class FilteringTokenWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findLabel(): ElementWrapper {
    return this.find(`.${styles['token-content']}.${styles.parent}`)!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.find<HTMLButtonElement>(`.${styles['dismiss-button']}.${styles.parent}`)!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${styles.select}.${styles.parent}`, SelectWrapper);
  }

  findGroupTokens(): Array<FilteringGroupedTokenWrapper> {
    return this.findAll(`.${styles.container}`).map(w => new FilteringGroupedTokenWrapper(w.getElement()));
  }
}

export class FilteringGroupedTokenWrapper extends ComponentWrapper {
  static rootSelector = styles.container;

  findLabel(): ElementWrapper {
    return this.find(`.${styles['token-content']}`)!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.find<HTMLButtonElement>(`.${styles['dismiss-button']}`)!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${styles.select}`, SelectWrapper);
  }
}
