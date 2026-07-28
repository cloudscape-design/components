// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import ButtonDropdownWrapper from '../button-dropdown';
import CollectionPreferencesWrapper from '../collection-preferences';
import ContainerWrapper from '../container';
import PaginationWrapper from '../pagination';
import PropertyFilterWrapper from '../property-filter';
import TextFilterWrapper from '../text-filter';

import expandToggleStyles from '../../../internal/components/expand-toggle-button/styles.selectors.js';
import bodyCellStyles from '../../../table/body-cell/styles.selectors.js';
import headerCellStyles from '../../../table/header-cell/styles.selectors.js';
import progressiveLoadingStyles from '../../../table/progressive-loading/styles.selectors.js';
import resizerStyles from '../../../table/resizer/styles.selectors.js';
import selectionStyles from '../../../table/selection/styles.selectors.js';
import styles from '../../../table/styles.selectors.js';
import testUtilStyles from '../../../table/test-classes/styles.selectors.js';

export default class TableWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  private containerWrapper = new ContainerWrapper(this.getElement());

  private findNativeTable(): ElementWrapper {
    return this.find(`.${styles.wrapper} > .${styles.table}`)!;
  }

  private findActiveTHead(): ElementWrapper {
    return this.findByClassName(styles['thead-active'])!;
  }

  findHeaderSlot(): ElementWrapper | null {
    return this.findByClassName(styles['header-controls']);
  }

  /**
   * Alias for findHeaderSlot method for compatibility with previous versions
   * @deprecated
   */
  findHeaderRegion(): ElementWrapper | null {
    return this.findHeaderSlot();
  }

  findFooterSlot(): ElementWrapper | null {
    return this.containerWrapper.findFooter();
  }

  /**
   * Returns column header cells from the table's header region.
   *
   * By default, returns all leaf-column headers (`scope="col"`).
   * For tables without column grouping this is equivalent to the previous behavior.
   * For tables with column grouping this excludes group header cells.
   *
   * @param option.groupId When provided, returns only leaf columns belonging to this group
   *   (matched via `data-column-group-id` attribute).
   */
  findColumnHeaders(
    option: {
      groupId?: string;
    } = {}
  ): Array<ElementWrapper> {
    const { groupId } = option;
    if (groupId !== undefined) {
      return this.findActiveTHead().findAll(`th[data-column-group-id="${groupId}"]`);
    }
    return this.findActiveTHead().findAll('tr > *');
  }

  /**
   * Returns the element the user clicks when resizing a column.
   *
   * @param columnIndex 1-based index of the column containing the resizer.
   */
  findColumnResizer(columnIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(
      `:is(th[data-column-index="${columnIndex}"], tr:not([data-group-level]) > th:nth-child(${columnIndex})) .${resizerStyles.resizer}`
    );
  }

  /**
   * Returns a table cell based on given row and column indices.
   *
   * @param rowIndex 1-based index of the row of the cell to select.
   * @param columnIndex 1-based index of the column of the cell to select.
   */
  findBodyCell(rowIndex: number, columnIndex: number): ElementWrapper | null {
    return this.findNativeTable().find(
      `tbody tr:nth-child(${rowIndex}) .${bodyCellStyles['body-cell']}:nth-child(${columnIndex})`
    );
  }

  /**
   * Returns a table cell counter, if defined, based on given row and column indices.
   *
   * @param rowIndex 1-based index of the row of the cell to select.
   * @param columnIndex 1-based index of the column of the cell to select.
   */
  findBodyCellCounter(rowIndex: number, columnIndex: number): ElementWrapper | null {
    return this.findBodyCell(rowIndex, columnIndex)?.find(`.${testUtilStyles['body-cell-counter']}`) ?? null;
  }

  findRows(): Array<ElementWrapper> {
    return this.findNativeTable().findAll(`tr.${styles.row}:not([aria-hidden])`);
  }

  findSelectedRows(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['row-selected']);
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

  /**
   * Returns the clickable sorting area of a column header.
   *
   * @param colIndex 1-based index of the column.
   */
  findColumnSortingArea(colIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(
      `:is(th[data-column-index="${colIndex}"], tr:not([data-group-level]) > *:nth-child(${colIndex})) [role=button]`
    );
  }

  /**
   * Returns the column that is used for ascending sorting.
   */
  findAscSortedColumn(): ElementWrapper | null {
    return this.findNativeTable().findByClassName(headerCellStyles['header-cell-ascending']);
  }

  /**
   * Returns the column that is used for descending sorting.
   */
  findDescSortedColumn(): ElementWrapper | null {
    return this.findNativeTable().findByClassName(headerCellStyles['header-cell-descending']);
  }

  /**
   * Returns the per-column sort menu (kebab dropdown) for the column header at the
   * given index. Only present on tables that opt in to multi-column sorting.
   *
   * @param columnIndex 1-based index of the column.
   */
  findColumnSortMenu(columnIndex: number): TableColumnSortMenuWrapper | null {
    return this.findActiveTHead().findComponent(
      `:is(th[data-column-index="${columnIndex}"], tr:not([data-group-level]) > *:nth-child(${columnIndex})) .${ButtonDropdownWrapper.rootSelector}`,
      TableColumnSortMenuWrapper
    );
  }

  /**
   * Returns the sort priority badge on the column header at the given index.
   * The badge is only rendered when two or more columns participate in a
   * multi-column sort. Returns `null` otherwise.
   *
   * @param columnIndex 1-based index of the column.
   */
  findColumnSortPriorityBadge(columnIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(
      `:is(th[data-column-index="${columnIndex}"], tr:not([data-group-level]) > *:nth-child(${columnIndex})) .${headerCellStyles['sort-priority-badge']}`
    );
  }

  /**
   * Returns the "Clear sort" button rendered in the table header tools area.
   * The button is auto-rendered only when multi-column sorting is enabled and at
   * least one column is sorted. Returns `null` otherwise.
   */
  findClearSort(): ButtonWrapper | null {
    return this.findComponent(`.${styles['tools-clear-sort']} .${ButtonWrapper.rootSelector}`, ButtonWrapper);
  }

  /**
   * Returns a row selection area for a given index.
   *
   * @param rowIndex 1-based index of the row selection area to return.
   */
  findRowSelectionArea(rowIndex: number): ElementWrapper | null {
    return this.findNativeTable().find(`tbody tr:nth-child(${rowIndex}) .${selectionStyles.root}`);
  }

  findSelectAllTrigger(): ElementWrapper | null {
    return this.findActiveTHead().find(`.${selectionStyles.root}`);
  }

  findTextFilter(): TextFilterWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, TextFilterWrapper);
  }

  findPropertyFilter(): PropertyFilterWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, PropertyFilterWrapper);
  }

  findFilterSlot(): ElementWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, ElementWrapper);
  }

  findCollectionPreferences(): CollectionPreferencesWrapper | null {
    return this.findComponent(`.${styles['tools-preferences']}`, CollectionPreferencesWrapper);
  }

  findPagination(): PaginationWrapper | null {
    return this.findComponent(`.${styles['tools-pagination']}`, PaginationWrapper);
  }

  /**
   * Returns the button that activates inline editing for a table cell based on given row and column indices.
   *
   * @param rowIndex 1-based index of the row of the cell to select.
   * @param columnIndex 1-based index of the column of the cell to select.
   */
  findEditCellButton(rowIndex: number, columnIndex: number): ElementWrapper | null {
    return this.findBodyCell(rowIndex, columnIndex)?.findByClassName(bodyCellStyles['body-cell-editor']) ?? null;
  }

  findEditingCell(): ElementWrapper | null {
    return this.findNativeTable().findByClassName(bodyCellStyles['body-cell-edit-active']);
  }

  private _findEditingCellControls(): ElementWrapper | null {
    return this.findEditingCell()?.findByClassName(bodyCellStyles['body-cell-editor-controls']) ?? null;
  }

  findEditingCellSaveButton(): ElementWrapper | null {
    return this._findEditingCellControls()?.find('button[type="submit"]') ?? null;
  }

  findEditingCellCancelButton(): ElementWrapper | null {
    return this._findEditingCellControls()?.find('button:first-child') ?? null;
  }

  /**
   * Returns the expandable row toggle button.
   *
   * @param rowIndex 1-based index of the row.
   */
  findExpandToggle(rowIndex: number): ElementWrapper | null {
    // the file was moved, which changed the hash, so we cannot use old test class anymore.
    const oldSelector = `tbody tr:nth-child(${rowIndex}) .awsui_expand-toggle_1ss49_1w02f_153`;
    const newSelector = `tbody tr:nth-child(${rowIndex}) .${expandToggleStyles['expand-toggle']}`;
    return this.findNativeTable().findAny(oldSelector, newSelector);
  }

  /**
   * Returns `true` if the row expand toggle is present and expanded. Returns `false` otherwise.
   *
   * @param rowIndex 1-based index of the row.
   */
  @usesDom
  isRowToggled(rowIndex: number): boolean {
    return this.findExpandToggle(rowIndex)?.getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * Returns items loader of the root table level.
   */
  findRootItemsLoader(): null | ElementWrapper {
    const selector = `.${progressiveLoadingStyles['items-loader']}[data-root="true"]`;
    return this.find(selector);
  }

  /**
   * Returns items loader of the specific item (matched by item's track ID).
   *
   * @param itemId the (expandable) item ID provided with `trackBy` property.
   *
   * Note: when used with collection-hooks the `trackBy` is set automatically from `expandableRows.getId`.
   */
  findItemsLoaderByItemId(itemId: string): null | ElementWrapper {
    const selector = `.${progressiveLoadingStyles['items-loader']}[data-parentrow="${itemId}"]`;
    return this.find(selector);
  }
}

/**
 * Wraps the per-column sort menu (kebab dropdown) used by multi-column sorting.
 *
 * Extends `ButtonDropdownWrapper` with named finders for each sort action, so
 * tests don't depend on the dropdown item IDs (an internal implementation
 * detail). Call `openDropdown()` before using the item finders.
 */
export class TableColumnSortMenuWrapper extends ButtonDropdownWrapper {
  /**
   * Returns the "Sort ascending" menu item.
   *
   * Supported options:
   * * `disabled` (boolean) - Use it to find the disabled or non-disabled item.
   */
  findSortAscendingItem(options: { disabled?: boolean } = {}): ElementWrapper | null {
    return this.findItemById('sort-ascending', options);
  }

  /**
   * Returns the "Sort descending" menu item.
   *
   * Supported options:
   * * `disabled` (boolean) - Use it to find the disabled or non-disabled item.
   */
  findSortDescendingItem(options: { disabled?: boolean } = {}): ElementWrapper | null {
    return this.findItemById('sort-descending', options);
  }

  /**
   * Returns the "Add to sort (ascending)" menu item.
   *
   * Supported options:
   * * `disabled` (boolean) - Use it to find the disabled or non-disabled item.
   */
  findAddToSortAscendingItem(options: { disabled?: boolean } = {}): ElementWrapper | null {
    return this.findItemById('add-to-sort-ascending', options);
  }

  /**
   * Returns the "Add to sort (descending)" menu item.
   *
   * Supported options:
   * * `disabled` (boolean) - Use it to find the disabled or non-disabled item.
   */
  findAddToSortDescendingItem(options: { disabled?: boolean } = {}): ElementWrapper | null {
    return this.findItemById('add-to-sort-descending', options);
  }

  /**
   * Returns the "Remove from sort" menu item.
   *
   * Supported options:
   * * `disabled` (boolean) - Use it to find the disabled or non-disabled item.
   */
  findRemoveFromSortItem(options: { disabled?: boolean } = {}): ElementWrapper | null {
    return this.findItemById('remove-from-sort', options);
  }
}
