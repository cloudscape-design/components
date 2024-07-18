// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { StickyHeaderContext } from '../container/use-sticky-header';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { TableProps } from './interfaces';
import { getTableRoleProps, TableRole } from './table-role';
import Thead, { TheadProps } from './thead';
import { useStickyHeader } from './use-sticky-header';

import styles from './styles.css.js';

export interface StickyHeaderRef {
  scrollToTop(): void;
  scrollToRow(node: null | HTMLElement): void;
  setFocus(focusId: null | string): void;
}

interface StickyHeaderProps {
  variant: TableProps.Variant;
  theadProps: TheadProps;
  wrapperRef: React.RefObject<HTMLDivElement>;
  theadRef: React.RefObject<HTMLTableRowElement>;
  secondaryWrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  contentDensity?: 'comfortable' | 'compact';
  tableHasHeader?: boolean;
  tableRole: TableRole;
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
    contentDensity,
    tableRole,
  }: StickyHeaderProps,
  ref: React.Ref<StickyHeaderRef>
) {
  const secondaryTheadRef = useRef<HTMLTableRowElement>(null);
  const secondaryTableRef = useRef<HTMLTableElement>(null);
  const { isStuck } = useContext(StickyHeaderContext);

  const [focusedComponent, setFocusedComponent] = useState<null | string>(null);
  const { scrollToRow, scrollToTop } = useStickyHeader(
    tableRef,
    theadRef,
    secondaryTheadRef,
    secondaryTableRef,
    wrapperRef
  );

  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToRow,
    setFocus: setFocusedComponent,
  }));

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
      <table
        className={clsx(
          styles.table,
          styles['table-layout-fixed'],
          contentDensity === 'compact' && getVisualContextClassname('compact-table')
        )}
        ref={secondaryTableRef}
        {...getTableRoleProps({ tableRole })}
      >
        <Thead
          ref={secondaryTheadRef}
          sticky={true}
          stuck={isStuck}
          focusedComponent={focusedComponent}
          {...theadProps}
        />
      </table>
    </div>
  );
}
