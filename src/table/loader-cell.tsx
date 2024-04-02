// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalStatusIndicator from '../status-indicator/internal';
import { supportsStickyPosition } from '../internal/utils/dom';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region';
import { useResizeObserver, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { TableProps } from './interfaces';
import InternalButton from '../button/internal';

interface LoaderCellProps<T> {
  item: null | T;
  level: number;
  totalColumnsCount: number;
  loadingStatus: TableProps.LoadingStatus;
  renderLoaderPending?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderPendingResult;
  renderLoaderLoading?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderLoadingResult;
  renderLoaderError?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderErrorResult;
  onLoadMoreItems: () => void;
  tableRef: React.RefObject<HTMLTableElement>;
  containerRef: React.RefObject<HTMLElement>;
}

export function LoaderCell<T>({
  item,
  level,
  totalColumnsCount,
  loadingStatus,
  renderLoaderPending,
  renderLoaderLoading,
  renderLoaderError,
  onLoadMoreItems,
  tableRef,
  containerRef,
}: LoaderCellProps<T>) {
  const cellContentRef = useRef<HTMLDivElement>(null);

  useResizeObserver(containerRef, ({ contentBoxWidth: containerWidth }) => {
    if (tableRef.current && cellContentRef.current && supportsStickyPosition()) {
      const tablePaddingLeft = parseFloat(getComputedStyle(tableRef.current).paddingLeft) || 0;
      const tablePaddingRight = parseFloat(getComputedStyle(tableRef.current).paddingRight) || 0;
      const contentWidth = containerWidth + tablePaddingLeft + tablePaddingRight;
      cellContentRef.current.style.width = Math.floor(contentWidth) + 'px';
    }
  });

  let content: React.ReactNode = null;
  if (loadingStatus === 'pending' && renderLoaderPending) {
    const { buttonContent, buttonAriaLabel } = renderLoaderPending({ item });
    content = (
      <InternalButton variant="inline-link" iconName="add-plus" ariaLabel={buttonAriaLabel} onClick={onLoadMoreItems}>
        {buttonContent}
      </InternalButton>
    );
  } else if (loadingStatus === 'loading' && renderLoaderLoading) {
    const { loadingText } = renderLoaderLoading({ item });
    content = (
      <LiveRegion visible={true}>
        <InternalStatusIndicator type="loading">{loadingText}</InternalStatusIndicator>
      </LiveRegion>
    );
  } else if (loadingStatus === 'error' && renderLoaderError) {
    const { cellContent } = renderLoaderError({ item });
    content = <LiveRegion visible={true}>{cellContent}</LiveRegion>;
  } else {
    // TODO: message wording
    warnOnce('Table', 'Must define progressive loading correctly');
  }

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
        {content}
      </div>
    </td>
  );
}

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
