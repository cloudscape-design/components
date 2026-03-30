// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

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

  /**
   * Returns the header slot of the table.
   */
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

  /**
   * Returns the footer slot of the table.
   */
  findFooterSlot(): ElementWrapper | null {
    return this.containerWrapper.findFooter();
  }

  /**
   * Returns column header cells from the table's header region.
   *
   * By default, returns all cells in the last header row (leaf columns).
   * For tables without column grouping this is equivalent to querying all `<th>` elements.
   * For tables with column grouping this returns only the leaf-level column headers,
   * not the group header cells above them.
   *
   * Both `level` and `groupId` can be combined to narrow the result set.
   *
   * @param option.level 1-based index of the header row to query. Level 1 is the topmost row
   *   (group headers); the last level is always the leaf-column row. Defaults to the last row.
   * @param option.groupId ID of the parent group whose direct child columns to return.
   *   Uses the `data-column-group-id` attribute set on each leaf `<th>` by the renderer.
   */
  findColumnHeaders(
    option: {
      groupId?: string;
      level?: number;
    } = {}
  ): Array<ElementWrapper> {
    const { groupId, level } = option;
    const parts: string[] = [];

    // Row selector
    if (level !== undefined) {
      parts.push(`tr:nth-child(${level}) > `);
    } else if (groupId === undefined) {
      parts.push('tr:last-child > ');
    }

    // Element selector
    if (groupId !== undefined) {
      parts.push(`th[data-column-group-id="${groupId}"]`);
    } else {
      parts.push('*');
    }

    return this.findActiveTHead().findAll(parts.join(''));
  }

  /**
   * Returns the element the user clicks when resizing a column.
   *
   * Targets leaf-column headers (`scope="col"`), which reliably identifies
   * individual columns regardless of which `<tr>` they appear in. In grouped
   * tables, leaf columns may span multiple rows and sit in an earlier `<tr>`
   * rather than the last one.
   *
   * @param columnIndex 1-based index of the leaf column containing the resizer.
   */
  findColumnResizer(columnIndex: number): ElementWrapper | null {
    const leafHeaders = this.findActiveTHead().findAll('th[scope="col"]');
    const header = leafHeaders[columnIndex - 1];
    return header?.find(`.${resizerStyles.resizer}`) ?? null;
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

  /**
   * Returns all table rows within the table body.
   */
  findRows(): Array<ElementWrapper> {
    return this.findNativeTable().findAllByClassName(styles.row);
  }

  /**
   * Returns all selected table rows.
   */
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

  /**
   * Returns the empty state slot of the table.
   */
  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }

  /**
   * Returns the loading text element of the table.
   */
  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }

  /**
   * Returns the clickable sorting area of a column header.
   * Targets the leaf-column header row by default.
   *
   * @param colIndex 1-based index of the column.
   */
  findColumnSortingArea(colIndex: number): ElementWrapper | null {
    return this.findActiveTHead().find(`tr:last-child > *:nth-child(${colIndex}) [role=button]`);
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

  /**
   * Returns the "select all" checkbox or radio button in the table header.
   */
  findSelectAllTrigger(): ElementWrapper | null {
    return this.findActiveTHead().find(`.${selectionStyles.root}`);
  }

  /**
   * Returns the text filter component used in the table.
   */
  findTextFilter(): TextFilterWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, TextFilterWrapper);
  }

  /**
   * Returns the property filter component used in the table.
   */
  findPropertyFilter(): PropertyFilterWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, PropertyFilterWrapper);
  }

  /**
   * Returns the filter slot of the table.
   */
  findFilterSlot(): ElementWrapper | null {
    return this.findComponent(`.${styles['tools-filtering']}`, ElementWrapper);
  }

  /**
   * Returns the collection preferences component used in the table.
   */
  findCollectionPreferences(): CollectionPreferencesWrapper | null {
    return this.findComponent(`.${styles['tools-preferences']}`, CollectionPreferencesWrapper);
  }

  /**
   * Returns the pagination component used in the table.
   */
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

  /**
   * Returns the currently active inline editing cell.
   */
  findEditingCell(): ElementWrapper | null {
    return this.findNativeTable().findByClassName(bodyCellStyles['body-cell-edit-active']);
  }

  private _findEditingCellControls(): ElementWrapper | null {
    return this.findEditingCell()?.findByClassName(bodyCellStyles['body-cell-editor-controls']) ?? null;
  }

  /**
   * Returns the save button of the currently active inline editing cell.
   */
  findEditingCellSaveButton(): ElementWrapper | null {
    return this._findEditingCellControls()?.find('button[type="submit"]') ?? null;
  }

  /**
   * Returns the cancel button of the currently active inline editing cell.
   */
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
