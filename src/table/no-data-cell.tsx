// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalStatusIndicator from '../status-indicator/internal';
import { supportsStickyPosition } from '../internal/utils/dom';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

interface NoDataCellProps {
  totalColumnsCount: number;
  hasFooter: boolean;
  loading?: boolean;
  loadingText?: string;
  empty?: React.ReactNode;
  tableRef: React.RefObject<HTMLTableElement>;
  containerRef: React.RefObject<HTMLElement>;
}

export function NoDataCell({
  totalColumnsCount,
  hasFooter,
  loading,
  loadingText,
  empty,
  tableRef,
  containerRef,
}: NoDataCellProps) {
  const cellContentRef = useRef<HTMLDivElement>(null);

  useResizeObserver(containerRef, ({ contentBoxWidth: containerInlineSize }) => {
    if (tableRef.current && cellContentRef.current && supportsStickyPosition()) {
      const tablePaddingInlineStart = parseFloat(getComputedStyle(tableRef.current).paddingInlineStart) || 0;
      const tablePaddingInlineEnd = parseFloat(getComputedStyle(tableRef.current).paddingInlineEnd) || 0;
      const inlineSize = containerInlineSize + tablePaddingInlineStart + tablePaddingInlineEnd;
      cellContentRef.current.style.inlineSize = Math.floor(inlineSize) + 'px';
    }
  });

  return (
    <td colSpan={totalColumnsCount} className={clsx(styles['cell-merged'], hasFooter && styles['has-footer'])}>
      <div ref={cellContentRef} className={styles['cell-merged-content']} data-awsui-table-suppress-navigation={true}>
        {loading ? (
          <InternalStatusIndicator type="loading" className={styles.loading} wrapText={true}>
            <LiveRegion visible={true}>{loadingText}</LiveRegion>
          </InternalStatusIndicator>
        ) : (
          <div className={styles.empty}>{empty}</div>
        )}
      </div>
    </td>
  );
}
