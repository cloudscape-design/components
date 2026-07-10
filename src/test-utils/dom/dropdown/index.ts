// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../dropdown/styles.selectors.js';
import testUtilStyles from '../../../dropdown/test-classes/styles.selectors.js';

export class DropdownContentWrapper extends ComponentWrapper {
  /**
   * Returns the dropdown content.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['dropdown-content']);
  }

  /**
   * Returns the dropdown header.
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles.header);
  }

  /**
   * Returns the dropdown footer.
   */
  findFooter(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles.footer);
  }
}

export default class DropdownWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the trigger element.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(testUtilStyles.trigger)!;
  }

  /**
   * Returns the open dropdown wrapper, or null if the dropdown is closed.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findOpenDropdown(options = { expandToViewport: false }): DropdownContentWrapper | null {
    const dropdown = options.expandToViewport
      ? createWrapper().find(`.${styles.dropdown}[data-open=true]`)
      : this.find(`.${styles.dropdown}[data-open=true]`);
    return dropdown ? new DropdownContentWrapper(dropdown.getElement()) : null;
  }

  /**
   * Returns whether the dropdown is open.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  isOpen(options = { expandToViewport: false }): boolean {
    return options.expandToViewport
      ? createWrapper().find(`.${styles.dropdown}[data-open=true]`) !== null
      : this.find(`.${styles.dropdown}[data-open=true]`) !== null;
  }
}
