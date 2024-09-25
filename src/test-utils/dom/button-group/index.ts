// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button/index.js';
import ButtonDropdownWrapper from '../button-dropdown/index.js';
import createWrapper from '../index.js';

import testUtilStyles from '../../../button-group/test-classes/styles.selectors.js';

export default class ButtonGroupWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles['button-group'];

  /**
   * Finds all button and menu items.
   */
  findItems(): Array<ElementWrapper> {
    return this.findAllByClassName(testUtilStyles['button-group-item']);
  }

  /**
   * Finds a button item by its id.
   */
  findButtonById(id: string): null | ButtonWrapper {
    const inlineItemSelector = `.${testUtilStyles['button-group-item']}[data-testid="${id}"]`;
    const wrapper = this.find(inlineItemSelector) as ElementWrapper<HTMLButtonElement>;
    return wrapper && new ButtonWrapper(wrapper.getElement());
  }

  /**
   * Finds a menu item by its id.
   */
  findMenuById(id: string): null | ButtonDropdownWrapper {
    const inlineItemSelector = `.${testUtilStyles['button-group-item']}[data-testid="${id}"]`;
    const wrapper = this.find(inlineItemSelector);
    return wrapper && new ButtonDropdownWrapper(wrapper.getElement());
  }

  /**
   * Finds the currently opened tooltip.
   */
  findTooltip(): null | ElementWrapper {
    return createWrapper().findByClassName(testUtilStyles['button-group-tooltip']);
  }
}
