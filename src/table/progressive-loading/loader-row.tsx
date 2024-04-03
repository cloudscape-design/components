// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalStatusIndicator from '../../status-indicator/internal';
import styles from './styles.css.js';
import bodyCellStyles from '../body-cell/styles.css.js';
import LiveRegion from '../../internal/components/live-region';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { TableProps } from '../interfaces';
import InternalButton from '../../button/internal';

interface LoaderRowProps<T> {
  item: null | T;
  level: number;
  isExpandable: boolean;
  hasSelection: boolean;
  totalColumnsCount: number;
  loadingStatus: TableProps.LoadingStatus;
  renderLoaderPending?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderPendingResult;
  renderLoaderLoading?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderLoadingResult;
  renderLoaderError?: (detail: TableProps.RenderLoaderDetail<T>) => TableProps.RenderLoaderErrorResult;
  onLoadMoreItems: () => void;
}

export function LoaderRow<T>({
  item,
  level,
  isExpandable,
  hasSelection,
  totalColumnsCount,
  loadingStatus,
  renderLoaderPending,
  renderLoaderLoading,
  renderLoaderError,
  onLoadMoreItems,
}: LoaderRowProps<T>) {
  const cellContentRef = useRef<HTMLDivElement>(null);

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
    warnOnce(
      'Table',
      'Must define `renderLoaderPending`, `renderLoaderLoading`, and `renderLoaderError` when using `loadingStatus`.'
    );
  }

  return (
    // TODO: add isLastRow, hasFooter, isPrevSelected, stripedRow, isVisualRefresh, expandable styles
    <tr>
      {hasSelection && <td className={clsx(bodyCellStyles['body-cell'])}></td>}
      <td
        colSpan={hasSelection ? totalColumnsCount - 1 : totalColumnsCount}
        className={clsx(
          styles['loader-cell'],
          bodyCellStyles['body-cell'],
          isExpandable && bodyCellStyles['body-cell-expandable'],
          isExpandable && bodyCellStyles[`body-cell-expandable-level-${getLevelClassSuffix(level)}`]
        )}
      >
        <div ref={cellContentRef} className={styles['loader-cell-content']}>
          {content}
        </div>
      </td>
    </tr>
  );
}

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
