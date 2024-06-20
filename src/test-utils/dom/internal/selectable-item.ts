// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../internal/components/selectable-item/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';

export default class SelectableItemWrapper extends ComponentWrapper {
  static rootSelector: string = styles['selectable-item'];

  findDisabledReason(): ElementWrapper | null {
    return this.find(`.${selectPartsStyles['disabled-reason-tooltip']}`);
  }

  findDisabledReasonDescription(): ElementWrapper | null {
    return this.find('span[hidden]');
  }
}
