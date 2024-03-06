// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from 'react-dom/test-utils';
import { ComponentWrapper, ElementWrapper, usesDom, createWrapper } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';

import DropdownWrapper from './dropdown';
import OptionsListWrapper from './options-list';
import OptionWrapper from './option';
import selectableStyles from '../../../internal/components/selectable-item/styles.selectors.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.selectors.js';
import footerStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import optionStyles from '../../../internal/components/option/styles.selectors.js';

export default abstract class DropdownHostComponentWrapper extends ComponentWrapper {
  abstract findTrigger(): ElementWrapper;

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  private assertOpenDropdown(options = { expandToViewport: false }): void {
    const isOpen = !!this.findDropdown(options)?.findOpenDropdown();
    if (!isOpen) {
      throw new Error('Unable to select an option when dropdown is closed');
    }
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findDropdown(options = { expandToViewport: false }): DropdownContentWrapper {
    return options.expandToViewport
      ? createWrapper().findComponent(`.${dropdownStyles.dropdown}[data-open=true]`, PortalDropdownContentWrapper)!
      : new DropdownContentWrapper(this.getElement());
  }

  @usesDom
  openDropdown(): void {
    act(() => {
      this.findTrigger().fireEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  closeDropdown(options = { expandToViewport: false }): void {
    if (
      document.activeElement &&
      (this.element.contains(document.activeElement) ||
        this.findDropdown(options).getElement().contains(document.activeElement)) &&
      document.activeElement instanceof HTMLElement
    ) {
      const element = document.activeElement;
      act(() => {
        element.blur();
      });
    }
  }

  /**
   * Selects an option for the given index by triggering corresponding events.
   *
   * This utility does not open the dropdown of the given select and it will need to be called explicitly in your test.
   * On selection the dropdown will close automatically.
   *
   * Example:
   * ```
   * wrapper.openDropdown();
   * wrapper.selectOption(1);
   * ```
   *
   * @param index 1-based index of the option to select
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  selectOption(index: number, options = { expandToViewport: false }): void {
    if (index < 1) {
      throw new Error('Option index should be a 1-based integer number');
    }
    this.assertOpenDropdown(options);
    const option = this.findDropdown(options).findOption(index);
    if (!option) {
      throw new Error(`Can't select the option, because there is no option with the index ${index}.`);
    }
    act(() => {
      option.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }

  /**
   * Selects an option for the given value by triggering corresponding events.
   *
   * This utility does not open the dropdown of the given select and it will need to be called explicitly in your test.
   * On selection the dropdown will close automatically.
   *
   * Example:
   * ```
   * wrapper.openDropdown();
   * wrapper.selectOptionByValue('option_1');
   * ```
   *
   * @param value value of the option
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  selectOptionByValue(value: string, options = { expandToViewport: false }): void {
    this.assertOpenDropdown(options);
    const option = this.findDropdown(options).findOptionByValue(value);
    if (!option) {
      throw new Error(`Can't select the option, because there is no option with the value ${JSON.stringify(value)}.`);
    }
    act(() => {
      option.fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }
}

export class DropdownContentWrapper extends ComponentWrapper {
  findDisabledOptions(): Array<OptionWrapper> {
    return this.findAllByClassName(selectableStyles.disabled).map(
      (elementWrapper: ElementWrapper) => new OptionWrapper(elementWrapper.getElement())
    );
  }

  findFooterRegion(): ElementWrapper | null {
    return this.findByClassName(footerStyles.root);
  }

  findHighlightedAriaLiveRegion(): ElementWrapper | null {
    return this.find('[aria-live]');
  }

  /**
   * Returns highlighted text fragments from all of the options.
   * Options get highlighted when they match the value of the input field.
   */
  findHighlightedMatches(): Array<ElementWrapper> {
    return this.findAllByClassName(optionStyles['filtering-match-highlight']);
  }

  findHighlightedOption(): OptionWrapper | null {
    return this.findComponent(`.${selectableStyles.highlighted}`, OptionWrapper);
  }

  findOpenDropdown(): ElementWrapper | null {
    const dropdown = new DropdownWrapper(this.getElement());
    return dropdown.findOpenDropdown();
  }

  /**
   * Returns an option from the dropdown.
   *
   * @param optionIndex 1-based index of the option to select.
   */
  findOption(optionIndex: number): OptionWrapper | null {
    return this.findComponent(
      `.${selectableStyles['selectable-item']}[data-test-index="${optionIndex}"] .${OptionWrapper.rootSelector}`,
      OptionWrapper
    );
  }

  findOptionByValue(value: string): OptionWrapper | null {
    const toReplace = escapeSelector(value);
    return this.findComponent(`.${OptionWrapper.rootSelector}[data-value="${toReplace}"]`, OptionWrapper);
  }

  /**
   * Returns an option from the dropdown.
   *
   * @param groupIndex 1-based index of the group to select an option in.
   * @param optionIndex 1-based index of the option to select.
   */
  findOptionInGroup(groupIndex: number, optionIndex: number): OptionWrapper | null {
    return this.findComponent(
      `.${selectableStyles['selectable-item']}[data-group-index="${groupIndex}"][data-child-index="${optionIndex}"] .${OptionWrapper.rootSelector}`,
      OptionWrapper
    );
  }

  findOptions(): Array<OptionWrapper> {
    return this.findAll(`.${selectableStyles['selectable-item']}[data-test-index] .${OptionWrapper.rootSelector}`).map(
      (elementWrapper: ElementWrapper) => new OptionWrapper(elementWrapper.getElement())
    );
  }

  /**
   * Use this element to scroll through the list of options
   */
  findOptionsContainer(): ElementWrapper | null {
    return this.findByClassName(OptionsListWrapper.rootSelector);
  }

  findSelectedOptions(): Array<OptionWrapper> {
    return this.findAllByClassName(selectableStyles.selected).map(
      (elementWrapper: ElementWrapper) => new OptionWrapper(elementWrapper.getElement())
    );
  }

  /**
   * Returns an option group from the dropdown.
   *
   * @param index 1-based index of the group to select.
   */
  findGroup(index: number): ElementWrapper | null {
    return this.find(`.${selectableStyles['selectable-item']}[data-group-index="${index}"]`);
  }

  /**
   * Returns all option groups in the dropdown.
   */
  findGroups(): Array<ElementWrapper> {
    return this.findAll(`.${selectableStyles['selectable-item']}[data-group-index]:not([data-test-index])`);
  }
}

export class PortalDropdownContentWrapper extends DropdownContentWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return createWrapper().findComponent(`.${dropdownStyles.dropdown}[data-open=true]`, DropdownWrapper);
  }
}
