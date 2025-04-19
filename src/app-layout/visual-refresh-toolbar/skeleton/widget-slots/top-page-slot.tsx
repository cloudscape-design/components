// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { AppLayoutNavigationImplementation as AppLayoutNavigation } from '../../navigation';
import { AppLayoutToolbarImplementation as AppLayoutToolbar } from '../../toolbar';
import { SkeletonLayoutProps } from '../index';

import sharedStyles from '../../../resize/styles.css.js';
import styles from '../styles.css.js';

const TopPageSlot = (props: SkeletonLayoutProps) => {
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

export const createWidgetizedAppLayoutTopPageSlot = createWidgetizedComponent(TopPageSlot);
