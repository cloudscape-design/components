// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { StickyHeaderContext } from '../container/use-sticky-header';
import { TableProps } from './interfaces';
import Thead, { TheadProps } from './thead';
import { useStickyHeader } from './use-sticky-header';
import styles from './styles.css.js';

export interface StickyHeaderRef {
  scrollToTop(): void;
  scrollToRow(node: null | HTMLElement): void;
  setFocusedColumn(columnIndex: null | number): void;
}

interface StickyHeaderProps {
  variant: TableProps.Variant;
  theadProps: TheadProps;
  wrapperRef: React.RefObject<HTMLDivElement>;
  theadRef: React.RefObject<HTMLTableRowElement>;
  secondaryWrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  tableHasHeader?: boolean;
  items?: TableProps['items'];
}

export default forwardRef(StickyHeader);

function StickyHeader(
  {
    variant,
    theadProps,
    wrapperRef,
    theadRef,
    secondaryWrapperRef,
    onScroll,
    tableRef,
    tableHasHeader,
    items,
  }: StickyHeaderProps,
  ref: React.Ref<StickyHeaderRef>
) {
  const secondaryTheadRef = useRef<HTMLTableRowElement>(null);
  const secondaryTableRef = useRef<HTMLTableElement>(null);
  const { isStuck } = useContext(StickyHeaderContext);

  const [focusedColumn, setFocusedColumn] = useState<number | null>(null);
  const { scrollToRow, scrollToTop } = useStickyHeader(
    tableRef,
    theadRef,
    secondaryTheadRef,
    secondaryTableRef,
    wrapperRef,
    items
  );

  useImperativeHandle(ref, () => ({ scrollToTop, scrollToRow, setFocusedColumn }));

  return (
    <div
      className={clsx(styles['header-secondary'], styles[`variant-${variant}`], {
        [styles.stuck]: isStuck,
        [styles['table-has-header']]: tableHasHeader,
      })}
      aria-hidden={true}
      // Prevents receiving focus in Firefox. Focus on the overflowing table is sufficient
      // to scroll the table horizontally
      tabIndex={-1}
      ref={secondaryWrapperRef}
      onScroll={onScroll}
    >
      <table className={clsx(styles.table, styles['table-layout-fixed'])} role="table" ref={secondaryTableRef}>
        <Thead ref={secondaryTheadRef} sticky={true} stuck={isStuck} showFocusRing={focusedColumn} {...theadProps} />
      </table>
    </div>
  );
}
