// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ExpandableSectionWrapper from '../expandable-section';
import styles from '../../../side-navigation/styles.selectors.js';

export default class SideNavigationWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName(styles.header);
  }

  findHeaderLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName(styles['header-link']);
  }

  findLinkByHref(href: string): ElementWrapper<HTMLAnchorElement> | null {
    return this.find(`.${styles.link}[href="${href}"]`);
  }

  findActiveLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName(styles['link-active']);
  }

  findItemByIndex(index: number): SideNavigationItemWrapper | null {
    return this.findComponent(
      `.${styles['list-variant-root']} > [data-itemid="item-${index}"]`,
      SideNavigationItemWrapper
    );
  }
}

export class SideNavigationItemWrapper extends ElementWrapper {
  findSection(): ExpandableSectionWrapper | null {
    return this.findComponent(`.${styles.section}`, ExpandableSectionWrapper);
  }

  findSectionGroup(): ElementWrapper | null {
    return this.findByClassName(styles['section-group']);
  }

  findSectionGroupTitle(): ElementWrapper | null {
    return this.findByClassName(styles['section-group-title']);
  }

  findExpandableLinkGroup(): ExpandableSectionWrapper | null {
    return this.findComponent(`.${styles['expandable-link-group']}`, ExpandableSectionWrapper);
  }

  findDivider(): ElementWrapper | null {
    return this.findByClassName(styles.divider);
  }

  findLink(): ElementWrapper<HTMLAnchorElement> | null {
    return this.findByClassName(styles.link);
  }

  findSectionTitle(): ElementWrapper | null {
    return this.findSection()?.findHeader() ?? null;
  }

  findItemByIndex(index: number): SideNavigationItemWrapper | null {
    return this.findComponent(`[data-itemid="item-${index}"]`, SideNavigationItemWrapper);
  }

  findItems(): Array<SideNavigationItemWrapper> {
    return this.findAll('li').map(wrapper => new SideNavigationItemWrapper(wrapper.getElement()));
  }
}
