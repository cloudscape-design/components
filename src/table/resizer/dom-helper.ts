// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';
import tableStyles from '../styles.css.js';
import styles from './styles.css.js';
import { getOverflowParents } from '../../internal/utils/scrollable-containers.js';

export class ResizerDomHelper {
  private _header: null | HTMLElement = null;
  private _table: null | HTMLElement = null;
  private _tracker: null | HTMLElement = null;
  private _scrollParent: null | HTMLElement = null;

  constructor(resizerElement: null | HTMLElement) {
    if (!resizerElement) {
      return;
    }

    this._header = findUpUntil(resizerElement, element => element.tagName.toLowerCase() === 'th');
    if (!this._header) {
      throw new Error('Invariant violation: table header not found.');
    }

    const tableRoot = findUpUntil(this._header, element => element.className.indexOf(tableStyles.root) > -1);
    if (!tableRoot) {
      throw new Error('Invariant violation: table root not found.');
    }

    this._table = tableRoot.querySelector<HTMLElement>('table');
    if (!this._table) {
      throw new Error('Invariant violation:table not found.');
    }

    // tracker is rendered inside table wrapper to align with its size
    this._tracker = tableRoot.querySelector<HTMLElement>(`.${styles.tracker}`);
    if (!this._tracker) {
      throw new Error('Invariant violation: resize tracker not found.');
    }

    this._scrollParent = getOverflowParents(this._header)[0];
    if (!this._scrollParent) {
      throw new Error('Invariant violation: scroll parent not found.');
    }
  }

  get header(): null | HTMLElement {
    return this._header;
  }

  get headerWidth(): number {
    return this._header?.getBoundingClientRect().width ?? 0;
  }

  get headerLeft(): number {
    return this._header?.getBoundingClientRect().left ?? 0;
  }

  get headerRight(): number {
    return this._header?.getBoundingClientRect().right ?? 0;
  }

  get leftEdge(): number {
    return this._scrollParent?.getBoundingClientRect().left ?? 0;
  }

  get rightEdge(): number {
    return this._scrollParent?.getBoundingClientRect().right ?? 0;
  }

  incrementScroll = (value: number) => {
    if (this._scrollParent) {
      this._scrollParent.scrollLeft += value;
    }
  };

  updateTrackerPosition = (newOffset: number) => {
    if (this._table && this._header && this._tracker) {
      const { left: scrollParentLeft } = this._table.getBoundingClientRect();
      this._tracker.style.top = this._header.getBoundingClientRect().height + 'px';
      // minus one pixel to offset the cell border
      this._tracker.style.left = newOffset - scrollParentLeft - 1 + 'px';
    }
  };

  setResizeActiveStyle = () => {
    document.body.classList.add(styles['resize-active']);
  };

  setResizerWithFocusStyle = () => {
    document.body.classList.add(styles['resize-active-with-focus']);
  };

  removeStyles = () => {
    document.body.classList.remove(styles['resize-active']);
    document.body.classList.remove(styles['resize-active-with-focus']);
  };
}
