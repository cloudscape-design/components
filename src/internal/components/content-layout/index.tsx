// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from '../../../app-layout/visual-refresh/context';
import { ContentLayoutProps } from './interfaces';
import { useContainerQuery } from '../../hooks/container-queries';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import styles from './styles.css.js';

export { ContentLayoutProps };

export default function ContentLayout({ children, disableOverlap, header }: ContentLayoutProps) {
  const { breadcrumbs, setDynamicOverlapHeight } = useContext(AppLayoutContext);
  const isVisualRefresh = useVisualRefresh();
  const isOverlapDisabled = !children || !header || disableOverlap;

  // Documentation to be added.
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
      className={clsx(styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
      })}
    >
      <div
        className={clsx(
          styles.background,
          { [styles['is-overlap-disabled']]: isOverlapDisabled },
          'awsui-context-content-header'
        )}
        ref={overlapElement}
      />

      {header && (
        <div
          className={clsx(styles.header, { [styles['has-breadcrumbs']]: breadcrumbs }, 'awsui-context-content-header')}
        >
          {header}
        </div>
      )}

      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
