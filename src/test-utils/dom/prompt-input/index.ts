// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';
import { act, setNativeValue } from '@cloudscape-design/test-utils-core/utils-dom';

import OptionWrapper from '../internal/option';

import dropdownStyles from '../../../internal/components/dropdown/styles.selectors.js';
import selectableStyles from '../../../internal/components/selectable-item/styles.selectors.js';
import testutilStyles from '../../../prompt-input/test-classes/styles.selectors.js';

export class PromptInputMenuWrapper extends ComponentWrapper {
  findOptions(): Array<OptionWrapper> {
    return this.findAll(`.${selectableStyles['selectable-item']}[data-test-index]`).map(
      (elementWrapper: ElementWrapper) => new OptionWrapper(elementWrapper.getElement())
    );
  }

  /**
   * Returns an option from the menu.
   *
   * @param optionIndex 1-based index of the option to select.
   */
  findOption(optionIndex: number): OptionWrapper | null {
    return this.findComponent(
      `.${selectableStyles['selectable-item']}[data-test-index="${optionIndex}"]`,
      OptionWrapper
    );
  }

  /**
   * Returns an option from the menu by its value
   *
   * @param value The 'value' of the option.
   */
  findOptionByValue(value: string): OptionWrapper | null {
    const toReplace = escapeSelector(value);
    return this.findComponent(`.${OptionWrapper.rootSelector}[data-value="${toReplace}"]`, OptionWrapper);
  }
}

export default class PromptInputWrapper extends ComponentWrapper {
  static rootSelector = testutilStyles.root;

  /**
   * Finds the native textarea element.
   *
   * Note: When menus are defined, the component uses a contentEditable element instead of a textarea.
   * In this case, this method may fail to find the textarea element. Use findContentEditableElement()
   * or the getValue()/setValue() methods instead.
   */
  findNativeTextarea(): ElementWrapper<HTMLTextAreaElement> {
    return this.findByClassName<HTMLTextAreaElement>(testutilStyles.textarea)!;
  }

  /**
   * Finds the contentEditable element used when menus are defined.
   * Returns null if the component does not have menus defined.
   */
  findContentEditableElement(): ElementWrapper<HTMLDivElement> | null {
    return this.find('[contenteditable="true"]');
  }

  /**
   * Finds the action button. Note that, despite its typings, this may return null.
   */
  findActionButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testutilStyles['action-button'])!;
  }

  /**
   * Finds the secondary actions slot. Note that, despite its typings, this may return null.
   */
  findSecondaryActions(): ElementWrapper<HTMLDivElement> {
    return this.findByClassName<HTMLDivElement>(testutilStyles['secondary-actions'])!;
  }

  findSecondaryContent(): ElementWrapper<HTMLDivElement> | null {
    return this.findByClassName<HTMLDivElement>(testutilStyles['secondary-content']);
  }

  findCustomPrimaryAction(): ElementWrapper<HTMLDivElement> | null {
    return this.findByClassName<HTMLDivElement>(testutilStyles['primary-action']);
  }

  /**
   * Finds the menu dropdown (always in portal due to expandToViewport=true).
   */
  findMenu(): PromptInputMenuWrapper | null {
    return createWrapper().findComponent(`.${dropdownStyles.dropdown}[data-open=true]`, PromptInputMenuWrapper);
  }

  /**
   * Gets the value of the component.
   *
   * Returns the current value of the textarea (when no menus are defined) or the text content of the contentEditable element (when menus are defined).
   */
  @usesDom getValue(): string {
    const contentEditable = this.findContentEditableElement();
    if (contentEditable) {
      return contentEditable.getElement().textContent || '';
    }
    const textarea = this.findNativeTextarea();
    return textarea ? textarea.getElement().value : '';
  }

  /**
   * Sets the value of the component by directly setting text content.
   * This does NOT trigger menu detection. Use the component ref's insertText() method
   * to simulate typing and trigger menus.
   *
   * @param value String value to set the component to.
   */
  @usesDom setValue(value: string): void {
    const contentEditable = this.findContentEditableElement();
    if (contentEditable) {
      const element = contentEditable.getElement();
      act(() => {
        element.textContent = value;
        element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
      });
    } else {
      this.setTextareaValue(value);
    }
  }

  /**
   * @deprecated Use getValue() instead.
   *
   * Gets the value of the component.
   *
   * Returns the current value of the textarea.
   */
  @usesDom getTextareaValue(): string {
    return this.getValue();
  }

  /**
   * @deprecated Use setValue() instead.
   *
   * Sets the value of the component and calls the onChange handler.
   *
   * @param value value to set the textarea to.
   */
  @usesDom setTextareaValue(value: string): void {
    const textarea = this.findNativeTextarea();
    if (textarea) {
      const element = textarea.getElement();
      act(() => {
        const event = new Event('change', { bubbles: true, cancelable: false });
        setNativeValue(element, value);
        element.dispatchEvent(event);
      });
    }
  }

  /**
   * Checks if the menu is currently open.
   */
  @usesDom
  isMenuOpen(): boolean {
    const menu = this.findMenu();
    return menu !== null;
  }

  /**
   * Selects an option from the menu by simulating mouse events.
   *
   * @param value value of option to select
   */
  @usesDom
  selectMenuOptionByValue(value: string): void {
    act(() => {
      const menu = this.findMenu();
      if (!menu) {
        throw new Error('Menu not found');
      }
      const option = menu.findOptionByValue(value);
      if (!option) {
        throw new Error(`Option with value "${value}" not found in menu`);
      }
      option.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }

  /**
   * Selects an option from the menu by simulating mouse events.
   *
   * @param optionIndex 1-based index of the option to select
   */
  @usesDom
  selectMenuOption(optionIndex: number): void {
    act(() => {
      const menu = this.findMenu();
      if (!menu) {
        throw new Error('Menu not found');
      }
      const option = menu.findOption(optionIndex);
      if (!option) {
        throw new Error(`Option at index ${optionIndex} not found in menu`);
      }
      option.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }
}
