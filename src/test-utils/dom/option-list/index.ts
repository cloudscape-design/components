// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { escapeSelector } from '@cloudscape-design/test-utils-core/utils';

import OptionWrapper from '../internal/option.js';
import OptionsListWrapper from '../internal/options-list.js';

import selectableItemsStyles from '../../../internal/components/selectable-item/styles.selectors.js';
import styles from '../../../option-list/test-classes/styles.selectors.js';

export class OptionListOptionWrapper extends ComponentWrapper {
  /**
   * Returns the option content (label, description, icon).
   */
  findOption(): OptionWrapper | null {
    return this.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper);
  }

  /**
   * Returns the option label.
   */
  findLabel(): ElementWrapper | null {
    return this.findOption()?.findLabel() ?? null;
  }

  /**
   * Returns the option description.
   */
  findDescription(): ElementWrapper | null {
    return this.findOption()?.findDescription() ?? null;
  }

  /**
   * Returns the option label tag.
   */
  findLabelTag(): ElementWrapper | null {
    return this.findOption()?.findLabelTag() ?? null;
  }

  /**
   * Returns the option tags.
   */
  findTags(): Array<ElementWrapper> {
    return this.findOption()?.findTags() ?? [];
  }

  @usesDom
  isSelected(): boolean {
    return this.element.classList.contains(selectableItemsStyles.selected);
  }

  @usesDom
  isHighlighted(): boolean {
    return this.element.classList.contains(selectableItemsStyles.highlighted);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(selectableItemsStyles.disabled);
  }
}

export default class OptionListWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the container of the options. This element receives focus and handles keyboard navigation.
   */
  findOptionsContainer(): ElementWrapper {
    return this.findByClassName(OptionsListWrapper.rootSelector)!;
  }

  /**
   * Returns all options. Group headers are not included.
   */
  findOptions(): Array<OptionListOptionWrapper> {
    return this.findAllByClassName(styles.option).map(wrapper => new OptionListOptionWrapper(wrapper.getElement()));
  }

  /**
   * Returns an option for a given index. Group headers are not counted.
   *
   * @param index 1-based index of the option to return.
   */
  findOptionByIndex(index: number): OptionListOptionWrapper | null {
    return this.findComponent(`.${styles.option}[data-option-index="${index}"]`, OptionListOptionWrapper);
  }

  /**
   * Returns an option for a given value.
   *
   * @param value The `value` of the option.
   */
  findOptionByValue(value: string): OptionListOptionWrapper | null {
    const escapedValue = escapeSelector(value);
    return this.findComponent(`.${styles.option}[data-value="${escapedValue}"]`, OptionListOptionWrapper);
  }

  /**
   * Returns all group headers.
   */
  findGroupHeaders(): Array<OptionListOptionWrapper> {
    return this.findAllByClassName(styles['group-header']).map(
      wrapper => new OptionListOptionWrapper(wrapper.getElement())
    );
  }

  /**
   * Returns a group header for a given group value.
   *
   * @param value The `value` of the option group.
   */
  findGroupHeaderByValue(value: string): OptionListOptionWrapper | null {
    const escapedValue = escapeSelector(value);
    return this.findComponent(`.${styles['group-header']}[data-value="${escapedValue}"]`, OptionListOptionWrapper);
  }

  /**
   * Returns all selected options. Group headers are not included.
   */
  findSelectedOptions(): Array<OptionListOptionWrapper> {
    return this.findAll(`.${styles.option}.${selectableItemsStyles.selected}`).map(
      wrapper => new OptionListOptionWrapper(wrapper.getElement())
    );
  }

  /**
   * Returns the highlighted option. Group headers are not included.
   */
  findHighlightedOption(): OptionListOptionWrapper | null {
    return this.findComponent(`.${styles.option}.${selectableItemsStyles.highlighted}`, OptionListOptionWrapper);
  }
}
