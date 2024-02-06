// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

type InternalContentLayoutProps = ContentLayoutProps & InternalBaseComponentProps;

export default function InternalContentLayout({
  children,
  disableOverlap,
  header,
  heroHeader,
  __internalRootRef,
  ...rest
}: InternalContentLayoutProps) {
  const baseProps = getBaseProps(rest);
  const rootElement = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(rootElement, __internalRootRef);

  const isVisualRefresh = useVisualRefresh();
  const overlapElement = useDynamicOverlap();

  const isOverlapDisabled = !children || disableOverlap;
  const isHeroHeader = heroHeader;

  console.log('ContentLayout is ' + isHeroHeader);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
        [styles['has-header']]: !!header,
      })}
      ref={mergedRef}
    >
      <div
        className={clsx(
          styles.background,
          { [styles['is-overlap-disabled']]: isOverlapDisabled },
          isHeroHeader && styles.hero,
          getContentHeaderClassName()
        )}
        ref={overlapElement}
      />

      {header && <div className={clsx(styles.header, getContentHeaderClassName())}>{header}</div>}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
