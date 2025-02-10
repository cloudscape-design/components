// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import inputSelectors from '../../../input/styles.selectors.js';

export default abstract class BaseInputWrapper extends ComponentWrapper {
  findNativeInput(): ElementWrapper<HTMLInputElement> {
    // Input component always have native input
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

// Copied from @testing-library/dom/dist/events.js
function setNativeValue(element: Element, value: string): void {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      throw new Error('The given element does not have a value setter');
    }
  }
}
