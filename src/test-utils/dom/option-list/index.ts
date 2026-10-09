// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option.js';

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
   * Returns the option secondary content.
   */
  findSecondaryContent(): ElementWrapper | null {
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
}

export default class OptionListWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the element that has the `listbox` role and receives focus.
   */
  findListbox(): ElementWrapper {
    return this.find('[role="listbox"]')!;
  }

  /**
   * Returns all options.
   */
  findOptions(): Array<OptionListOptionWrapper> {
    return this.findAllByClassName(styles.option).map(wrapper => new OptionListOptionWrapper(wrapper.getElement()));
  }

  /**
   * Returns an option for a given index.
   *
   * @param index 1-based index of the option to return.
   */
  findOptionByIndex(index: number): OptionListOptionWrapper | null {
    return this.findComponent(`.${styles.option}:nth-child(${index})`, OptionListOptionWrapper);
  }

  /**
   * Returns an option for a given item id.
   */
  findOptionById(id: string): OptionListOptionWrapper | null {
    return this.findComponent(`.${styles.option}[data-testid="${id}"]`, OptionListOptionWrapper);
  }

  /**
   * Returns all selected options.
   */
  findSelectedOptions(): Array<OptionListOptionWrapper> {
    return this.findAll(`.${styles.option}.${selectableItemsStyles.selected}`).map(
      wrapper => new OptionListOptionWrapper(wrapper.getElement())
    );
  }

  /**
   * Returns the highlighted option.
   */
  findHighlightedOption(): OptionListOptionWrapper | null {
    return this.findComponent(`.${styles.option}.${selectableItemsStyles.highlighted}`, OptionListOptionWrapper);
  }
}
