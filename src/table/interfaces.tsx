// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler, CancelableEventHandler } from '../internal/events';
import { Optional } from '../internal/types';

/*
 * HACK: Cast the component to a named parametrized interface.
 *
 * This lets us use React.forwardRef and still let the component have type
 * parameters, and the naming convention lets the documenter know that this is
 * a forwardRef-wrapped component.
 *
 * We don't need to expose this type to customers because it's just a simple
 * function type.
 */
export interface TableForwardRefType {
  <T>(props: TableProps<T> & { ref?: React.Ref<TableProps.Ref> }): JSX.Element;
}

export interface TableProps<T = any> extends BaseComponentProps {
  /**
   * Heading element of the table container. Use the [header component](/components/header/).
   */
  header?: React.ReactNode;

  /**
   * Footer of the table container.
   */
  footer?: React.ReactNode;

  /**
   * Displayed when the `items` property is an empty array. Use it to render an empty or no-match state.
   */
  empty?: React.ReactNode;

  /**
   * Specifies the data that's displayed in the table rows. Each item contains the data for one row. The display of a row is handled
   * by the `cell` property of each column definition in the `columnDefinitions` property.
   */
  items: ReadonlyArray<T>;

  /**
   * Renders the table in a loading state. We recommend that you also set a `loadingText`.
   */
  loading?: boolean;

  /**
   * Specifies the text that's displayed when the table is in a loading state.
   */
  loadingText?: string;

  /**
   * Specifies a property that uniquely identifies an individual item.
   * When it's set, it's used to provide [keys for React](https://reactjs.org/docs/lists-and-keys.html#keys)
   * for performance optimizations.
   *
   * It's also used to connect `items` and `selectedItems` values when they reference different objects.
   */
  trackBy?: TableProps.TrackBy<T>;

  /**
   * The columns configuration object
   * * `id` (string) - Specifies a unique column identifier. The property is used 1) as a [keys](https://reactjs.org/docs/lists-and-keys.html#keys) source for React rendering,
   *   and 2) to match entries in the `visibleColumns` property, if defined.
   * * `header` (ReactNode) - Determines the display of the column header.
   * * `cell` ((item) => ReactNode) - Determines the display of a cell's content. You receive the current table row
   *   item as an argument.
   * * `width` (string | number) - Specifies the column width. Corresponds to the `width` css-property. If the width is not set,
   *   the browser automatically adjusts the column width based on the content. When `resizableColumns` property is
   *   set to `true`, additional constraints apply: 1) string values are not allowed, and 2) the last visible column always
   *   fills the remaining space of the table so the specified width is ignored.
   * * `minWidth` (string | number) - Specifies the minimum column width. Corresponds to the `min-width` css-property. When
   *   `resizableColumns` property is set to `true`, additional constraints apply: 1) string values are not allowed,
   *   and 2) the column can't resize below than the specified width (defaults to "120px"). We recommend that you set a minimum width
   *   of at least 176px for columns that are editable.
   * * `maxWidth` (string | number) - Specifies the maximum column width. Corresponds to the `max-width` css-property.
   *   Note that when the `resizableColumns` property is set to `true` this property is ignored.
   * * `ariaLabel` (LabelData => string) - An optional function that's called to provide an `aria-label` for the cell header.
   *   It receives the current sorting state of this column, the direction it's sorted in, and an indication of
   *   whether the sorting is disabled, as three Boolean values: `sorted`, `descending` and `disabled`.
   *   We recommend that you use this for sortable columns to provide more meaningful labels based on the
   *   current sorting direction.
   * * `sortingField` (string) - Enables default column sorting. The value is used in [collection hooks](/get-started/dev-guides/collection-hooks/)
   *   to reorder the items. Provide the name of the property within each item that should be used for sorting by this column.
   *   For more complex sorting use `sortingComparator` instead.
   * * `sortingComparator` ((T, T) => number) - Enables custom column sorting. The value is used in [collection hooks](/get-started/dev-guides/collection-hooks/)
   *   to reorder the items. This property accepts a custom comparator that is used to compare two items.
   *   The comparator must implement ascending ordering, and the output is inverted automatically in case of descending order.
   *   If present, the `sortingField` property is ignored.
   * * `editConfig` (EditConfig) - Enables inline editing in column when present. The value is used to configure the editing behavior.
   * * * `editConfig.ariaLabel` (string) - Specifies a label for the edit control. Visually hidden but read by screen readers.
   * * * `editConfig.errorIconAriaLabel` (string) - Specifies an ariaLabel for the error icon that is displayed when the validation fails.
   * * * `editConfig.editIconAriaLabel` (string) - Specifies an alternate text for the edit icon used in column header.
   * * * `editConfig.constraintText` (string) - Constraint text that is displayed below the edit control.
   * * * `editConfig.validation` ((item, value) => string) - A function that allows you to validate the value of the edit control.
   *            Return a string from the function to display an error message. Return `undefined` (or no return) from the function to indicate that the value is valid.
   * * * `editConfig.editingCell` ((item, cellContext) => ReactNode) - Determines the display of a cell's content when inline editing is active on a cell;
   *        You receive the current table row `item` and a `cellContext` object as arguments.
   *        The `cellContext` object contains the following properties:
   *  *  * `cellContext.currentValue` - State to keep track of a value in input fields while editing.
   *  *  * `cellContext.setValue` - Function to update `currentValue`. This should be called when the value in input field changes.
   */
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  /**
   * Specifies the selection type (`'single' | 'multi'`).
   */
  selectionType?: TableProps.SelectionType;
  /**
   * List of selected items.
   */
  selectedItems?: ReadonlyArray<T>;

  /**
   * Use this slot to add filtering controls to the table.
   */
  filter?: React.ReactNode;

  /**
   * Use this slot to add the [pagination component](/components/pagination/) to the table.
   */
  pagination?: React.ReactNode;

  /**
   * Use this slot to add [collection preferences](/components/collection-preferences/) to the table.
   */
  preferences?: React.ReactNode;

  /**
   * Determines whether a given item is disabled. If an item is disabled, the user can't select it.
   */
  isItemDisabled?: TableProps.IsItemDisabled<T>;

  /**
   * Specifies if text wraps within table cells. If set to `true`, long text within cells may wrap onto
   * multiple lines instead of being truncated with an ellipsis.
   */
  wrapLines?: boolean;

  /**
   * Specifies if table rows alternate being shaded and unshaded. If set to `true`, every other row will be shaded.
   */
  stripedRows?: boolean;

  /**
   * Specifies if columns can be resized. If set to `true`, users can resize the columns in the table.
   */
  resizableColumns?: boolean;

  /**
   * Specifies alternative text for the selection components (checkboxes and radio buttons) as follows:
   * * `itemSelectionLabel` ((SelectionState, Item) => string) - Specifies the alternative text for an item.
   * * `allItemsSelectionLabel` ((SelectionState) => string) - Specifies the alternative text for multi-selection column header.
   * * `selectionGroupLabel` (string) - Specifies the alternative text for the whole selection and single-selection column header.
   *                                    It is prefixed to `itemSelectionLabel` and `allItemsSelectionLabel` when they are set.
   * * `tableLabel` (string) - Provides an alternative text for the table. If you use a header for this table, you may reuse the string
   *                           to provide a caption-like description. For example, tableLabel=Instances will be announced as 'Instances table'.
   * You can use the first argument of type `SelectionState` to access the current selection
   * state of the component (for example, the `selectedItems` list). The `itemSelectionLabel` for individual
   * items also receives the corresponding  `Item` object. You can use the `selectionGroupLabel` to
   * add a meaningful description to the whole selection.
   *
   * * `activateEditLabel` (EditableColumnDefinition) => string -
   *                      Specifies an alternative text for the edit button in editable cells.
   * * `cancelEditLabel` (EditableColumnDefinition) => string -
   *                      Specifies an alternative text for the cancel button in editable cells.
   * * `submitEditLabel` (EditableColumnDefinition) => string -
   *                      Specifies an alternative text for the submit button in editable cells.
   */
  ariaLabels?: TableProps.AriaLabels<T>;

  /**
   * Specifies the definition object of the currently sorted column. Make sure you pass an object that's
   * present in the `columnDefinitions` array.
   */
  sortingColumn?: TableProps.SortingColumn<T>;
  /**
   * Specifies whether to use a descending sort order.
   */
  sortingDescending?: boolean;
  /**
   * Specifies if sorting buttons are disabled. For example, use this property
   * to prevent the user from sorting before items are fully loaded.
   */
  sortingDisabled?: boolean;

  /**
   * Specifies an array containing the `id`s of visible columns. If not set, all columns are displayed.
   *
   * Use it in conjunction with the visible content preference of the [collection preferences](/components/collection-preferences/) component.
   *
   * The order of ids doesn't influence the order in which columns are displayed - this is dictated by the `columnDefinitions` property
   */
  visibleColumns?: ReadonlyArray<string>;

  /**
   * Fired when the user resizes a table column. The event detail contains an array of column widths in pixels,
   * including the hidden via preferences columns. Use this event to persist the column widths.
   */
  onColumnWidthsChange?: NonCancelableEventHandler<TableProps.ColumnWidthsChangeDetail>;

  /**
   * Called when either the column to sort by or the direction of sorting changes upon user interaction.
   * The event detail contains the current sortingColumn and isDescending.
   */
  onSortingChange?: NonCancelableEventHandler<TableProps.SortingState<T>>;

  /**
   * Fired when a user interaction triggers a change in the list of selected items.
   * The event `detail` contains the current list of `selectedItems`.
   */
  onSelectionChange?: NonCancelableEventHandler<TableProps.SelectionChangeDetail<T>>;

  /**
   * Note: This feature is provided for backwards compatibility. Its use is not recommended,
   * and it may be deprecated in the future.
   *
   * Called when the user clicked at a table row. The event detail contains the index of the
   * clicked row and the row object itself. Use this event to define a row click behavior.
   */
  onRowClick?: NonCancelableEventHandler<TableProps.OnRowClickDetail<T>>;

  /**
   * Note: This feature is provided for backwards compatibility. Its use is not recommended,
   * and it may be deprecated in the future.
   *
   * Called when the user clicked at a table row with the right mouse click. The event detail
   * contains the index of the clicked row and the row object itself. Use this event to override
   * the default browser context menu behavior.
   */
  onRowContextMenu?: CancelableEventHandler<TableProps.OnRowContextMenuDetail<T>>;

  /**
   * If set to `true`, the table header remains visible when the user scrolls down.
   */
  stickyHeader?: boolean;

  /**
   * Specifies a vertical offset (in pixels) for the sticky header. For example, use this if you
   * need to position the sticky header below other fixed position elements on the page.
   */
  stickyHeaderVerticalOffset?: number;

  /**
   * Specify a table variant with one of the following:
   * * `container` - Use this variant to have the table displayed within a container.
   * * `embedded` - Use this variant within a parent container (such as a modal, expandable
   *                section, container or split panel).
   * * `stacked` - Use this variant adjacent to other stacked containers (such as a container,
   *               table).
   * * `full-page` – Use this variant when table is the primary element on the page.
   * @visualrefresh `embedded`, `stacked`, and `full-page` variants
   */
  variant?: TableProps.Variant;

  /**
   * Use this property to inform screen readers how many items there are in a table.
   * It specifies the total count of all items in a table.
   * If there is an unknown total of items in a table, leave this property undefined.   */
  totalItemsCount?: number;
  /**
   *  Use this property to inform screen readers which range of items is currently displayed in the table.
   *  It specifies the index (1-based) of the first item in the table.
   *  If the table has no pagination, leave this property undefined.   */
  firstIndex?: number;
  /**
   * Use this function to announce page changes to screen reader users.
   * Requires the properties firstIndex and totalItemsCount to be set correctly.
   */
  renderAriaLive?: (data: TableProps.LiveAnnouncement) => string;
  /**
   * Specifies a function that will be called after user submits an inline edit.
   * Return a promise to keep loading state while the submit request is in progress.
   */
  submitEdit?: TableProps.SubmitEditFunction<T>;

  /**
   * Called whenever user cancels an inline edit. Use this function to reset any
   * validation states, or show warning for unsaved changes.
   */
  onEditCancel?: CancelableEventHandler;
}

export namespace TableProps {
  export type TrackBy<T> = string | ((item: T) => string);

  export interface CellContext<V> {
    currentValue: Optional<V>;
    setValue: (value: V | undefined) => void;
  }

  export interface EditConfig<T, V = any> {
    /**
     * Specifies a label for the edit control. Visually hidden but read
     * by screen readers.
     */
    ariaLabel?: string;
    /**
     * Specifies an ariaLabel for the error icon that is displayed when
     * the validation fails.
     */
    errorIconAriaLabel?: string;
    /**
     * Specifies an alternate text for the edit icon used in column header.
     */
    editIconAriaLabel?: string;
    /**
     * Constraint text that is displayed below the edit control.
     */
    constraintText?: string;
    /**
     * A function that allows you to validate the value of the edit control. Return
     * a string from the function to display an error message. Return
     * `undefined` (or no return) from the function to indicate that the value is valid.
     * @param item - The item that is being edited.
     * @param value - The current value of the edit control.
     */
    validation?: (item: T, value: Optional<V>) => Optional<string>;

    /**
     * Determines the display of a cell's content when inline edit is active.
     */
    editingCell(item: T, ctx: TableProps.CellContext<any>): React.ReactNode;
  }

  export type ColumnDefinition<ItemType> = {
    id?: string;
    header: React.ReactNode;
    ariaLabel?(data: LabelData): string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    editConfig?: EditConfig<ItemType>;
    cell(item: ItemType): React.ReactNode;
  } & SortingColumn<ItemType>;

  export type SelectionType = 'single' | 'multi';
  export type Variant = 'container' | 'embedded' | 'stacked' | 'full-page';
  export interface SelectionState<T> {
    selectedItems: ReadonlyArray<T>;
  }
  export interface SelectionChangeDetail<T> {
    selectedItems: T[];
  }
  export type IsItemDisabled<T> = (item: T) => boolean;
  export interface AriaLabels<T> {
    allItemsSelectionLabel?: (data: TableProps.SelectionState<T>) => string;
    itemSelectionLabel?: (data: TableProps.SelectionState<T>, row: T) => string;
    selectionGroupLabel?: string;
    tableLabel?: string;
    // do not use <T> to prevent overly strict validation on consumer end
    // it works, practically, we are only interested in `id` and `header` properties only
    activateEditLabel?: (column: ColumnDefinition<any>) => string;
    cancelEditLabel?: (column: ColumnDefinition<any>) => string;
    submitEditLabel?: (column: ColumnDefinition<any>) => string;
  }
  export interface SortingState<T> {
    isDescending?: boolean;
    sortingColumn: SortingColumn<T>;
  }
  export interface SortingColumn<T> {
    sortingField?: string;
    sortingComparator?: (a: T, b: T) => number;
  }
  export interface LabelData {
    sorted: boolean;
    descending: boolean;
    disabled: boolean;
  }
  export interface OnRowClickDetail<T> {
    rowIndex: number;
    item: T;
  }
  export interface OnRowContextMenuDetail<T> {
    rowIndex: number;
    item: T;
    clientX: number;
    clientY: number;
  }

  export interface ColumnWidthsChangeDetail {
    widths: ReadonlyArray<number>;
  }

  export interface LiveAnnouncement {
    totalItemsCount?: number;
    firstIndex: number;
    lastIndex: number;
  }

  export interface Ref {
    /**
     * When the sticky header is enabled and you call this function, the table
     * scroll parent scrolls to reveal the first row of the table.
     */
    scrollToTop(): void;

    /**
     * Dismiss an inline edit if currently active.
     */
    cancelEdit?(): void;
  }

  export type SubmitEditFunction<ItemType, ValueType = unknown> = (
    item: ItemType,
    column: ColumnDefinition<ItemType>,
    newValue: ValueType
  ) => Promise<void> | void;
}
