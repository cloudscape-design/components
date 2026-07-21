// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import BaseInputWrapper from './base-input';

import inputSelectors from '../../../input/styles.selectors.js';

export default class InputWrapper extends BaseInputWrapper {
  static rootSelector: string = inputSelectors.root;

  findClearButton(): ElementWrapper | null {
    return this.find(`.${inputSelectors['input-button-right']}`);
  }

  /**
   * Returns the prefix adornment element, or null if no prefix is set.
   * @example
   * expect(wrapper.findPrefix()?.getElement().textContent).toBe('$');
   * @see {@link findSuffix}
   */
  findPrefix(): ElementWrapper | null {
    return this.find(`.${inputSelectors['input-prefix']}`);
  }

  /**
   * Returns the suffix adornment element, or null if no suffix is set.
   * @example
   * expect(wrapper.findSuffix()?.getElement().textContent).toBe('%');
   * @see {@link findPrefix}
   */
  findSuffix(): ElementWrapper | null {
    return this.find(`.${inputSelectors['input-suffix']}`);
  }
}
