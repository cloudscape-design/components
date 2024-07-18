// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import inputSelectors from '../../../input/styles.selectors.js';
import BaseInputWrapper from './base-input';

export default class InputWrapper extends BaseInputWrapper {
  static rootSelector: string = inputSelectors.root;

  findClearButton(): ElementWrapper | null {
    return this.find(`.${inputSelectors['input-button-right']}`);
  }
}
