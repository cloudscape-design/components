// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutPropsWithDefaults } from '../interfaces';
import styles from './styles.css.js';
import customCssProps from '../../internal/generated/custom-css-properties';
import clsx from 'clsx';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

interface SkeletonLayoutProps
  extends Pick<
    AppLayoutPropsWithDefaults,
    | 'notifications'
    | 'contentHeader'
    | 'content'
    | 'contentType'
    | 'maxContentWidth'
    | 'disableContentPaddings'
    | 'navigation'
    | 'navigationWidth'
    | 'tools'
    | 'toolsWidth'
    | 'placement'
  > {
  topBar?: React.ReactNode;
  sideSplitPanel?: React.ReactNode;
  bottomSplitPanel?: React.ReactNode;
}

export function SkeletonLayout({
  notifications,
  contentHeader,
  content,
  navigation,
  navigationWidth,
  tools,
  toolsWidth,
  topBar,
  sideSplitPanel,
  bottomSplitPanel,
  placement,
  contentType,
  maxContentWidth,
  disableContentPaddings,
}: SkeletonLayoutProps) {
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;
  return (
    <div
      className={clsx(styles.root, {
        [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
        [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
      })}
      style={{
        minBlockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
        [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
        [customCssProps.navigationWidth]: `${navigationWidth}px`,
        [customCssProps.toolsWidth]: `${toolsWidth}px`,
      }}
    >
      {/*TODO: render conditionally*/}
      <section className={styles['top-bar']}>{topBar}</section>
      {navigation && <div className={styles.navigation}>{navigation}</div>}
      <main className={styles['main-landmark']}>
        {notifications && <div className={styles.notifications}>{notifications}</div>}
        <div className={clsx(styles.main, { [styles['main-disable-paddings']]: disableContentPaddings })}>
          {contentHeader && <div className={styles['content-header']}>{contentHeader}</div>}
          <div>{content}</div>
        </div>
        {bottomSplitPanel}
      </main>
      {sideSplitPanel && <div className={styles['split-panel-side']}>{sideSplitPanel}</div>}
      {tools && <div className={styles.tools}>{tools}</div>}
    </div>
  );
}
