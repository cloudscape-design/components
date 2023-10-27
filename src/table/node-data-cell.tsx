// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import InternalStatusIndicator from '../status-indicator/internal';
import { supportsStickyPosition } from '../internal/utils/dom';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region';
import { TableProps } from './interfaces';

interface NoDataCellProps {
  variant: TableProps.Variant;
  containerWidth: number;
  totalColumnsCount: number;
  hasFooter: boolean;
  loading?: boolean;
  loadingText?: string;
  empty?: React.ReactNode;
  tableRef: React.RefObject<HTMLTableElement>;
}

export function NoDataCell({
  variant,
  containerWidth,
  totalColumnsCount,
  hasFooter,
  loading,
  loadingText,
  empty,
  tableRef,
}: NoDataCellProps) {
  const [tablePaddings, setTablePaddings] = useState(containerWidth);

  useEffect(() => {
    if (tableRef.current) {
      const tablePaddingLeft = parseFloat(getComputedStyle(tableRef.current).paddingLeft) || 0;
      const tablePaddingRight = parseFloat(getComputedStyle(tableRef.current).paddingRight) || 0;
      setTablePaddings(tablePaddingLeft + tablePaddingRight);
    }
  }, [variant, tableRef]);

  containerWidth = containerWidth + tablePaddings;

  return (
    <td colSpan={totalColumnsCount} className={clsx(styles['cell-merged'], hasFooter && styles['has-footer'])}>
      <div
        className={styles['cell-merged-content']}
        style={{
          width: (supportsStickyPosition() && containerWidth && Math.floor(containerWidth)) || undefined,
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
  );
}
