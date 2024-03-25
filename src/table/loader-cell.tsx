// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalStatusIndicator from '../status-indicator/internal';
import { supportsStickyPosition } from '../internal/utils/dom';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { TableProps } from './interfaces';

interface LoaderCellProps {
  totalColumnsCount: number;
  progressiveLoading: TableProps.ProgressiveLoading;
  level: number;
  tableRef: React.RefObject<HTMLTableElement>;
  containerRef: React.RefObject<HTMLElement>;
}

export function LoaderCell({ totalColumnsCount, progressiveLoading, level, tableRef, containerRef }: LoaderCellProps) {
  const cellContentRef = useRef<HTMLDivElement>(null);

  useResizeObserver(containerRef, ({ contentBoxWidth: containerWidth }) => {
    if (tableRef.current && cellContentRef.current && supportsStickyPosition()) {
      const tablePaddingLeft = parseFloat(getComputedStyle(tableRef.current).paddingLeft) || 0;
      const tablePaddingRight = parseFloat(getComputedStyle(tableRef.current).paddingRight) || 0;
      const contentWidth = containerWidth + tablePaddingLeft + tablePaddingRight;
      cellContentRef.current.style.width = Math.floor(contentWidth) + 'px';
    }
  });

  return (
    <td colSpan={totalColumnsCount} className={clsx(styles['cell-loader'])}>
      <div
        ref={cellContentRef}
        className={clsx(
          styles['cell-loader-content'],
          styles[`cell-loader-content-level-${getLevelClassSuffix(level)}`]
        )}
        data-awsui-table-suppress-navigation={true}
      >
        Loader cell
      </div>
    </td>
  );
}

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
