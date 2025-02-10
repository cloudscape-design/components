// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import testutilStyles from '../../../prompt-input/test-classes/styles.selectors.js';

export default class PromptInputWrapper extends ComponentWrapper {
  static rootSelector = testutilStyles.root;

  findNativeTextarea(): ElementWrapper<HTMLTextAreaElement> {
    return this.findByClassName<HTMLTextAreaElement>(testutilStyles.textarea)!;
  }

  findActionButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['action-button'])!;
  }

  findSecondaryActions(): ElementWrapper<HTMLDivElement> {
    return this.findByClassName<HTMLDivElement>(testutilStyles['secondary-actions'])!;
  }

  findSecondaryContent(): ElementWrapper<HTMLDivElement> {
    return this.findByClassName<HTMLDivElement>(testutilStyles['secondary-content'])!;
  }

  /**
   * Gets the value of the component.
   *
   * Returns the current value of the textarea.
   */
  @usesDom getTextareaValue(): string {
    return this.findNativeTextarea().getElement().value;
  }

  /**
   * Sets the value of the component and calls the onChange handler.
   *
   * @param value value to set the textarea to.
   */
  @usesDom setTextareaValue(value: string): void {
    const element = this.findNativeTextarea().getElement();
    act(() => {
      const event = new Event('change', { bubbles: true, cancelable: false });
      setNativeValue(element, value);
      element.dispatchEvent(event);
    });
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
