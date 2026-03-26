// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import InputWrapper from '../input';
import { DropdownContentWrapper } from '../internal/dropdown-host';
import OptionWrapper from '../internal/option';

import mainStyles from '../../../autosuggest/styles.selectors.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.selectors.js';
import dropdownStatusStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import footerStyles from '../../../internal/components/dropdown-status/styles.selectors.js';
import selectableStyles from '../../../internal/components/selectable-item/styles.selectors.js';

export class AutosuggestDropdownWrapper extends DropdownContentWrapper {
  findOptions(): Array<OptionWrapper> {
    return this.findAll(`.${selectableStyles['selectable-item']}[data-test-index]`).map(
      (elementWrapper: ElementWrapper) => new OptionWrapper(elementWrapper.getElement())
    );
  }

  /**
   * Returns an option from the dropdown.
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
   * Returns an option from the autosuggest by its value
   *
   * @param value The 'value' of the option.
   */
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
      `.${selectableStyles['selectable-item']}[data-group-index="${groupIndex}"][data-in-group-index="${optionIndex}"]`,
      OptionWrapper
    );
  }
}

class PortalAutosuggestDropdownWrapper extends AutosuggestDropdownWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return createWrapper().find(`.${dropdownStyles.dropdown}[data-open=true]`);
  }
}

export default class AutosuggestWrapper extends InputWrapper {
  static rootSelector: string = mainStyles.root;

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findDropdown(options = { expandToViewport: false }): AutosuggestDropdownWrapper {
    return options.expandToViewport
      ? createWrapper().findComponent(`.${dropdownStyles.dropdown}[data-open=true]`, PortalAutosuggestDropdownWrapper)!
      : new AutosuggestDropdownWrapper(this.getElement());
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findStatusIndicator(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findByClassName(dropdownStatusStyles.root);
  }

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
  findEnteredTextOption(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findByClassName(selectableStyles['has-background']);
  }

  /**
   * Selects a suggestion from the dropdown by simulating mouse events.
   *
   * @param index 1-based index of the suggestion to select.
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  selectSuggestion(index: number, options = { expandToViewport: false }): void {
    act(() => {
      this.findDropdown(options)
        ?.findOption(index)!
        .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }

  /**
   * Selects a suggestion from the dropdown by simulating mouse events.
   *
   * @param value value of suggestion to select
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  selectSuggestionByValue(value: string, options = { expandToViewport: false }): void {
    act(() => {
      this.findDropdown(options)
        ?.findOptionByValue(value)!
        .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
  }
}
