// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';

import TileWrapper from './tile';

import styles from '../../../tiles/styles.selectors.js';

export default class TilesWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findItems(): Array<TileWrapper> {
    return this.findAllByClassName(styles['tile-container']).map(r => new TileWrapper(r.getElement()));
  }

  findInputByValue(value: string): ElementWrapper<HTMLInputElement> | null {
    const safeValue = escapeSelector(value);
    return this.find(`input[value="${safeValue}"]`);
  }

  findItemByValue(value: string): TileWrapper | null {
    const toReplace = escapeSelector(value);
    return this.findComponent(`.${TileWrapper.rootSelector}[data-value="${toReplace}"]`, TileWrapper);
  }
}
