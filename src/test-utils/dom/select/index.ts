// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import InputWrapper from '../input';
import DropdownHostComponentWrapper from '../internal/dropdown-host';

import inputStyles from '../../../input/styles.selectors.js';
import buttonTriggerStyles from '../../../internal/components/button-trigger/styles.selectors.js';
import dropdownStatusStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import footerStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';
import selectStyles from '../../../select/styles.selectors.js';

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

  findInlineLabel(): ElementWrapper | null {
    return this.findByClassName(selectPartsStyles['inline-label']);
  }

  findPlaceholder(): ElementWrapper | null {
    return this.findByClassName(selectPartsStyles.placeholder);
  }

  /**
   * Returns the default Select trigger button. When the Select uses `renderCustomTrigger`,
   * this returns null — use `findCustomTrigger()` instead.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(buttonTriggerStyles['button-trigger'])!;
  }

  /**
   * Returns the wrapper around the custom trigger when `renderCustomTrigger` is provided
   * on the Select component. Returns null for default Select.
   *
   * The consumer's focusable element is a child of this wrapper. Chain into it
   * (e.g. `findCustomTrigger().find('button')`) to reach the focusable element.
   *
   * Use `findTrigger()` for default Select; use `findCustomTrigger()` when the
   * Select uses the `renderCustomTrigger` prop.
   */
  findCustomTrigger(): ElementWrapper | null {
    return this.findByClassName(selectPartsStyles['custom-trigger']);
  }

  @usesDom
  isDisabled(): boolean {
    return (this.findTrigger().getElement() as HTMLButtonElement).disabled;
  }
}
