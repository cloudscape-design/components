// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import sharedStyles from '../../../resize/styles.css.js';
import styles from '../styles.css.js';

const TopPageSlot = (props: SkeletonLayoutProps) => {
  const { toolbar, navigation, navigationOpen, toolsOpen, navigationAnimationDisabled } = props;
  return (
    <>
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
    </>
  );
};

export const createWidgetizedAppLayoutTopPageSlot = createWidgetizedComponent(TopPageSlot);
