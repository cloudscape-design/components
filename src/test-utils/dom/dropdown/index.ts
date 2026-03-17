// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act } from '@cloudscape-design/test-utils-core/utils-dom';

import styles from '../../../dropdown/styles.selectors.js';
import testutilStyles from '../../../dropdown/test-classes/styles.selectors.js';

export class DropdownContentWrapper extends ComponentWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return this.find(`.${styles.dropdown}[data-open=true]`);
  }

  findContentWrapper(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(styles['dropdown-content-wrapper']) ?? null;
  }

  findContent(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(styles['dropdown-content']) ?? null;
  }

  findHeader(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(testutilStyles.header) ?? null;
  }

  findFooter(): ElementWrapper | null {
    return this.findOpenDropdown()?.findByClassName(testutilStyles.footer) ?? null;
  }
}

class PortalDropdownContentWrapper extends DropdownContentWrapper {
  findOpenDropdown(): ElementWrapper | null {
    return createWrapper().find(`.${styles.dropdown}[data-open=true]`);
  }
}

export default class DropdownWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the trigger element.
   */
  findTrigger(): ElementWrapper {
    return this.findByClassName(testutilStyles.trigger)!;
  }

  /**
   * Returns the dropdown wrapper.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findDropdown(options = { expandToViewport: false }): DropdownContentWrapper {
    return options.expandToViewport
      ? createWrapper().findComponent(`.${styles.dropdown}[data-open=true]`, PortalDropdownContentWrapper)!
      : new DropdownContentWrapper(this.getElement());
  }

  /**
   * Returns the dropdown content element.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findContent(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findContent();
  }

  /**
   * Returns the open dropdown element.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findOpenDropdown(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options)?.findOpenDropdown() ?? null;
  }

  /**
   * Returns the dropdown header element.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findHeader(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findHeader();
  }

  /**
   * Returns the dropdown footer element.
   *
   * @param options
   * * expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag.
   */
  findFooter(options = { expandToViewport: false }): ElementWrapper | null {
    return this.findDropdown(options).findFooter();
  }

  /**
   * Returns whether the dropdown is open.
   */
  isOpen(options = { expandToViewport: false }): boolean {
    return this.findOpenDropdown(options) !== null;
  }

  /**
   * Clicks the trigger element.
   */
  @usesDom
  clickTrigger(): void {
    act(() => {
      const trigger = this.findTrigger().getElement().firstElementChild as HTMLElement | null;
      if (!trigger) {
        throw new Error('No trigger element found inside the trigger wrapper');
      }
      trigger.click();
    });
  }
}
