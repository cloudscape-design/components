// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import customCssProps from '../../../internal/generated/custom-css-properties';
import { useMobile } from '../../../internal/hooks/use-mobile';
import { highContrastHeaderClassName } from '../../../internal/utils/content-header-utils';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutPropsWithDefaults } from '../../interfaces';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

const contentTypeCustomWidths: Array<string | undefined> = ['dashboard', 'cards', 'table'];

export interface SkeletonLayoutProps
  extends Pick<
    AppLayoutPropsWithDefaults,
    | 'notifications'
    | 'headerVariant'
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
  globalTools?: React.ReactNode;
  globalToolsOpen?: boolean;
  navigationAnimationDisabled?: boolean;
  isNested?: boolean;
  rootRef?: React.Ref<HTMLDivElement>;
}

export const SkeletonLayoutImplementation = ({
  style,
  notifications,
  headerVariant,
  contentHeader,
  content,
  navigation,
  navigationOpen,
  navigationWidth,
  tools,
  globalTools,
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
  globalToolsOpen,
  navigationAnimationDisabled,
  isNested,
  rootRef,
}: SkeletonLayoutProps) => {
  const isMobile = useMobile();
  const isMaxWidth = maxContentWidth === Number.MAX_VALUE || maxContentWidth === Number.MAX_SAFE_INTEGER;
  const anyPanelOpen = navigationOpen || toolsOpen;
  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, testutilStyles.root, {
        [styles['has-adaptive-widths-default']]: !contentTypeCustomWidths.includes(contentType),
        [styles['has-adaptive-widths-dashboard']]: contentType === 'dashboard',
      })}
      style={{
        minBlockSize: isNested ? '100%' : `calc(100vh - ${placement.insetBlockStart + placement.insetBlockEnd}px)`,
        [customCssProps.maxContentWidth]: isMaxWidth ? '100%' : maxContentWidth ? `${maxContentWidth}px` : '',
        [customCssProps.navigationWidth]: `${navigationWidth}px`,
        [customCssProps.toolsWidth]: `${toolsWidth}px`,
      }}
    >
      {toolbar}
      {navigation && (
        <div
          className={clsx(
            styles.navigation,
            !navigationOpen && styles['panel-hidden'],
            toolsOpen && styles['unfocusable-mobile'],
            !navigationAnimationDisabled && sharedStyles['with-motion-horizontal']
          )}
        >
          {navigation}
        </div>
      )}
      <main className={clsx(styles['main-landmark'], isMobile && anyPanelOpen && styles['unfocusable-mobile'])}>
        {notifications && (
          <div
            className={clsx(
              styles['notifications-background'],
              headerVariant === 'high-contrast' && highContrastHeaderClassName
            )}
          ></div>
        )}
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
      <div
        className={clsx(
          styles.tools,
          !toolsOpen && styles['panel-hidden'],
          sharedStyles['with-motion-horizontal'],
          navigationOpen && !toolsOpen && styles['unfocusable-mobile'],
          toolsOpen && styles['tools-open']
        )}
      >
        {tools}
      </div>
      <div className={clsx(styles['global-tools'], !globalToolsOpen && styles['panel-hidden'])}>{globalTools}</div>
    </div>
  );
};

export const createWidgetizedSkeletonLayout = createWidgetizedComponent(SkeletonLayoutImplementation);
