// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../cards/styles.selectors.js';
import tableStyles from '../../../table/styles.selectors.js';
import CollectionPreferencesWrapper from '../collection-preferences';
import ContainerWrapper from '../container';
import PaginationWrapper from '../pagination';
import TextFilterWrapper from '../text-filter';

export class CardSectionWrapper extends ComponentWrapper {
  findSectionHeader(): ElementWrapper | null {
    return this.findByClassName(styles['section-header']);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['section-content']);
  }
}

export class CardWrapper extends ComponentWrapper {
  /**
   * Note: for integration/selector-based tests you should add `1` to the expected section index,
   * for example, `.findSections().get(sectionIndex+1)`. The `get` call in this context
   * is '2-indexed', that is, the first section in a card has an index of `2`.
   */
  findSections(): Array<CardSectionWrapper> {
    return this.findAllByClassName(styles.section).map(c => new CardSectionWrapper(c.getElement()));
  }

  findCardHeader(): ElementWrapper | null {
    return this.findByClassName(styles['card-header-inner']);
  }

  findSelectionArea(): ElementWrapper | null {
    return this.findByClassName(`${styles['selection-control']} label`);
  }
}

export default class CardsWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  private containerWrapper = new ContainerWrapper(this.getElement());

  findItems(): Array<CardWrapper> {
    return this.findAllByClassName(styles.card).map(c => new CardWrapper(c.getElement()));
  }

  findSelectedItems(): Array<CardWrapper> {
    return this.findAllByClassName(styles['card-selected']).map(c => new CardWrapper(c.getElement()));
  }

  findHeader(): ElementWrapper | null {
    return this.containerWrapper.findHeader();
  }

  /**
   * Alias for findHeader method for compatibility with previous versions
   * @deprecated
   */
  findHeaderRegion(): ElementWrapper | null {
    return this.findHeader();
  }

  /**
   * Alias for findEmptySlot method for compatibility with previous versions
   * @deprecated
   */
  findEmptyRegion(): ElementWrapper | null {
    return this.findEmptySlot();
  }

  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }

  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }

  findTextFilter(): TextFilterWrapper | null {
    return this.findComponent(`.${tableStyles['tools-filtering']}`, TextFilterWrapper);
  }

  findPagination(): PaginationWrapper | null {
    return this.findComponent(`.${tableStyles['tools-pagination']}`, PaginationWrapper);
  }

  findFooterPagination(): PaginationWrapper | null {
    return this.findComponent(`.${styles['footer-pagination']}`, PaginationWrapper);
  }

  findCollectionPreferences(): CollectionPreferencesWrapper | null {
    return this.findComponent(`.${tableStyles['tools-preferences']}`, CollectionPreferencesWrapper);
  }
}
