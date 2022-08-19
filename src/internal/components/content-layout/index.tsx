// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from '../../../app-layout/visual-refresh/context';
import { ContentLayoutProps } from './interfaces';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import styles from './styles.css.js';
import { useDynamicOverlap } from '../../../app-layout/visual-refresh/hooks/use-dynamic-overlap';

export { ContentLayoutProps };

export default function ContentLayout({ children, disableOverlap, header }: ContentLayoutProps) {
  const { breadcrumbs } = useContext(AppLayoutContext);
  const isVisualRefresh = useVisualRefresh();
  const isOverlapDisabled = !children || !header || disableOverlap;

  const overlapElement = useDynamicOverlap();

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
