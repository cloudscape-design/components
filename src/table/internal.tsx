// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useImperativeHandle, useRef } from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import InternalContainer from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from './tools-header';
import Thead, { TheadProps } from './thead';
import { TableBodyCell, TableBodyCellContent } from './body-cell';
import InternalStatusIndicator from '../status-indicator/internal';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { supportsStickyPosition } from '../internal/utils/dom';
import SelectionControl from './selection-control';
import { checkSortingState, getColumnKey, getItemKey, toContainerVariant } from './utils';
import { useRowEvents } from './use-row-events';
import { focusMarkers, useFocusMove, useSelection } from './use-selection';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { checkColumnWidths, ColumnWidthsProvider, DEFAULT_WIDTH } from './use-column-widths';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { ResizeTracker } from './resizer';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import StickyScrollbar from './sticky-scrollbar';
import useFocusVisible from '../internal/hooks/focus-visible';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import useMouseDownTarget from './use-mouse-down-target';

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
      hasZebraStripes,
      resizableColumns,
      onColumnWidthsChange,
      variant,
      __internalRootRef,
      ...rest
    }: InternalTableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    stickyHeader = stickyHeader && supportsStickyPosition();

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const wrapperRefObject = useRef(null);
    const wrapperRef = useMergeRefs(wrapperMeasureRef, wrapperRefObject);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const tableRefObject = useRef(null);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject);

    const secondaryWrapperRef = React.useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = React.useRef<StickyHeaderRef>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const [tableCellRefs, setTableCellRefs] = React.useState<any[]>([]);
    const [leftCellWidths, setLeftCellWidths] = React.useState<number[]>([]);
    const [rightCellWidths, setRightCellWidths] = React.useState<number[]>([]);

    useImperativeHandle(ref, () => ({ scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined) }));

    const handleScroll = useScrollSync(
      [wrapperRefObject, scrollbarRef, secondaryWrapperRef],
      !supportsStickyPosition()
    );

    const { moveFocusDown, moveFocusUp, moveFocus } = useFocusMove(selectionType, items.length);
    const { onRowClickHandler, onRowContextMenuHandler } = useRowEvents({ onRowClick, onRowContextMenu });
    const visibleColumnDefinitions = visibleColumns
      ? columnDefinitions.filter(column => column.id && visibleColumns.indexOf(column.id) !== -1)
      : columnDefinitions;

    const arrLength = visibleColumnDefinitions.length;

    React.useEffect(() => {
      // add or remove refs
      setTableCellRefs(tableCellRefs =>
        [...new Array(arrLength)].map((_: any, i: number) => tableCellRefs[i] || React.createRef())
      );
    }, [arrLength, visibleColumnDefinitions]);

    React.useEffect(() => {
      const getCellWidths = () => {
        let widthsArray = tableCellRefs.map(ref => ref.current?.previousSibling?.offsetWidth);
        widthsArray = widthsArray.filter(x => x);
        widthsArray = widthsArray.map((elem, index) => widthsArray.slice(0, index + 1).reduce((a, b) => a + b));

        let rightWidthsArray = tableCellRefs.map(ref => ref.current?.nextSibling?.offsetWidth);
        rightWidthsArray = rightWidthsArray.filter(x => x).reverse();
        rightWidthsArray = rightWidthsArray
          .map((elem, index) => rightWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
          .reverse();

        setRightCellWidths([...rightWidthsArray, 0]);
        setLeftCellWidths([0, ...widthsArray]);
      };

      getCellWidths();
    }, [tableCellRefs]);

    const { isItemSelected, selectAllProps, getItemSelectionProps, updateShiftToggle } = useSelection({
      items,
      trackBy,
      selectedItems,
      selectionType,
      isItemDisabled,
      onSelectionChange,
      ariaLabels,
    });
    if (loading) {
      selectAllProps.disabled = true;
    }

    if (isDevelopment) {
      if (resizableColumns) {
        checkColumnWidths(columnDefinitions);
      }
      if (sortingColumn?.sortingComparator) {
        checkSortingState(columnDefinitions, sortingColumn.sortingComparator);
      }
    }

    const isRefresh = useVisualRefresh();
    const computedVariant = isRefresh
      ? variant
      : ['embedded', 'full-page'].indexOf(variant) > -1
      ? 'container'
      : variant;
    const hasHeader = !!(header || filter || pagination || preferences);

    const theadProps: TheadProps = {
      containerWidth,
      selectionType,
      selectAllProps,
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
    };

    // Allows keyboard users to scroll horizontally with arrow keys by making the wrapper part of the tab sequence
    const isWrapperScrollable = tableWidth && containerWidth && tableWidth > containerWidth;
    const wrapperProps = isWrapperScrollable
      ? { role: 'region', tabIndex: 0, 'aria-label': ariaLabels?.tableLabel }
      : {};
    const focusVisibleProps = useFocusVisible();

    const getMouseDownTarget = useMouseDownTarget();

    return (
      <ColumnWidthsProvider
        tableRef={tableRefObject}
        visibleColumnDefinitions={visibleColumnDefinitions}
        resizableColumns={resizableColumns}
        hasSelection={!!selectionType}
      >
        <InternalContainer
          {...baseProps}
          __internalRootRef={__internalRootRef}
          className={clsx(baseProps.className, styles.root)}
          header={
            <>
              {hasHeader && (
                <div className={clsx(styles['header-controls'], styles[`variant-${computedVariant}`])}>
                  <ToolsHeader header={header} filter={filter} pagination={pagination} preferences={preferences} />
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
                />
              )}
            </>
          }
          disableHeaderPaddings={true}
          disableContentPaddings={true}
          variant={toContainerVariant(computedVariant)}
          __disableFooterPaddings={true}
          __disableFooterDivider={true}
          footer={
            footer && (
              <div className={clsx(styles['footer-wrapper'], styles[`variant-${computedVariant}`])}>
                <hr className={styles.divider} />
                <div className={styles.footer}>{footer}</div>
              </div>
            )
          }
          __stickyHeader={stickyHeader}
          __stickyOffset={stickyHeaderVerticalOffset}
          {...focusMarkers.root}
        >
          <div
            ref={wrapperRef}
            className={clsx(styles.wrapper, styles[`variant-${computedVariant}`], {
              [styles['has-footer']]: !!footer,
              [styles['has-header']]: hasHeader,
            })}
            onScroll={handleScroll}
            {...wrapperProps}
            {...focusVisibleProps}
          >
            <table
              ref={tableRef}
              className={clsx(styles.table, resizableColumns && styles['table-layout-fixed'])}
              // Browsers have weird mechanism to guess whether it's a data table or a layout table.
              // If we state explicitly, they get it always correctly even with low number of rows.
              role="table"
              aria-label={ariaLabels?.tableLabel}
            >
              <Thead
                ref={theadRef}
                hidden={stickyHeader}
                onCellFocus={colIndex => stickyHeaderRef.current?.setFocusedColumn(colIndex)}
                onCellBlur={() => stickyHeaderRef.current?.setFocusedColumn(null)}
                {...theadProps}
              />
              <tbody>
                {loading || items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectionType ? visibleColumnDefinitions.length + 1 : visibleColumnDefinitions.length}
                      className={styles['cell-merged']}
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
                            {loadingText}
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
                      >
                        {selectionType !== undefined && (
                          <TableBodyCell
                            className={styles['selection-control']}
                            isFirstRow={firstVisible}
                            isLastRow={lastVisible}
                            isEvenRow={isEven}
                            isSelected={isSelected}
                            isNextSelected={isNextSelected}
                            isPrevSelected={isPrevSelected}
                            wrapLines={false}
                            hasZebraStripes={hasZebraStripes}
                          >
                            <SelectionControl
                              onFocusDown={moveFocusDown}
                              onFocusUp={moveFocusUp}
                              onShiftToggle={updateShiftToggle}
                              {...getItemSelectionProps(item)}
                            />
                          </TableBodyCell>
                        )}
                        {visibleColumnDefinitions.map((column, colIndex) => {
                          const currentCell = tableCellRefs[colIndex]?.current;
                          const isLastLeftStickyColumn =
                            currentCell?.nextSibling?.style.left === 'auto' && currentCell?.style.left !== 'auto';
                          const isLastRightStickyColumn =
                            currentCell?.previousSibling?.style.right === 'auto' && currentCell?.style.right !== 'auto';

                          const styles = {
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            right: column.isSticky === 'right' ? `${rightCellWidths[colIndex]}px` : 'auto',
                            left: column.isSticky === 'left' ? `${leftCellWidths[colIndex]}px` : 'auto',
                            boxShadow: isLastRightStickyColumn
                              ? 'inset 2px 0 #eaeded'
                              : isLastLeftStickyColumn
                              ? 'inset -2px 0 #eaeded'
                              : 'none',
                          };

                          // console.log(column, column.isSticky);

                          return (
                            <TableBodyCellContent
                              key={getColumnKey(column, colIndex)}
                              ref={tableCellRefs[colIndex]}
                              style={
                                resizableColumns
                                  ? {
                                      right: column.isSticky === 'right' ? `${rightCellWidths[colIndex]}px` : 'auto',
                                      left: column.isSticky === 'left' ? `${leftCellWidths[colIndex]}px` : 'auto',
                                      boxShadow: isLastLeftStickyColumn
                                        ? 'inset -2px 0 #eaeded'
                                        : isLastRightStickyColumn
                                        ? 'inset 2px 0 #eaeded'
                                        : 'none',
                                    }
                                  : styles
                              }
                              isSticky={column.isSticky === 'right' || column.isSticky === 'left'}
                              column={column}
                              item={item}
                              wrapLines={wrapLines}
                              isFirstRow={firstVisible}
                              isLastRow={lastVisible}
                              isEvenRow={isEven}
                              hasZebraStripes={hasZebraStripes}
                              isSelected={isSelected}
                              isNextSelected={isNextSelected}
                              isPrevSelected={isPrevSelected}
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
