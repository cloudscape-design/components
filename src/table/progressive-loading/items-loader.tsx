// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalLiveRegion from '../../live-region/internal';
import { TableProps } from '../interfaces';
import { applyTrackBy } from '../utils';

import styles from './styles.css.js';

export interface ItemsLoaderProps<T> {
  item: null | T;
  loadingStatus: TableProps.LoadingStatus;
  renderLoaderPending?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  renderLoaderLoading?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  renderLoaderError?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  renderLoaderEmpty?: (detail: TableProps.RenderLoaderDetail<T>) => React.ReactNode;
  trackBy?: TableProps.TrackBy<T>;
}

export function ItemsLoader<T>({
  item,
  loadingStatus,
  renderLoaderPending,
  renderLoaderLoading,
  renderLoaderError,
  renderLoaderEmpty,
  trackBy,
}: ItemsLoaderProps<T>) {
  let content: React.ReactNode = null;
  if (loadingStatus === 'pending' && renderLoaderPending) {
    content = renderLoaderPending({ item });
  } else if (loadingStatus === 'loading' && renderLoaderLoading) {
    content = <InternalLiveRegion tagName="span">{renderLoaderLoading({ item })}</InternalLiveRegion>;
  } else if (loadingStatus === 'error' && renderLoaderError) {
    content = <InternalLiveRegion tagName="span">{renderLoaderError({ item })}</InternalLiveRegion>;
  } else if (loadingStatus === 'empty' && renderLoaderEmpty) {
    content = <InternalLiveRegion tagName="span">{renderLoaderEmpty({ item })}</InternalLiveRegion>;
  } else {
    warnOnce(
      'Table',
      'Must define `renderLoaderPending`, `renderLoaderLoading`, `renderLoaderError`, or `renderLoaderEmpty` when using corresponding loading status.'
    );
  }

  let parentTrackId = item && trackBy ? applyTrackBy(trackBy, item) : undefined;
  parentTrackId = typeof parentTrackId === 'string' ? parentTrackId : undefined;
  return (
    <div data-root={item ? 'false' : 'true'} data-parentrow={parentTrackId} className={styles['items-loader']}>
      {content}
    </div>
  );
}
