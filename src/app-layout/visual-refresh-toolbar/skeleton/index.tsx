// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { highContrastHeaderClassName } from '../../../internal/utils/content-header-utils';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutPropsWithDefaults } from '../../interfaces';
import { useSkeletonSlotsAttributes } from '../internal';

import sharedStyles from '../../resize/styles.css.js';
import styles from './styles.css.js';

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

export const SkeletonLayoutImplementation = (props: SkeletonLayoutProps) => {
  const {
    notifications,
    headerVariant,
    contentHeader,
    content,
    navigation,
    navigationOpen,
    tools,
    globalTools,
    toolsOpen,
    toolbar,
    sideSplitPanel,
    bottomSplitPanel,
    splitPanelOpen,
    placement,
    globalToolsOpen,
    navigationAnimationDisabled,
  } = props;
  const {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = useSkeletonSlotsAttributes(props) ?? {};

  return (
    <div {...wrapperElAttributes}>
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
      <main {...mainElAttributes}>
        {notifications && (
          <div
            className={clsx(
              styles['notifications-background'],
              headerVariant === 'high-contrast' && highContrastHeaderClassName
            )}
          ></div>
        )}
        {notifications}
        <div {...contentWrapperElAttributes}>
          {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
          <div {...contentElAttributes}>{content}</div>
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
