// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import customCssProps from '../../../internal/generated/custom-css-properties';
import { AppLayoutPropsWithDefaults } from '../../interfaces';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

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
    | 'navigationOpen'
    | 'navigationWidth'
    | 'tools'
    | 'toolsOpen'
    | 'toolsWidth'
    | 'placement'
  > {
  style?: React.CSSProperties;
  toolbar?: React.ReactNode;
  splitPanelOpen?: boolean;
  sideSplitPanel?: React.ReactNode;
  bottomSplitPanel?: React.ReactNode;
}

export function SkeletonLayout({
  style,
  notifications,
  contentHeader,
  content,
  navigation,
  navigationOpen,
  navigationWidth,
  tools,
  toolsOpen,
  toolsWidth,
  toolbar,
  sideSplitPanel,
  bottomSplitPanel,
  splitPanelOpen,
  placement,
  contentType,
  maxContentWidth,
  disableContentPaddings,
}: SkeletonLayoutProps) {
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;
  const anyPanelOpen = navigationOpen || toolsOpen;
  return (
    <div
      className={clsx(styles.root, testutilStyles.root, {
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
      {navigation && (
        <div
          className={clsx(
            styles.navigation,
            !navigationOpen && styles['panel-hidden'],
            toolsOpen && styles['unfocusable-mobile'],
            sharedStyles['with-motion']
          )}
        >
          {navigation}
        </div>
      )}
      {toolbar}
      <main className={clsx(styles['main-landmark'], anyPanelOpen && styles['unfocusable-mobile'])}>
        {notifications}
        <div className={clsx(styles.main, { [styles['main-disable-paddings']]: disableContentPaddings })} style={style}>
          {contentHeader && <div className={styles['content-header']}>{contentHeader}</div>}
          <div className={clsx(styles.content, testutilStyles.content)}>{content}</div>
        </div>
        {bottomSplitPanel && (
          <div className={clsx(styles['split-panel-bottom'])} style={{ insetBlockEnd: placement.insetBlockEnd }}>
            {bottomSplitPanel}
          </div>
        )}
      </main>
      {sideSplitPanel && (
        <div className={clsx(styles['split-panel-side'], !splitPanelOpen && styles['panel-hidden'])}>
          {sideSplitPanel}
        </div>
      )}
      {
        <div className={clsx(styles.tools, !toolsOpen && styles['panel-hidden'], sharedStyles['with-motion'])}>
          {tools}
        </div>
      }
    </div>
  );
}
