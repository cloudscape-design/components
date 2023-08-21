// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { getVisualContextClassname } from '../internal/components/visual-context';
import InternalContainer from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from './tools-header';
import Thead, { TheadProps } from './thead';
import { TableBodyCell } from './body-cell';
import InternalStatusIndicator from '../status-indicator/internal';
import { supportsStickyPosition } from '../internal/utils/dom';
import SelectionControl from './selection-control';
import { checkSortingState, getColumnKey, getItemKey, getVisibleColumnDefinitions, toContainerVariant } from './utils';
import { useRowEvents } from './use-row-events';
import { focusMarkers, useSelection } from './use-selection';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { ColumnWidthDefinition, ColumnWidthsProvider, DEFAULT_COLUMN_WIDTH } from './use-column-widths';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { ResizeTracker } from './resizer';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import LiveRegion from '../internal/components/live-region';
import { SomeRequired } from '../internal/types';
import { TableTdElement } from './body-cell/td-element';
import { useStickyColumns } from './sticky-columns';
import { StickyScrollbar } from './sticky-scrollbar';
import { checkColumnWidths } from './column-widths-utils';
import { useMobile } from '../internal/hooks/use-mobile';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { getTableRoleProps, getTableRowRoleProps, getTableWrapperRoleProps, useGridNavigation } from './table-role';
import { useCellEditing } from './use-cell-editing';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { CollectionLabelContext } from '../internal/context/collection-label-context';

const GRID_NAVIGATION_PAGE_SIZE = 10;
const SELECTION_COLUMN_WIDTH = 54;
const selectionColumnId = Symbol('selection-column-id');

type InternalTableProps<T> = SomeRequired<TableProps<T>, 'items' | 'selectedItems' | 'variant'> &
  InternalBaseComponentProps;

const InternalTable = React.forwardRef(
  <T,>(
    {
      header,
      footer,
      empty,
      filter,
      pagination,
      preferences,
      items,
      columnDefinitions,
      trackBy,
      loading,
      loadingText,
      selectionType,
      selectedItems,
      isItemDisabled,
      ariaLabels,
      onSelectionChange,
      onSortingChange,
      sortingColumn,
      sortingDescending,
      sortingDisabled,
      visibleColumns,
      stickyHeader,
      stickyHeaderVerticalOffset,
      onRowClick,
      onRowContextMenu,
      wrapLines,
      stripedRows,
      contentDensity,
      submitEdit,
      onEditCancel,
      resizableColumns,
      onColumnWidthsChange,
      variant,
      __internalRootRef,
      totalItemsCount,
      firstIndex,
      renderAriaLive,
      stickyColumns,
      columnDisplay,
      tableRole: externalTableRole,
      ...rest
    }: InternalTableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    stickyHeader = stickyHeader && supportsStickyPosition();
    const isMobile = useMobile();

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
    const wrapperRefObject = useRef(null);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
    const tableRefObject = useRef(null);

    const secondaryWrapperRef = React.useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = React.useRef<StickyHeaderRef>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const { cancelEdit, ...cellEditing } = useCellEditing({ onCancel: onEditCancel, onSubmit: submitEdit });

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined),
        cancelEdit,
      }),
      [cancelEdit]
    );

    const handleScroll = useScrollSync([wrapperRefObject, scrollbarRef, secondaryWrapperRef]);

    const { onRowClickHandler, onRowContextMenuHandler } = useRowEvents({ onRowClick, onRowContextMenu });

    const visibleColumnDefinitions = getVisibleColumnDefinitions({
      columnDefinitions,
      columnDisplay,
      visibleColumns,
    });

    const { isItemSelected, getSelectAllProps, getItemSelectionProps, updateShiftToggle } = useSelection({
      items,
      trackBy,
      selectedItems,
      selectionType,
      isItemDisabled,
      onSelectionChange,
      ariaLabels,
      loading,
    });

    if (isDevelopment) {
      if (resizableColumns) {
        checkColumnWidths(columnDefinitions);
      }
      if (sortingColumn?.sortingComparator) {
        checkSortingState(columnDefinitions, sortingColumn.sortingComparator);
      }
    }

    const isVisualRefresh = useVisualRefresh();
    const computedVariant = isVisualRefresh
      ? variant
      : ['embedded', 'full-page'].indexOf(variant) > -1
      ? 'container'
      : variant;
    const hasHeader = !!(header || filter || pagination || preferences);
    const hasSelection = !!selectionType;
    const hasFooterPagination = isMobile && variant === 'full-page' && !!pagination;
    const hasFooter = !!footer || hasFooterPagination;

    const headerIdRef = useRef<string | undefined>(undefined);
    const isLabelledByHeader = !ariaLabels?.tableLabel && !!header;
    const setHeaderRef = useCallback((id: string) => {
      headerIdRef.current = id;
    }, []);

    const visibleColumnWidthsWithSelection: ColumnWidthDefinition[] = [];
    const visibleColumnIdsWithSelection: PropertyKey[] = [];
    if (hasSelection) {
      visibleColumnWidthsWithSelection.push({ id: selectionColumnId, width: SELECTION_COLUMN_WIDTH });
      visibleColumnIdsWithSelection.push(selectionColumnId);
    }
    for (let columnIndex = 0; columnIndex < visibleColumnDefinitions.length; columnIndex++) {
      const columnId = getColumnKey(visibleColumnDefinitions[columnIndex], columnIndex);
      visibleColumnWidthsWithSelection.push({ ...visibleColumnDefinitions[columnIndex], id: columnId });
      visibleColumnIdsWithSelection.push(columnId);
    }

    const stickyState = useStickyColumns({
      visibleColumns: visibleColumnIdsWithSelection,
      stickyColumnsFirst: (stickyColumns?.first ?? 0) + (stickyColumns?.first && hasSelection ? 1 : 0),
      stickyColumnsLast: stickyColumns?.last || 0,
    });

    const hasStickyColumns = !!((stickyColumns?.first ?? 0) + (stickyColumns?.last ?? 0) > 0);

    const hasEditableCells = !!columnDefinitions.find(col => col.editConfig);
    const tableRole =
      externalTableRole === 'grid' ? 'grid' : hasEditableCells || !!selectionType ? 'grid-default' : 'table';

    useGridNavigation({ tableRole, pageSize: GRID_NAVIGATION_PAGE_SIZE, getTable: () => tableRefObject.current });

    const theadProps: TheadProps = {
      containerWidth,
      selectionType,
      getSelectAllProps,
      columnDefinitions: visibleColumnDefinitions,
      variant: computedVariant,
      wrapLines,
      resizableColumns,
      sortingColumn,
      sortingDisabled,
      sortingDescending,
      onSortingChange,
      onResizeFinish(newWidth) {
        const widthsDetail = columnDefinitions.map(
          (column, index) => newWidth[getColumnKey(column, index)] || (column.width as number) || DEFAULT_COLUMN_WIDTH
        );
        const widthsChanged = widthsDetail.some((width, index) => columnDefinitions[index].width !== width);
        if (widthsChanged) {
          fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsDetail });
        }
      },
      singleSelectionHeaderAriaLabel: ariaLabels?.selectionGroupLabel,
      stripedRows,
      stickyState,
      selectionColumnId,
      tableRole,
    };

    const wrapperRef = useMergeRefs(wrapperMeasureRef, wrapperRefObject, stickyState.refs.wrapper);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject, stickyState.refs.table);

    const wrapperProps = getTableWrapperRoleProps({
      tableRole,
      isScrollable: !!(tableWidth && containerWidth && tableWidth > containerWidth),
      ariaLabel: ariaLabels?.tableLabel,
    });

    const getMouseDownTarget = useMouseDownTarget();

    const hasDynamicHeight = computedVariant === 'full-page';
    const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight });
    const toolsHeaderWrapper = useRef(null);
    // If is mobile, we take into consideration the AppLayout's mobile bar and we subtract the tools wrapper height so only the table header is sticky
    const toolsHeaderHeight =
      (toolsHeaderWrapper?.current as HTMLDivElement | null)?.getBoundingClientRect().height ?? 0;

    const totalColumnsCount = selectionType ? visibleColumnDefinitions.length + 1 : visibleColumnDefinitions.length;

    return (
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <ColumnWidthsProvider visibleColumns={visibleColumnWidthsWithSelection} resizableColumns={resizableColumns}>
          <InternalContainer
            {...baseProps}
            __internalRootRef={__internalRootRef}
            className={clsx(baseProps.className, styles.root)}
            header={
              <>
                {hasHeader && (
                  <div
                    ref={overlapElement}
                    className={clsx(hasDynamicHeight && [styles['dark-header'], 'awsui-context-content-header'])}
                  >
                    <div
                      ref={toolsHeaderWrapper}
                      className={clsx(styles['header-controls'], styles[`variant-${computedVariant}`])}
                    >
                      <CollectionLabelContext.Provider value={{ assignId: setHeaderRef }}>
                        <ToolsHeader
                          header={header}
                          filter={filter}
                          pagination={pagination}
                          preferences={preferences}
                        />
                      </CollectionLabelContext.Provider>
                    </div>
                  </div>
                )}
                {stickyHeader && (
                  <StickyHeader
                    ref={stickyHeaderRef}
                    variant={computedVariant}
                    theadProps={theadProps}
                    wrapperRef={wrapperRefObject}
                    theadRef={theadRef}
                    secondaryWrapperRef={secondaryWrapperRef}
                    tableRef={tableRefObject}
                    onScroll={handleScroll}
                    tableHasHeader={hasHeader}
                    contentDensity={contentDensity}
                    tableRole={tableRole}
                  />
                )}
              </>
            }
            disableHeaderPaddings={true}
            disableContentPaddings={true}
            variant={toContainerVariant(computedVariant)}
            __disableFooterPaddings={true}
            __disableFooterDivider={true}
            __disableStickyMobile={false}
            footer={
              hasFooter ? (
                <div className={clsx(styles['footer-wrapper'], styles[`variant-${computedVariant}`])}>
                  <div className={clsx(styles.footer, hasFooterPagination && styles['footer-with-pagination'])}>
                    {footer && <span>{footer}</span>}
                    {hasFooterPagination && <div className={styles['footer-pagination']}>{pagination}</div>}
                  </div>
                </div>
              ) : null
            }
            __stickyHeader={stickyHeader}
            __mobileStickyOffset={toolsHeaderHeight}
            __stickyOffset={stickyHeaderVerticalOffset}
            {...focusMarkers.root}
          >
            <div
              ref={wrapperRef}
              className={clsx(styles.wrapper, styles[`variant-${computedVariant}`], {
                [styles['has-footer']]: hasFooter,
                [styles['has-header']]: hasHeader,
              })}
              style={stickyState.style.wrapper}
              onScroll={handleScroll}
              {...wrapperProps}
            >
              {!!renderAriaLive && !!firstIndex && (
                <LiveRegion>
                  <span>
                    {renderAriaLive({ totalItemsCount, firstIndex, lastIndex: firstIndex + items.length - 1 })}
                  </span>
                </LiveRegion>
              )}
              <table
                ref={tableRef}
                className={clsx(
                  styles.table,
                  resizableColumns && styles['table-layout-fixed'],
                  contentDensity === 'compact' && getVisualContextClassname('compact-table')
                )}
                {...getTableRoleProps({
                  tableRole,
                  totalItemsCount,
                  totalColumnsCount: totalColumnsCount,
                  ariaLabel: ariaLabels?.tableLabel,
                  ariaLabelledBy: isLabelledByHeader && headerIdRef.current ? headerIdRef.current : undefined,
                })}
              >
                <Thead
                  ref={theadRef}
                  hidden={stickyHeader}
                  onFocusedComponentChange={component => stickyHeaderRef.current?.setFocus(component)}
                  {...theadProps}
                />
                <tbody>
                  {loading || items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={totalColumnsCount}
                        className={clsx(styles['cell-merged'], hasFooter && styles['has-footer'])}
                      >
                        <div
                          className={styles['cell-merged-content']}
                          style={{
                            width:
                              (supportsStickyPosition() && containerWidth && Math.floor(containerWidth)) || undefined,
                          }}
                        >
                          {loading ? (
                            <InternalStatusIndicator type="loading" className={styles.loading} wrapText={true}>
                              <LiveRegion visible={true}>{loadingText}</LiveRegion>
                            </InternalStatusIndicator>
                          ) : (
                            <div className={styles.empty}>{empty}</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, rowIndex) => {
                      const firstVisible = rowIndex === 0;
                      const lastVisible = rowIndex === items.length - 1;
                      const isEven = rowIndex % 2 === 0;
                      const isSelected = !!selectionType && isItemSelected(item);
                      const isPrevSelected = !!selectionType && !firstVisible && isItemSelected(items[rowIndex - 1]);
                      const isNextSelected = !!selectionType && !lastVisible && isItemSelected(items[rowIndex + 1]);
                      return (
                        <tr
                          key={getItemKey(trackBy, item, rowIndex)}
                          className={clsx(styles.row, isSelected && styles['row-selected'])}
                          onFocus={({ currentTarget }) => {
                            // When an element inside table row receives focus we want to adjust the scroll.
                            // However, that behaviour is unwanted when the focus is received as result of a click
                            // as it causes the click to never reach the target element.
                            if (!currentTarget.contains(getMouseDownTarget())) {
                              stickyHeaderRef.current?.scrollToRow(currentTarget);
                            }
                          }}
                          {...focusMarkers.item}
                          onClick={onRowClickHandler && onRowClickHandler.bind(null, rowIndex, item)}
                          onContextMenu={onRowContextMenuHandler && onRowContextMenuHandler.bind(null, rowIndex, item)}
                          {...getTableRowRoleProps({ tableRole, firstIndex, rowIndex })}
                        >
                          {selectionType !== undefined && (
                            <TableTdElement
                              className={clsx(styles['selection-control'])}
                              isVisualRefresh={isVisualRefresh}
                              isFirstRow={firstVisible}
                              isLastRow={lastVisible}
                              isSelected={isSelected}
                              isNextSelected={isNextSelected}
                              isPrevSelected={isPrevSelected}
                              wrapLines={false}
                              isEvenRow={isEven}
                              stripedRows={stripedRows}
                              hasSelection={hasSelection}
                              hasFooter={hasFooter}
                              stickyState={stickyState}
                              columnId={selectionColumnId}
                              colIndex={0}
                              tableRole={tableRole}
                            >
                              <SelectionControl onShiftToggle={updateShiftToggle} {...getItemSelectionProps(item)} />
                            </TableTdElement>
                          )}
                          {visibleColumnDefinitions.map((column, colIndex) => {
                            const isEditing = cellEditing.checkEditing({ rowIndex, colIndex });
                            const successfulEdit = cellEditing.checkLastSuccessfulEdit({ rowIndex, colIndex });
                            const isEditable = !!column.editConfig && !cellEditing.isLoading;
                            return (
                              <TableBodyCell
                                key={getColumnKey(column, colIndex)}
                                style={
                                  resizableColumns
                                    ? {}
                                    : {
                                        width: column.width,
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                      }
                                }
                                ariaLabels={ariaLabels}
                                column={column}
                                item={item}
                                wrapLines={wrapLines}
                                isEditable={isEditable}
                                isEditing={isEditing}
                                isRowHeader={column.isRowHeader}
                                isFirstRow={firstVisible}
                                isLastRow={lastVisible}
                                isSelected={isSelected}
                                isNextSelected={isNextSelected}
                                isPrevSelected={isPrevSelected}
                                successfulEdit={successfulEdit}
                                onEditStart={() => cellEditing.startEdit({ rowIndex, colIndex })}
                                onEditEnd={editCancelled =>
                                  cellEditing.completeEdit({ rowIndex, colIndex }, editCancelled)
                                }
                                submitEdit={cellEditing.submitEdit}
                                hasFooter={hasFooter}
                                stripedRows={stripedRows}
                                isEvenRow={isEven}
                                columnId={column.id ?? colIndex}
                                colIndex={selectionType !== undefined ? colIndex + 1 : colIndex}
                                stickyState={stickyState}
                                isVisualRefresh={isVisualRefresh}
                                tableRole={tableRole}
                                isWidget={column.isWidget?.(item) ?? tableRole === 'grid-default'}
                              />
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {resizableColumns && <ResizeTracker />}
            </div>
            <StickyScrollbar
              ref={scrollbarRef}
              wrapperRef={wrapperRefObject}
              tableRef={tableRefObject}
              onScroll={handleScroll}
              offsetScrollbar={hasStickyColumns}
            />
          </InternalContainer>
        </ColumnWidthsProvider>
      </LinkDefaultVariantContext.Provider>
    );
  }
) as TableForwardRefType;

export default InternalTable;
