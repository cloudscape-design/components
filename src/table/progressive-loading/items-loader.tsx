// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import LiveRegion from '../../internal/components/live-region';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { TableProps } from '../interfaces';
import { applyTrackBy } from '../utils';

interface ItemsLoaderProps<T> {
  item: null | T;
  loadingStatus: TableProps.LoadingStatus;
  renderLoaderPending?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  renderLoaderLoading?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  renderLoaderError?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  trackBy?: TableProps.TrackBy<T>;
}

export function ItemsLoader<T>({
  item,
  loadingStatus,
  renderLoaderPending,
  renderLoaderLoading,
  renderLoaderError,
  trackBy,
}: ItemsLoaderProps<T>) {
  let content: React.ReactNode = null;
  if (loadingStatus === 'pending' && renderLoaderPending) {
    content = renderLoaderPending({ item });
  } else if (loadingStatus === 'loading' && renderLoaderLoading) {
    content = <LiveRegion visible={true}>{renderLoaderLoading({ item })}</LiveRegion>;
  } else if (loadingStatus === 'error' && renderLoaderError) {
    content = <LiveRegion visible={true}>{renderLoaderError({ item })}</LiveRegion>;
  } else {
    warnOnce(
      'Table',
      'Must define `renderLoaderPending`, `renderLoaderLoading`, or `renderLoaderError` when using corresponding loading status.'
    );
  }

  let parentTrackId = item && trackBy ? applyTrackBy(trackBy, item) : undefined;
  parentTrackId = typeof parentTrackId === 'string' ? parentTrackId : undefined;
  return (
    <div className={styles['items-loader']} data-root={item ? 'false' : 'true'} data-parentrow={parentTrackId}>
      {content}
    </div>
  );
}
