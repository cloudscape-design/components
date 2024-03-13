// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

type InternalContentLayoutProps = ContentLayoutProps & InternalBaseComponentProps;

export default function InternalContentLayout({
  children,
  disableOverlap,
  header,
  __internalRootRef,
  ...rest
}: InternalContentLayoutProps) {
  const baseProps = getBaseProps(rest);

  const isVisualRefresh = useVisualRefresh();
  const overlapElement = useDynamicOverlap();

  const isOverlapDisabled = !children || disableOverlap;

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
        [styles['has-header']]: !!header,
      })}
      ref={__internalRootRef}
    >
      <div
        className={clsx(
          styles.background,
          { [styles['is-overlap-disabled']]: isOverlapDisabled },
          getContentHeaderClassName()
        )}
        ref={overlapElement}
      />

      {header && <div className={clsx(styles.header, getContentHeaderClassName())}>{header}</div>}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
