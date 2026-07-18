// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../virtual-table/styles.selectors.js';

export default class VirtualTableWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /** Rendered (windowed) rows only. */
  findRows(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.row);
  }

  /**
   * Returns null for rows outside the current window (by design). Locates by the
   * row's `aria-rowindex`, which is the full-dataset index offset by the header row:
   * header is `aria-rowindex=1`, so data row `dataIndex` is `aria-rowindex=dataIndex+2`.
   * Indexing this way (not by position in the windowed array) is correct under
   * virtualization.
   */
  findRowByIndex(dataIndex: number): ElementWrapper | null {
    return this.find(`.${styles.row}[aria-rowindex="${dataIndex + 2}"]`);
  }

  /** The disclosure toggle button for a data row, or null if the row is outside the window. */
  findExpandToggle(dataIndex: number): ElementWrapper | null {
    return this.findRowByIndex(dataIndex)?.findByClassName(styles['disclosure-button']) ?? null;
  }

  /** The labeled expanded region for a data row, or null if not expanded/windowed. */
  findExpandedRegion(dataIndex: number): ElementWrapper | null {
    // The expanded row shares its data row's aria-rowindex (dataIndex + 2) and carries
    // the `expanded-row` class, so it is addressable by selector alone — no runtime
    // attribute read, which keeps this method valid in the selectors test-utils too.
    return this.find(`.${styles['expanded-row']}[aria-rowindex="${dataIndex + 2}"] .${styles['expanded-region']}`);
  }

  findColumnHeaders(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['header-cell']);
  }

  /**
   * The header row element. Renamed from `findStickyHeader` — it returns the header
   * row regardless of the `stickyHeader` prop, so it must not imply sticky state.
   */
  findHeaderRow(): ElementWrapper | null {
    return this.findByClassName(styles['header-row']);
  }

  /** The polite append aria-live node. */
  findLiveRegion(): ElementWrapper | null {
    return this.findByClassName(styles['live-region']);
  }
}
