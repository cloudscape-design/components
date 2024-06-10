// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import selectStyles from '../../../select/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';
import inputStyles from '../../../input/styles.selectors.js';
import buttonTriggerStyles from '../../../internal/components/button-trigger/styles.selectors.js';
import dropdownStatusStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import footerStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import InputWrapper from '../input';
import DropdownHostComponentWrapper from '../internal/dropdown-host';

export default class SelectWrapper extends DropdownHostComponentWrapper {
  static rootSelector: string = selectStyles.root;

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findErrorRecoveryButton(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findByClassName(footerStyles.recovery);
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findStatusIndicator(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findByClassName(dropdownStatusStyles.root);
  }

  /**
   * Returns the input that is used for filtering.
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findFilteringInput(options = { expandToViewport: false }): InputWrapper | null {
    return this.findDropdown(options).findComponent(`.${inputStyles['input-container']}`, InputWrapper);
  }

  findPlaceholder(): ElementWrapper | null {
    return this.findByClassName(selectPartsStyles.placeholder);
  }

  findTrigger(): ElementWrapper {
    return this.findByClassName(buttonTriggerStyles['button-trigger'])!;
  }

  @usesDom
  isDisabled(): boolean {
    return (this.findTrigger().getElement() as HTMLButtonElement).disabled;
  }
}
