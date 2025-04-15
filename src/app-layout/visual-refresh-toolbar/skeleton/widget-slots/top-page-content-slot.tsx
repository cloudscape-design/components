// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { highContrastHeaderClassName } from '../../../../internal/utils/content-header-utils';
import { createWidgetizedComponent } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import styles from '../styles.css.js';

const TopPageContentSlot = (props: SkeletonLayoutProps) => {
  const { notifications, headerVariant } = props;
  return (
    <>
      {notifications && (
        <div
          className={clsx(
            styles['notifications-background'],
            headerVariant === 'high-contrast' && highContrastHeaderClassName
          )}
        ></div>
      )}
      {notifications}
    </>
  );
};

export const createWidgetizedAppLayoutTopPageContentSlot = createWidgetizedComponent(TopPageContentSlot);
