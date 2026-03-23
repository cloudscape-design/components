// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import {
  GeneratedAnalyticsMetadataFragment,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalContainer, { InternalContainerProps } from '../container/internal';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getAnalyticsMetadataProps, getBaseProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import {
  FilterRef,
  HeaderRef,
  PaginationRef,
  PreferencesRef,
  TableComponentsContextProvider,
} from '../internal/context/table-component-context';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMobile } from '../internal/hooks/use-mobile';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { usePerformanceMarks } from '../internal/hooks/use-performance-marks';
import { usePrevious } from '../internal/hooks/use-previous';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { useTableInteractionMetrics } from '../internal/hooks/use-table-interaction-metrics';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { SomeRequired } from '../internal/types';
import InternalLiveRegion from '../live-region/internal';
import { GeneratedAnalyticsMetadataTableComponent } from './analytics-metadata/interfaces';
import { TableBodyCell } from './body-cell';
import { checkColumnWidths } from './column-widths-utils';
import { useExpandableTableProps } from './expandable-rows/expandable-rows-utils';
import { TableForwardRefType, TableProps, TableRow } from './interfaces';
import { NoDataCell } from './no-data-cell';
import { getLoaderContent } from './progressive-loading/items-loader';
import { TableLoaderCell } from './progressive-loading/loader-cell';
import { useProgressiveLoadingProps } from './progressive-loading/progressive-loading-utils';
import { ResizeTracker } from './resizer';
import { focusMarkers, useSelection, useSelectionFocusMove } from './selection';
import { TableBodySelectionCell } from './selection/selection-cell';
import { useGroupSelection } from './selection/use-group-selection';
import { useStickyColumns } from './sticky-columns';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import { StickyScrollbar } from './sticky-scrollbar';
import {
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
  GridNavigationProvider,
  TableRole,
} from './table-role';
import Thead, { TheadProps } from './thead';
import ToolsHeader from './tools-header';
import { useCellEditing } from './use-cell-editing';
import { ColumnWidthDefinition, ColumnWidthsProvider, DEFAULT_COLUMN_WIDTH } from './use-column-widths';
import { usePreventStickyClickScroll } from './use-prevent-sticky-click-scroll';
import { useRowEvents } from './use-row-events';
import useTableFocusNavigation from './use-table-focus-navigation';
import { checkSortingState, getColumnKey, getItemKey, getVisibleColumnDefinitions, toContainerVariant } from './utils';

import buttonStyles from '../button/styles.css.js';
import headerStyles from '../header/styles.css.js';
import styles from './styles.css.js';

const GRID_NAVIGATION_PAGE_SIZE = 10;
const SELECTION_COLUMN_WIDTH = 54;
const selectionColumnId = Symbol('selection-column-id');

type InternalTableProps<T> = SomeRequired<
  TableProps<T>,
  'items' | 'selectedItems' | 'variant' | 'firstIndex' | 'cellVerticalAlign'
> &
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
      selectionType: externalSelectionType,
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
      expandableRows: externalExpandableRows,
      getLoadingStatus,
      renderLoaderPending,
      renderLoaderLoading,
      renderLoaderError,
      renderLoaderEmpty,
      renderLoaderCounter,
      cellVerticalAlign,
      __funnelSubStepProps,
      ...rest
    }: InternalTableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    // Keyboard navigation defaults to `true` for tables with expandable rows.
    if (externalExpandableRows && enableKeyboardNavigation === undefined) {
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

    const isMobile = useMobile();

    const expandableRows = useExpandableTableProps({
      items,
      expandableRows: externalExpandableRows,
      trackBy,
      ariaLabels,
    });
    const { allItems, isExpandable } = expandableRows;
    const { allRows } = useProgressiveLoadingProps({ getLoadingStatus, expandableRows });
    const selectionType = expandableRows.hasGroupSelection ? ('group' as const) : externalSelectionType;

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(rect => rect.borderBoxWidth);
    const wrapperMeasureRefObject = useRef(null);
    const wrapperMeasureMergedRef = useMergeRefs(wrapperMeasureRef, wrapperMeasureRefObject);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(rect => rect.borderBoxWidth);
    const tableRefObject = useRef(null);

    const secondaryWrapperRef = React.useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = React.useRef<StickyHeaderRef>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const { cancelEdit, ...cellEditing } = useCellEditing({ onCancel: onEditCancel, onSubmit: submitEdit });
    const paginationRef = useRef<PaginationRef>({});
    const filterRef = useRef<FilterRef>({});
    const preferencesRef = useRef<PreferencesRef>({});
    const headerRef = useRef<HeaderRef>({});
    /* istanbul ignore next: performance marks do not work in JSDOM */
    const getHeaderText = () =>
      toolsHeaderPerformanceMarkRef.current?.querySelector<HTMLElement>(`.${headerStyles['heading-text']}`)
        ?.innerText ?? toolsHeaderPerformanceMarkRef.current?.innerText;
    const getPatternIdentifier = () => {
      const hasActions = !!toolsHeaderPerformanceMarkRef.current?.querySelector<HTMLElement>(
        `.${headerStyles.actions} .${buttonStyles.button}`
      );

      if (hasActions) {
        return 'table-with-actions';
      }

      return '';
    };

    const performanceMarkAttributes = usePerformanceMarks(
      'table',
      () => !loading,
      tableRefObject,
      () => ({
        loading: loading ?? false,
        header: getHeaderText(),
      }),
      [loading]
    );

    const analyticsMetadata = getAnalyticsMetadataProps(rest);
    const interactionMetadata = () => {
      const filterData = filterRef.current;
      const paginationData = paginationRef.current;
      return JSON.stringify({
        filterData,
        paginationData,
        sortingColumn: sortingColumn?.sortingField,
        sortingOrder: sortingColumn ? (sortingDescending ? 'Descending' : 'Ascending') : undefined,
      });
    };
    const getComponentConfiguration = () => {
      const headerData = headerRef.current;
      const filterData = filterRef.current;
      const paginationData = paginationRef.current;
      const preferencesData = preferencesRef.current;

      return {
        variant,
        flowType: rest.analyticsMetadata?.flowType,
        resourceType: rest.analyticsMetadata?.resourceType,
        instanceIdentifier: analyticsMetadata?.instanceIdentifier,
        taskName: analyticsMetadata?.instanceIdentifier ?? getHeaderText(),
        uxTaskName: getHeaderText(),
        patternIdentifier: getPatternIdentifier(),
        sortedBy: {
          columnId: sortingColumn?.sortingField,
          sortingOrder: sortingColumn ? (sortingDescending ? 'desc' : 'asc') : undefined,
        },
        filtered: filterData?.filtered ?? null,
        filteredBy: filterData?.filteredBy ?? [],
        filteredCount: filterData?.filterCount ?? null,
        totalNumberOfResources: headerData?.totalCount ?? null,
        tablePreferences: {
          visibleColumns: preferencesData?.visibleColumns ?? [],
          resourcesPerPage: preferencesData?.pageSize ?? null,
        },
        pagination: {
          currentPageIndex: paginationData?.currentPageIndex ?? 0,
          totalNumberOfPages: paginationData?.openEnd ? null : (paginationData?.totalPageCount ?? null),
          openEnd: Boolean(paginationData?.openEnd),
        },
        resourcesSelected: selectedItems?.length > 0,
      };
    };

    const { setLastUserAction, tableInteractionAttributes } = useTableInteractionMetrics({
      elementRef: tableRefObject,
      loading,
      items,
      instanceIdentifier: analyticsMetadata?.instanceIdentifier,
      itemCount: items.length,
      getComponentIdentifier: getHeaderText,
      getComponentConfiguration,
      interactionMetadata,
    });

    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined),
        cancelEdit,
      }),
      [cancelEdit]
    );

    const wrapperRefObject = useRef<HTMLDivElement>(null);
    const handleScroll = useScrollSync([wrapperRefObject, scrollbarRef, secondaryWrapperRef]);

    const { moveFocusDown, moveFocusUp, moveFocus } = useSelectionFocusMove(selectionType, allItems.length);
    const { onRowClickHandler, onRowContextMenuHandler } = useRowEvents({ onRowClick, onRowContextMenu });

    const visibleColumnDefinitions = getVisibleColumnDefinitions({
      columnDefinitions,
      columnDisplay,
      visibleColumns,
    });

    const selectionProps = {
      items: allItems,
      rootItems: items,
      trackBy,
      selectedItems,
      totalItemsCount,
      selectionType,
      isItemDisabled,
      onSelectionChange,
      ariaLabels: {
        ...ariaLabels,
        // `selectionGroupLabel` should not be part of the selection control, it is already part of the selection column header.
        selectionGroupLabel: undefined,
      },
      loading,
      expandableRows,
      getLoadingStatus,
      setLastUserAction,
    };
    const normalSelection = useSelection(selectionProps);
    const groupSelection = useGroupSelection(selectionProps);
    const selection = selectionType === 'group' ? groupSelection : normalSelection;
    const isRowSelected = (row: TableRow<T>) => {
      if (row.type === 'data') {
        return selection.isItemSelected(row.item);
      }
      if (selectionType !== 'group') {
        return false;
      }
      // Group loader is selected when its parent is selected.
      return !row.item ? expandableRows.groupSelection.inverted : selection.isItemSelected(row.item);
    };

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
    const ariaLabelledby = isLabelledByHeader && headerIdRef.current ? headerIdRef.current : undefined;
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
      getSelectAllProps: selection.getSelectAllProps,
      columnDefinitions: visibleColumnDefinitions,
      variant: computedVariant,
      tableVariant: computedVariant,
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
      resizerTooltipText: ariaLabels?.resizerTooltipText,
      stripedRows,
      stickyState,
      selectionColumnId,
      tableRole,
      isExpandable,
      setLastUserAction,
    };

    usePreventStickyClickScroll(wrapperRefObject);

    const wrapperRef = useMergeRefs(wrapperRefObject, stickyState.refs.wrapper);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject, stickyState.refs.table);

    const wrapperProps = getTableWrapperRoleProps({
      tableRole,
      isScrollable: !!(tableWidth && containerWidth && tableWidth > containerWidth),
      ariaLabel: ariaLabels?.tableLabel,
      ariaLabelledby,
    });

    const getMouseDownTarget = useMouseDownTarget();

    useTableFocusNavigation({
      enableKeyboardNavigation,
      selectionType,
      tableRoot: tableRefObject,
      columnDefinitions: visibleColumnDefinitions,
      numRows: allRows?.length,
    });
    const toolsHeaderPerformanceMarkRef = useRef<HTMLDivElement>(null);
    // If is mobile, we take into consideration the AppLayout's mobile bar and we subtract the tools wrapper height so only the table header is sticky
    const [toolsHeaderHeight, toolsHeaderWrapperMeasureRef] = useContainerQuery(rect => rect.borderBoxHeight);
    const toolsHeaderWrapper = useMergeRefs(toolsHeaderPerformanceMarkRef, toolsHeaderWrapperMeasureRef);

    const colIndexOffset = selectionType ? 1 : 0;
    const totalColumnsCount = visibleColumnDefinitions.length + colIndexOffset;

    return (
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <TableComponentsContextProvider value={{ paginationRef, filterRef, preferencesRef, headerRef }}>
          <ColumnWidthsProvider
            visibleColumns={visibleColumnWidthsWithSelection}
            resizableColumns={resizableColumns}
            containerRef={wrapperMeasureRefObject}
          >
            <InternalContainer
              {...baseProps}
              {...tableInteractionAttributes}
              __internalRootRef={__internalRootRef}
              className={clsx(baseProps.className, styles.root)}
              __funnelSubStepProps={__funnelSubStepProps}
              __fullPage={variant === 'full-page'}
              header={
                <>
                  {hasHeader && (
                    <div>
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
                            setLastUserAction={setLastUserAction}
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
              disableFooterPaddings={true}
              variant={toContainerVariant(computedVariant)}
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
                {!!renderAriaLive && !!firstIndex && !loading && (
                  <InternalLiveRegion hidden={true} tagName="span">
                    <span>
                      {renderAriaLive({
                        firstIndex,
                        lastIndex: firstIndex + items.length - 1,
                        visibleItemsCount: allItems.length,
                        totalItemsCount,
                      })}
                    </span>
                  </InternalLiveRegion>
                )}
                <GridNavigationProvider
                  keyboardNavigation={!!enableKeyboardNavigation}
                  pageSize={GRID_NAVIGATION_PAGE_SIZE}
                  getTable={() => tableRefObject.current}
                >
                  <table
                    {...performanceMarkAttributes}
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
                      ariaLabelledby,
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
                        allRows.map((row, rowIndex) => {
                          const isFirstRow = rowIndex === 0;
                          const isLastRow = rowIndex === allRows.length - 1;
                          const rowExpandableProps =
                            row.type === 'data' ? expandableRows.getExpandableItemProps(row.item) : undefined;
                          const rowRoleProps = getTableRowRoleProps({
                            tableRole,
                            firstIndex,
                            rowIndex,
                            level: row.type === 'loader' ? row.level : undefined,
                            ...rowExpandableProps,
                          });
                          const getTableItemKey = (item: T) => getItemKey(trackBy, item, rowIndex);
                          const sharedCellProps = {
                            isFirstRow,
                            isLastRow,
                            isSelected: hasSelection && isRowSelected(row),
                            isPrevSelected: hasSelection && !isFirstRow && isRowSelected(allRows[rowIndex - 1]),
                            isNextSelected: hasSelection && !isLastRow && isRowSelected(allRows[rowIndex + 1]),
                            isEvenRow: rowIndex % 2 === 0,
                            stripedRows,
                            hasSelection,
                            hasFooter,
                            stickyState,
                            tableRole,
                          };
                          if (row.type === 'data') {
                            const rowId = `${getTableItemKey(row.item)}`;
                            return (
                              <tr
                                key={rowId}
                                className={clsx(styles.row, sharedCellProps.isSelected && styles['row-selected'])}
                                onFocus={({ currentTarget }) => {
                                  // When an element inside table row receives focus we want to adjust the scroll.
                                  // However, that behavior is unwanted when the focus is received as result of a click
                                  // as it causes the click to never reach the target element.
                                  if (!currentTarget.contains(getMouseDownTarget())) {
                                    stickyHeaderRef.current?.scrollToRow(currentTarget);
                                  }
                                }}
                                {...focusMarkers.item}
                                onClick={onRowClickHandler && onRowClickHandler.bind(null, rowIndex, row.item)}
                                onContextMenu={
                                  onRowContextMenuHandler && onRowContextMenuHandler.bind(null, rowIndex, row.item)
                                }
                                {...rowRoleProps}
                              >
                                {selection.getItemSelectionProps && (
                                  <TableBodySelectionCell
                                    {...sharedCellProps}
                                    columnId={selectionColumnId}
                                    selectionControlProps={{
                                      ...selection.getItemSelectionProps(row.item),
                                      onFocusDown: moveFocusDown,
                                      onFocusUp: moveFocusUp,
                                      rowIndex,
                                      itemKey: rowId,
                                    }}
                                    verticalAlign={cellVerticalAlign}
                                    tableVariant={computedVariant}
                                  />
                                )}

                                {visibleColumnDefinitions.map((column, colIndex) => {
                                  const colId = `${getColumnKey(column, colIndex)}`;
                                  const cellId = { row: rowId, col: colId };
                                  const isEditing = cellEditing.checkEditing(cellId);
                                  const successfulEdit = cellEditing.checkLastSuccessfulEdit(cellId);
                                  const isEditable = !!column.editConfig && !cellEditing.isLoading;
                                  const cellExpandableProps =
                                    isExpandable && colIndex === 0 ? rowExpandableProps : undefined;
                                  const counter = column.counter?.({
                                    item: row.item,
                                    itemsCount: rowExpandableProps?.itemsCount,
                                    selectedItemsCount: rowExpandableProps?.selectedItemsCount,
                                  });

                                  const analyticsMetadata: GeneratedAnalyticsMetadataFragment = {
                                    component: {
                                      innerContext: {
                                        position: `${rowIndex + 1},${colIndex + 1}`,
                                        columnId: column.id ? `${column.id}` : '',
                                        columnLabel: {
                                          selector: `table thead tr th:nth-child(${colIndex + (selectionType ? 2 : 1)})`,
                                          root: 'component',
                                        },
                                        item: rowId,
                                      } as GeneratedAnalyticsMetadataTableComponent['innerContext'],
                                    },
                                  };

                                  return (
                                    <TableBodyCell
                                      key={colId}
                                      {...sharedCellProps}
                                      resizableStyle={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                      }}
                                      ariaLabels={ariaLabels}
                                      column={column}
                                      item={row.item}
                                      wrapLines={wrapLines}
                                      isEditable={isEditable}
                                      isEditing={isEditing}
                                      isRowHeader={column.isRowHeader}
                                      successfulEdit={successfulEdit}
                                      resizableColumns={resizableColumns}
                                      onEditStart={() => cellEditing.startEdit(cellId)}
                                      onEditEnd={editCancelled => cellEditing.completeEdit(cellId, editCancelled)}
                                      submitEdit={cellEditing.submitEdit}
                                      columnId={column.id ?? colIndex}
                                      colIndex={colIndex + colIndexOffset}
                                      verticalAlign={column.verticalAlign ?? cellVerticalAlign}
                                      tableVariant={computedVariant}
                                      counter={counter}
                                      {...cellExpandableProps}
                                      {...getAnalyticsMetadataAttribute(analyticsMetadata)}
                                    />
                                  );
                                })}
                              </tr>
                            );
                          }
                          const loaderSelectionProps =
                            selection.getLoaderSelectionProps && selection.getLoaderSelectionProps(row.item);
                          const rowSelection = selectionType === 'group' ? loaderSelectionProps : undefined;
                          const loaderContent = getLoaderContent({
                            item: row.item,
                            loadingStatus: row.status,
                            renderLoaderPending,
                            renderLoaderLoading,
                            renderLoaderError,
                            renderLoaderEmpty,
                          });
                          const loaderCounter = renderLoaderCounter?.({
                            item: row.item,
                            loadingStatus: row.status,
                            selected: !!rowSelection?.checked,
                          });
                          return (
                            loaderContent && (
                              <tr
                                key={(row.item ? getTableItemKey(row.item) : 'root-' + rowIndex) + '-' + row.from}
                                className={styles.row}
                                {...rowRoleProps}
                              >
                                {selectionType ? (
                                  <TableBodySelectionCell
                                    {...sharedCellProps}
                                    columnId={selectionColumnId}
                                    verticalAlign={cellVerticalAlign}
                                    tableVariant={computedVariant}
                                    selectionControlProps={selectionType === 'group' ? loaderSelectionProps : undefined}
                                    isSelected={selectionType === 'group' && !!loaderSelectionProps?.checked}
                                  />
                                ) : null}
                                {visibleColumnDefinitions.map((column, colIndex) => (
                                  <TableLoaderCell
                                    key={getColumnKey(column, colIndex)}
                                    {...sharedCellProps}
                                    wrapLines={false}
                                    columnId={column.id ?? colIndex}
                                    colIndex={colIndex + colIndexOffset}
                                    isSelected={selectionType === 'group' && !!loaderSelectionProps?.checked}
                                    isRowHeader={colIndex === 0}
                                    level={row.level}
                                    item={row.item}
                                    trackBy={trackBy}
                                    counter={loaderCounter}
                                  >
                                    {loaderContent}
                                  </TableLoaderCell>
                                ))}
                              </tr>
                            )
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
        </TableComponentsContextProvider>
      </LinkDefaultVariantContext.Provider>
    );
  }
) as TableForwardRefType;

export default InternalTable;
