// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';
import clsx from 'clsx';
import { AppLayoutContext } from '../app-layout/visual-refresh/context';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../app-layout/visual-refresh/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

export { ContentLayoutProps };

export default function ContentLayout({ children, disableOverlap, header, ...rest }: ContentLayoutProps) {
  const baseProps = getBaseProps(rest);
  const { breadcrumbs } = useContext(AppLayoutContext);
  const isVisualRefresh = useVisualRefresh();

  const rootElement = useRef<HTMLDivElement>(null);
  const { __internalRootRef } = useBaseComponent('ContentLayout');
  const overlapElement = useDynamicOverlap();
  const mergedRef = useMergeRefs(rootElement, __internalRootRef, overlapElement);

  const isOverlapDisabled = !children || !header || disableOverlap;

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
      })}
      ref={mergedRef}
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

applyDisplayName(ContentLayout, 'ContentLayout');
