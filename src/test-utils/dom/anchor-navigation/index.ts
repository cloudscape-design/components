// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import testUtilStyles from '../../../anchor-navigation/test-classes/styles.selectors.js';

export default class AnchorNavigationWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  findAnchorNavigation(): ElementWrapper<HTMLOListElement> | null {
    return this.findByClassName(AnchorNavigationWrapper.rootSelector);
  }

  findAnchorNavigationList(): ElementWrapper<HTMLOListElement> | null {
    return this.findByClassName(testUtilStyles['anchor-list']);
  }

  findAnchors(): Array<AnchorItemWrapper> {
    return this.findAll('li').map(wrapper => new AnchorItemWrapper(wrapper.getElement()));
  }
  /*
   * @param index 1-based index of the anchor item
   */
  findAnchorByIndex(index: number): AnchorItemWrapper | null {
    return this.findComponent(`[data-itemid="anchor-item-${index}"]`, AnchorItemWrapper);
  }

  findActiveAnchor(): AnchorItemWrapper | null {
    return this.findComponent(`.${testUtilStyles['anchor-item--active']}`, AnchorItemWrapper);
  }

  findAnchorLinkByHref(href: string): ElementWrapper<HTMLAnchorElement> | null {
    return this.find(`.${testUtilStyles['anchor-link']}[href="${href}"]`);
  }
}

export class AnchorItemWrapper extends ElementWrapper {
  findLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName(testUtilStyles['anchor-link']);
  }

  findText(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles['anchor-link-text']);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles['anchor-link-info']);
  }

  @usesDom
  isActive(): boolean {
    return this.findByClassName(testUtilStyles['anchor-link'])?.getElement().getAttribute('aria-current') === 'true';
  }
}
