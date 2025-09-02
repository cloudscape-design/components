// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import buttonTestUtilsStyles from '../../../button/test-classes/styles.selectors.js';
import spinnerStyles from '../../../spinner/styles.selectors.js';

export default class ButtonWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = buttonTestUtilsStyles.button;

  findLoadingIndicator(): ElementWrapper | null {
    return this.find(`.${buttonTestUtilsStyles['icon-left']}.${spinnerStyles.root}`);
  }

  findTextRegion(): ElementWrapper | null {
    return this.find(`.${buttonTestUtilsStyles.content}`);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.disabled || this.element.getAttribute('aria-disabled') === 'true';
  }

  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${buttonTestUtilsStyles['disabled-reason-tooltip']}`);
  }
}
