// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act, setNativeValue } from '@cloudscape-design/test-utils-core/utils-dom';

import inputSelectors from '../../../input/styles.selectors.js';

export default abstract class BaseInputWrapper extends ComponentWrapper {
  findNativeInput(): ElementWrapper<HTMLInputElement> {
    // Input component always have native input
    return this.find<HTMLInputElement>(`.${inputSelectors.input}`)!;
  }

  @usesDom
  focus(): void {
    act(() => {
      this.findNativeInput().focus();
    });
  }

  @usesDom
  blur(): void {
    act(() => {
      this.findNativeInput().blur();
    });
  }

  /**
   * Gets the value of the component.
   *
   * Returns the current value of the input.
   */
  @usesDom getInputValue(): string {
    return this.findNativeInput().getElement().value;
  }

  /**
   * Sets the value of the component and calls the `onChange` handler
   *
   * @param value The value the input is set to.
   */
  @usesDom setInputValue(value: string): void {
    const element = this.findNativeInput().getElement();
    act(() => {
      const event = new Event('change', { bubbles: true, cancelable: false });
      setNativeValue(element, value);
      element.dispatchEvent(event);
    });
  }

  @usesDom
  isDisabled(): boolean {
    return this.findNativeInput().getElement().hasAttribute('disabled');
  }
}
