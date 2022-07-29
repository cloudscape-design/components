// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext, useLayoutEffect } from 'react';
import { AppLayoutContext } from '../app-layout/visual-refresh/context.js';
import { useContainerQuery } from '../internal/hooks/container-queries';
import styles from './styles.css.js';

interface WizardFormHeaderProps {
  children: React.ReactNode;
  isMobile: boolean;
  isVisualRefresh: boolean;
}

export default function WizardFormHeader({ children, isVisualRefresh }: WizardFormHeaderProps) {
  /**
   * Observe the dynamic height of the Wizard header in visual refresh and
   * update the AppLayout dynamicOverlapHeight property.
   */
  const { setDynamicOverlapHeight } = useContext(AppLayoutContext);
  const [overlapContainerQuery, overlapElement] = useContainerQuery(rect => rect.height);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (isVisualRefresh) {
        setDynamicOverlapHeight(overlapContainerQuery ?? 0);
      }
    },
    [isVisualRefresh, overlapContainerQuery, setDynamicOverlapHeight]
  );

  return (
    <div
      className={clsx(
        styles['form-header'],
        isVisualRefresh && styles['form-header-refresh'],
        isVisualRefresh && 'awsui-context-content-header'
      )}
      ref={overlapElement}
    >
      <div className={clsx(styles['form-header-content'])}>{children}</div>
    </div>
  );
}
