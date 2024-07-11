// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import SelectWrapper from '../select';
import styles from '../../../internal/components/filtering-token/styles.selectors.js';

export default class FilteringTokenWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles['token-content'])!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['dismiss-button'])!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${styles.select}`, SelectWrapper);
  }

  findGroupTokens(): Array<FilteringGroupedTokenWrapper> {
    return this.findAllByClassName(styles['inner-root']).map(w => new FilteringGroupedTokenWrapper(w.getElement()));
  }
}

export class FilteringGroupedTokenWrapper extends ComponentWrapper {
  static rootSelector = styles['inner-root'];

  findLabel(): ElementWrapper {
    return this.findByClassName(styles['inner-token-content'])!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['inner-dismiss-button'])!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${styles['inner-select']}`, SelectWrapper);
  }
}
