// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../table/styles.selectors.js';
import headerCellStyles from '../../../table/header-cell/styles.selectors.js';
import bodyCellStyles from '../../../table/body-cell/styles.selectors.js';
import selectionStyles from '../../../table/selection/styles.selectors.js';
import resizerStyles from '../../../table/resizer/styles.selectors.js';
import expandableRowsStyles from '../../../table/expandable-rows/styles.selectors.js';
import progressiveLoadingStyles from '../../../table/progressive-loading/styles.selectors.js';
import CollectionPreferencesWrapper from '../collection-preferences';
import ContainerWrapper from '../container';
import PaginationWrapper from '../pagination';
import TextFilterWrapper from '../text-filter';
import PropertyFilterWrapper from '../property-filter';

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

  findColumnHeaders(): Array<ElementWrapper> {
    return this.findActiveTHead().findAll('tr > *');
  }

  /**
   * Returns the element the user clicks when resizing a column.
   *
   * @param columnIndex 1-based index of the column containing the resizer.
   */
  findColumnResizer(columnIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(`th:nth-child(${columnIndex}) .${resizerStyles.resizer}`);
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

  findRows(): Array<ElementWrapper> {
    return this.findNativeTable().findAllByClassName(styles.row);
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

  findColumnSortingArea(colIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(`tr > *:nth-child(${colIndex}) [role=button]`);
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
    return this.findNativeTable().find(`tbody tr:nth-child(${rowIndex}) .${expandableRowsStyles['expand-toggle']}`);
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
