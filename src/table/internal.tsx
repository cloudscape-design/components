// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { getVisualContextClassname } from '../internal/components/visual-context';
import InternalContainer from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from './tools-header';
import Thead, { TheadProps } from './thead';
import { TableBodyCell } from './body-cell';
import InternalStatusIndicator from '../status-indicator/internal';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { supportsStickyPosition } from '../internal/utils/dom';
import SelectionControl from './selection-control';
import { checkSortingState, getColumnKey, getItemKey, getVisibleColumnDefinitions, toContainerVariant } from './utils';
import { useRowEvents } from './use-row-events';
import { focusMarkers, useFocusMove, useSelection } from './use-selection';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { checkColumnWidths, ColumnWidthsProvider, DEFAULT_WIDTH } from './use-column-widths';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { ResizeTracker } from './resizer';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import StickyScrollbar from './sticky-scrollbar';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import LiveRegion from '../internal/components/live-region';
import useTableFocusNavigation from './use-table-focus-navigation';
import { SomeRequired } from '../internal/types';
import { TableTdElement } from './body-cell/td-element';
import { useStickyColumns, selectionColumnId } from './use-sticky-columns';

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
      ...rest
    }: InternalTableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    stickyHeader = stickyHeader && supportsStickyPosition();

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const wrapperRefObject = useRef(null);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const tableRefObject = useRef(null);

    const secondaryWrapperRef = React.useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = React.useRef<StickyHeaderRef>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const [currentEditCell, setCurrentEditCell] = useState<[number, number] | null>(null);
    const [lastSuccessfulEditCell, setLastSuccessfulEditCell] = useState<[number, number] | null>(null);
    const [currentEditLoading, setCurrentEditLoading] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined),
        cancelEdit: () => setCurrentEditCell(null),
      }),
      []
    );

    const handleScroll = useScrollSync([wrapperRefObject, scrollbarRef, secondaryWrapperRef]);

    const { moveFocusDown, moveFocusUp, moveFocus } = useFocusMove(selectionType, items.length);
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
    const hasFooter = !!footer;

    const noStickyColumns = !stickyColumns?.first && !stickyColumns?.last;

    const visibleColumnsWithSelection = useMemo(() => {
      const columnIds = visibleColumnDefinitions.map((it, index) => it.id ?? index.toString());
      return hasSelection ? [selectionColumnId.toString(), ...columnIds] : columnIds ?? [];
    }, [visibleColumnDefinitions, hasSelection]);

    const stickyState = useStickyColumns({
      visibleColumns: visibleColumnsWithSelection,
      stickyColumnsFirst: noStickyColumns ? 0 : (stickyColumns?.first || 0) + (hasSelection ? 1 : 0),
      stickyColumnsLast: stickyColumns?.last || 0,
    });

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
      onFocusMove: moveFocus,
      onResizeFinish(newWidth) {
        const widthsDetail = columnDefinitions.map(
          (column, index) => newWidth[getColumnKey(column, index)] || (column.width as number) || DEFAULT_WIDTH
        );
        const widthsChanged = widthsDetail.some((width, index) => columnDefinitions[index].width !== width);
        if (widthsChanged) {
          fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsDetail });
        }
      },
      singleSelectionHeaderAriaLabel: ariaLabels?.selectionGroupLabel,
      stripedRows,
      stickyState,
    };

    const wrapperRef = useMergeRefs(wrapperMeasureRef, wrapperRefObject, stickyState.refs.wrapper);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject, stickyState.refs.table);

    // Allows keyboard users to scroll horizontally with arrow keys by making the wrapper part of the tab sequence
    const isWrapperScrollable = tableWidth && containerWidth && tableWidth > containerWidth;
    const wrapperProps = isWrapperScrollable
      ? { role: 'region', tabIndex: 0, 'aria-label': ariaLabels?.tableLabel }
      : {};

    const getMouseDownTarget = useMouseDownTarget();
    const wrapWithInlineLoadingState = (submitEdit: TableProps['submitEdit']) => {
      if (!submitEdit) {
        return undefined;
      }
      return async (...args: Parameters<typeof submitEdit>) => {
        setCurrentEditLoading(true);
        try {
          await submitEdit(...args);
        } finally {
          setCurrentEditLoading(false);
        }
      };
    };

    const hasDynamicHeight = computedVariant === 'full-page';
    const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight });
    useTableFocusNavigation(selectionType, tableRefObject, visibleColumnDefinitions, items?.length);

    const toolsHeaderWrapper = useRef(null);
    // If is mobile, we take into consideration the AppLayout's mobile bar and we subtract the tools wrapper height so only the table header is sticky
    const toolsHeaderHeight =
      (toolsHeaderWrapper?.current as HTMLDivElement | null)?.getBoundingClientRect().height ?? 0;

    return (
      <ColumnWidthsProvider
        tableRef={tableRefObject}
        visibleColumnDefinitions={visibleColumnDefinitions}
        resizableColumns={resizableColumns}
        hasSelection={hasSelection}
      >
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
                    <ToolsHeader header={header} filter={filter} pagination={pagination} preferences={preferences} />
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
            footer && (
              <div className={clsx(styles['footer-wrapper'], styles[`variant-${computedVariant}`])}>
                <div className={styles.footer}>{footer}</div>
              </div>
            )
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
            onScroll={handleScroll}
            {...wrapperProps}
          >
            {!!renderAriaLive && !!firstIndex && (
              <LiveRegion>
                <span>{renderAriaLive({ totalItemsCount, firstIndex, lastIndex: firstIndex + items.length - 1 })}</span>
              </LiveRegion>
            )}
            <table
              ref={tableRef}
              className={clsx(
                styles.table,
                resizableColumns && styles['table-layout-fixed'],
                contentDensity === 'compact' && getVisualContextClassname('compact-table')
              )}
              // Browsers have weird mechanism to guess whether it's a data table or a layout table.
              // If we state explicitly, they get it always correctly even with low number of rows.
              role="table"
              aria-label={ariaLabels?.tableLabel}
              aria-rowcount={totalItemsCount ? totalItemsCount + 1 : -1}
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
                      colSpan={selectionType ? visibleColumnDefinitions.length + 1 : visibleColumnDefinitions.length}
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
                        aria-rowindex={firstIndex ? firstIndex + rowIndex + 1 : undefined}
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
                            columnId={selectionColumnId.toString()}
                          >
                            <SelectionControl
                              onFocusDown={moveFocusDown}
                              onFocusUp={moveFocusUp}
                              onShiftToggle={updateShiftToggle}
                              {...getItemSelectionProps(item)}
                            />
                          </TableTdElement>
                        )}
                        {visibleColumnDefinitions.map((column, colIndex) => {
                          const isEditing =
                            !!currentEditCell && currentEditCell[0] === rowIndex && currentEditCell[1] === colIndex;
                          const successfulEdit =
                            !!lastSuccessfulEditCell &&
                            lastSuccessfulEditCell[0] === rowIndex &&
                            lastSuccessfulEditCell[1] === colIndex;
                          const isEditable = !!column.editConfig && !currentEditLoading;
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
                              onEditStart={() => {
                                setLastSuccessfulEditCell(null);
                                setCurrentEditCell([rowIndex, colIndex]);
                              }}
                              onEditEnd={editCancelled => {
                                const eventCancelled = fireCancelableEvent(onEditCancel, {});
                                if (!eventCancelled) {
                                  setCurrentEditCell(null);
                                  if (!editCancelled) {
                                    setLastSuccessfulEditCell([rowIndex, colIndex]);
                                  }
                                }
                              }}
                              submitEdit={wrapWithInlineLoadingState(submitEdit)}
                              hasFooter={hasFooter}
                              stripedRows={stripedRows}
                              isEvenRow={isEven}
                              columnId={column.id ?? colIndex.toString()}
                              stickyState={stickyState}
                              isVisualRefresh={isVisualRefresh}
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
          />
        </InternalContainer>
      </ColumnWidthsProvider>
    );
  }
) as TableForwardRefType;

export default InternalTable;
