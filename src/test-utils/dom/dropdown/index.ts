// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import styles from '../../../dropdown/styles.selectors.js';

// Base dropdown content wrapper
class DropdownContentWrapper extends ComponentWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return this.find(`.${styles.dropdown}[data-open=true]`);
  }

  findContent(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(styles['dropdown-content']) || null;
  }

  findHeader(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(styles['dropdown-header']) || null;
  }

  findFooter(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(styles['dropdown-footer']) || null;
  }
}

// Portal wrapper - only overrides findOpenDropdown()
class PortalDropdownContentWrapper extends DropdownContentWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return createWrapper().find(`.${styles.dropdown}[data-open=true]`);
  }
}

// Main Dropdown wrapper
export default class DropdownWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findOpenDropdown(): ElementWrapper | null {
    return this.find(`.${styles.dropdown}[data-open=true]`);
  }

  findTrigger(): ElementWrapper {
    return this.findByClassName(styles.trigger)!;
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  private findDropdown(options = { expandToViewport: false }): DropdownContentWrapper {
    return options.expandToViewport
      ? createWrapper().findComponent(`.${styles.dropdown}[data-open=true]`, PortalDropdownContentWrapper)!
      : new DropdownContentWrapper(this.getElement());
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findContent(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findContent();
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findHeader(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findHeader();
  }

  /**
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findFooter(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findFooter();
  }

  @usesDom
  openDropdown(): void {
    act(() => {
      this.findTrigger().fireEvent(new MouseEvent('click', { bubbles: true }));
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
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  @usesDom
  isOpen(options = { expandToViewport: false }): boolean {
    return !!this.findDropdown(options).findOpenDropdown();
  }
}
