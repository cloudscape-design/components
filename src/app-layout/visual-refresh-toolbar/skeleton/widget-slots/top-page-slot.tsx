// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { useMultiAppLayout } from '../../multi-layout';
import { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../../navigation';
import { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../../toolbar';
import { SkeletonLayoutProps } from '../index';
import { ToolbarSkeleton } from '../slot-skeletons';

import sharedStyles from '../../../resize/styles.css.js';
import styles from '../styles.css.js';

export const TopPageSlot = (props: SkeletonLayoutProps) => {
  const {
    appLayoutState: {
      resolvedNavigationOpen,
      navigationAnimationDisabled,
      activeDrawer,
      hasToolbar,
      appLayoutInternals,
      toolbarProps,
      resolvedNavigation,
    },
  } = props;
  const toolsOpen = !!activeDrawer;
  return (
    <>
      {hasToolbar && <AppLayoutToolbar appLayoutInternals={appLayoutInternals} toolbarProps={toolbarProps!} />}
      {resolvedNavigation && (
        <div
          className={clsx(
            styles.navigation,
            !resolvedNavigationOpen && styles['panel-hidden'],
            toolsOpen && styles['unfocusable-mobile'],
            !navigationAnimationDisabled && sharedStyles['with-motion-horizontal']
          )}
        >
          {resolvedNavigation && <AppLayoutNavigation appLayoutInternals={appLayoutInternals} />}
        </div>
      )}
    </>
  );
};

export const TopPageSlotSkeleton = React.forwardRef<HTMLElement, SkeletonLayoutProps>((props, ref) => {
  const { appLayoutProps } = props;
  const { __embeddedViewMode: embeddedViewMode } = appLayoutProps as any;
  const { toolbarProps } = useMultiAppLayout(appLayoutProps as any, true);
  const hasToolbar = !embeddedViewMode && !!toolbarProps;
  const resolvedNavigation = appLayoutProps?.navigationHide ? null : appLayoutProps?.navigation || <></>;
  const resolvedNavigationOpen = !!resolvedNavigation && appLayoutProps?.navigationOpen;
  return (
    <>
      {hasToolbar && (
        <ToolbarSkeleton ref={ref as React.Ref<any>} toolbarProps={{} as any} appLayoutInternals={{} as any} />
      )}
      {resolvedNavigationOpen && <div className={styles.navigation} />}
    </>
  );
});

export const createWidgetizedAppLayoutTopPageSlot = createWidgetizedComponent(TopPageSlot, TopPageSlotSkeleton);
