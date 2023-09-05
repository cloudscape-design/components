// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../anchor-navigation/styles.selectors.js';

export default class AnchorNavigationWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findAnchorNavigation(): ElementWrapper<HTMLOListElement> | null {
    return this.findByClassName(styles['anchor-list']);
  }

  findAnchors(): Array<AnchorItemWrapper> {
    return this.findAll('li').map(wrapper => new AnchorItemWrapper(wrapper.getElement()));
  }

  findAnchorByIndex(index: number): AnchorItemWrapper | null {
    return this.findComponent(`[data-itemid="anchor-item-${index}"]`, AnchorItemWrapper);
  }

  findActiveAnchor(): AnchorItemWrapper | null {
    return this.findComponent(styles['anchor-item--active'], AnchorItemWrapper);
  }

  findAnchorByHref(href: string): ElementWrapper<HTMLAnchorElement> | null {
    return this.find(`.${styles['anchor-link']}[href="${href}"]`);
  }
}

export class AnchorItemWrapper extends ElementWrapper {
  findText(): ElementWrapper | null {
    return this.findByClassName(styles['anchor-link-text']);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles['anchor-link-info']);
  }

  @usesDom
  isActive(): boolean {
    return this.getElement().getAttribute('aria-current') === 'true';
  }
}
