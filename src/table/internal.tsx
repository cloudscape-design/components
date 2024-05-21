// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { getVisualContextClassname } from '../internal/components/visual-context';
import InternalContainer, { InternalContainerProps } from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from './tools-header';
import Thead, { TheadProps } from './thead';
import { TableBodyCell } from './body-cell';
import { supportsStickyPosition } from '../internal/utils/dom';
import { checkSortingState, getColumnKey, getItemKey, getVisibleColumnDefinitions, toContainerVariant } from './utils';
import { useRowEvents } from './use-row-events';
import { SelectionControl, focusMarkers, useSelectionFocusMove, useSelection } from './selection';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { ColumnWidthDefinition, ColumnWidthsProvider, DEFAULT_COLUMN_WIDTH } from './use-column-widths';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { ResizeTracker } from './resizer';
import styles from './styles.css.js';
import headerStyles from '../header/styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import LiveRegion from '../internal/components/live-region';
import useTableFocusNavigation from './use-table-focus-navigation';
import { SomeRequired } from '../internal/types';
import { TableTdElement } from './body-cell/td-element';
import { useStickyColumns } from './sticky-columns';
import { StickyScrollbar } from './sticky-scrollbar';
import { checkColumnWidths } from './column-widths-utils';
import { useMobile } from '../internal/hooks/use-mobile';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import {
  GridNavigationProvider,
  TableRole,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
} from './table-role';
import { useCellEditing } from './use-cell-editing';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { NoDataCell } from './no-data-cell';
import { usePerformanceMarks } from '../internal/hooks/use-performance-marks';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';
import { useExpandableTableProps } from './expandable-rows/expandable-rows-utils';
import { usePrevious } from '../internal/hooks/use-previous';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

const GRID_NAVIGATION_PAGE_SIZE = 10;
const SELECTION_COLUMN_WIDTH = 54;
const selectionColumnId = Symbol('selection-column-id');

type InternalTableProps<T> = SomeRequired<TableProps<T>, 'items' | 'selectedItems' | 'variant' | 'firstIndex'> &
  InternalBaseComponentProps & {
    __funnelSubStepProps?: InternalContainerProps['__funnelSubStepProps'];
  };

export const InternalTableAsSubstep = React.forwardRef(
  <T,>(props: InternalTableProps<T>, ref: React.Ref<TableProps.Ref>) => {
    const { funnelSubStepProps } = useFunnelSubStep();

    const tableProps: InternalTableProps<T> = {
      ...props,
      __funnelSubStepProps: funnelSubStepProps,
    };

    return <InternalTable {...tableProps} ref={ref} />;
  }
) as TableForwardRefType;

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
      enableKeyboardNavigation,
      expandableRows,
      __funnelSubStepProps,
      ...rest
    }: InternalTableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    // Keyboard navigation defaults to `true` for tables with expandable rows.
    if (expandableRows && enableKeyboardNavigation === undefined) {
      enableKeyboardNavigation = true;
    }

    const baseProps = getBaseProps(rest);

    const prevStickyHeader = usePrevious(stickyHeader);
    if (prevStickyHeader !== undefined && !!stickyHeader !== !!prevStickyHeader) {
      warnOnce(
        'Table',
        `\`stickyHeader\` has changed from "${prevStickyHeader}" to "${stickyHeader}". It is not recommended to change the value of this property during the component lifecycle. Please set it to either "true" or "false" unconditionally.`
      );
    }

    stickyHeader = stickyHeader && supportsStickyPosition();
    const isMobile = useMobile();

    const { isExpandable, allItems, getExpandableItemProps } = useExpandableTableProps({
      items,
      expandableRows,
      trackBy,
      ariaLabels,
    });

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
    const wrapperMeasureRefObject = useRef(null);
    const wrapperMeasureMergedRef = useMergeRefs(wrapperMeasureRef, wrapperMeasureRefObject);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
    const tableRefObject = useRef(null);

    const secondaryWrapperRef = React.useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = React.useRef<StickyHeaderRef>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const { cancelEdit, ...cellEditing } = useCellEditing({ onCancel: onEditCancel, onSubmit: submitEdit });

    usePerformanceMarks(
      'table',
      true,
      tableRefObject,
      () => {
        /* istanbul ignore next: performance marks do not work in JSDOM */
        const headerText =
          toolsHeaderPerformanceMarkRef.current?.querySelector<HTMLElement>(`.${headerStyles['heading-text']}`)
            ?.innerText ?? toolsHeaderPerformanceMarkRef.current?.innerText;

        return {
          loading: loading ?? false,
          header: headerText,
        };
      },
      [loading]
    );

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined),
        cancelEdit,
      }),
      [cancelEdit]
    );

    const wrapperRefObject = useRef(null);
    const handleScroll = useScrollSync([wrapperRefObject, scrollbarRef, secondaryWrapperRef]);

    const { moveFocusDown, moveFocusUp, moveFocus } = useSelectionFocusMove(selectionType, allItems.length);
    const { onRowClickHandler, onRowContextMenuHandler } = useRowEvents({ onRowClick, onRowContextMenu });

    const visibleColumnDefinitions = getVisibleColumnDefinitions({
      columnDefinitions,
      columnDisplay,
      visibleColumns,
    });

    const { isItemSelected, getSelectAllProps, getItemSelectionProps, updateShiftToggle } = useSelection({
      items: allItems,
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

    let tableRole: TableRole = 'table';
    if (isExpandable) {
      tableRole = 'treegrid';
    } else if (enableKeyboardNavigation) {
      tableRole = 'grid';
    } else if (hasEditableCells) {
      tableRole = 'grid-default';
    }

    const theadProps: TheadProps = {
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
          (column, index) =>
            newWidth.get(getColumnKey(column, index)) || (column.width as number) || DEFAULT_COLUMN_WIDTH
        );
        const widthsChanged = widthsDetail.some((width, index) => columnDefinitions[index].width !== width);
        if (widthsChanged) {
          fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsDetail });
        }
      },
      singleSelectionHeaderAriaLabel: ariaLabels?.selectionGroupLabel,
      resizerRoleDescription: ariaLabels?.resizerRoleDescription,
      stripedRows,
      stickyState,
      selectionColumnId,
      tableRole,
      isExpandable,
    };

    const wrapperRef = useMergeRefs(wrapperRefObject, stickyState.refs.wrapper);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject, stickyState.refs.table);

    const wrapperProps = getTableWrapperRoleProps({
      tableRole,
      isScrollable: !!(tableWidth && containerWidth && tableWidth > containerWidth),
      ariaLabel: ariaLabels?.tableLabel,
    });

    const getMouseDownTarget = useMouseDownTarget();

    const hasDynamicHeight = computedVariant === 'full-page';
    const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight });
    useTableFocusNavigation({
      enableKeyboardNavigation,
      selectionType,
      tableRoot: tableRefObject,
      columnDefinitions: visibleColumnDefinitions,
      numRows: allItems?.length,
    });
    const toolsHeaderPerformanceMarkRef = useRef<HTMLDivElement>(null);
    // If is mobile, we take into consideration the AppLayout's mobile bar and we subtract the tools wrapper height so only the table header is sticky
    const [toolsHeaderHeight, toolsHeaderWrapperMeasureRef] = useContainerQuery(rect => rect.borderBoxHeight);
    const toolsHeaderWrapper = useMergeRefs(toolsHeaderPerformanceMarkRef, toolsHeaderWrapperMeasureRef);

    const colIndexOffset = selectionType ? 1 : 0;
    const totalColumnsCount = visibleColumnDefinitions.length + colIndexOffset;

    return (
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <ColumnWidthsProvider
          visibleColumns={visibleColumnWidthsWithSelection}
          resizableColumns={resizableColumns}
          containerRef={wrapperMeasureRefObject}
        >
          <InternalContainer
            {...baseProps}
            __internalRootRef={__internalRootRef}
            className={clsx(baseProps.className, styles.root)}
            __funnelSubStepProps={__funnelSubStepProps}
            header={
              <>
                {hasHeader && (
                  <div
                    ref={overlapElement}
                    className={clsx(hasDynamicHeight && [styles['dark-header'], getContentHeaderClassName()])}
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
            __mobileStickyOffset={toolsHeaderHeight ?? 0}
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
              <div className={styles['wrapper-content-measure']} ref={wrapperMeasureMergedRef}></div>
              {!!renderAriaLive && !!firstIndex && (
                <LiveRegion>
                  <span>
                    {renderAriaLive({
                      firstIndex,
                      lastIndex: firstIndex + items.length - 1,
                      visibleItemsCount: allItems.length,
                      totalItemsCount,
                    })}
                  </span>
                </LiveRegion>
              )}
              <GridNavigationProvider
                keyboardNavigation={!!enableKeyboardNavigation}
                pageSize={GRID_NAVIGATION_PAGE_SIZE}
                getTable={() => tableRefObject.current}
              >
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
                    onFocusedComponentChange={focusId => stickyHeaderRef.current?.setFocus(focusId)}
                    {...theadProps}
                  />
                  <tbody>
                    {loading || allItems.length === 0 ? (
                      <tr>
                        <NoDataCell
                          totalColumnsCount={totalColumnsCount}
                          hasFooter={hasFooter}
                          loading={loading}
                          loadingText={loadingText}
                          empty={empty}
                          tableRef={tableRefObject}
                          containerRef={wrapperMeasureRefObject}
                        />
                      </tr>
                    ) : (
                      allItems.map((item, rowIndex) => {
                        const isFirstRow = rowIndex === 0;
                        const isLastRow = rowIndex === allItems.length - 1;
                        const sharedCellProps = {
                          isFirstRow,
                          isLastRow,
                          isVisualRefresh,
                          isSelected: hasSelection && isItemSelected(item),
                          isPrevSelected: hasSelection && !isFirstRow && isItemSelected(allItems[rowIndex - 1]),
                          isNextSelected: hasSelection && !isLastRow && isItemSelected(allItems[rowIndex + 1]),
                          isEvenRow: rowIndex % 2 === 0,
                          hasFooter,
                          stripedRows,
                          stickyState,
                          tableRole,
                        };
                        const expandableItemProps = getExpandableItemProps(item);
                        return (
                          <tr
                            key={getItemKey(trackBy, item, rowIndex)}
                            className={clsx(styles.row, sharedCellProps.isSelected && styles['row-selected'])}
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
                            onContextMenu={
                              onRowContextMenuHandler && onRowContextMenuHandler.bind(null, rowIndex, item)
                            }
                            {...getTableRowRoleProps({ tableRole, firstIndex, rowIndex, ...expandableItemProps })}
                          >
                            {hasSelection && (
                              <TableTdElement
                                {...sharedCellProps}
                                className={clsx(styles['selection-control'])}
                                wrapLines={false}
                                hasSelection={true}
                                columnId={selectionColumnId}
                                colIndex={0}
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
                              const isEditing = cellEditing.checkEditing({ rowIndex, colIndex });
                              const successfulEdit = cellEditing.checkLastSuccessfulEdit({ rowIndex, colIndex });
                              const isEditable = !!column.editConfig && !cellEditing.isLoading;
                              const expandableCellProps =
                                isExpandable && colIndex === 0 ? expandableItemProps : undefined;
                              return (
                                <TableBodyCell
                                  key={getColumnKey(column, colIndex)}
                                  {...sharedCellProps}
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
                                  resizableColumns={resizableColumns}
                                  successfulEdit={successfulEdit}
                                  onEditStart={() => cellEditing.startEdit({ rowIndex, colIndex })}
                                  onEditEnd={editCancelled =>
                                    cellEditing.completeEdit({ rowIndex, colIndex }, editCancelled)
                                  }
                                  submitEdit={cellEditing.submitEdit}
                                  columnId={column.id ?? colIndex}
                                  colIndex={colIndex + colIndexOffset}
                                  {...expandableCellProps}
                                />
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </GridNavigationProvider>

              {resizableColumns && <ResizeTracker />}
            </div>

            <StickyScrollbar
              ref={scrollbarRef}
              wrapperRef={wrapperRefObject}
              tableRef={tableRefObject}
              onScroll={handleScroll}
              hasStickyColumns={hasStickyColumns}
            />
          </InternalContainer>
        </ColumnWidthsProvider>
      </LinkDefaultVariantContext.Provider>
    );
  }
) as TableForwardRefType;

export default InternalTable;
