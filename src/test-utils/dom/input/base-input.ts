// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, Simulate } from 'react-dom/test-utils';
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
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
      Simulate.change(element, { target: { value } as unknown as EventTarget });
    });
  }

  @usesDom
  isDisabled(): boolean {
    return this.findNativeInput().getElement().hasAttribute('disabled');
  }
}
