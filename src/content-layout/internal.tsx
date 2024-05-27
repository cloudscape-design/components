// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { highContrastHeaderClassName } from '../internal/utils/content-header-utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import customCssProps from '../internal/generated/custom-css-properties';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import InternalGrid from '../grid/internal';

type InternalContentLayoutProps = ContentLayoutProps & InternalBaseComponentProps;

const halfGeckoMaxCssLength = ((1 << 30) - 1) / 120;
// CSS lengths in Gecko are limited to at most (1<<30)-1 app units (Gecko uses 60 as app unit).
// Limit the maxContentWidth to the half of the upper boundary (≈4230^2) to be on the safe side.

export default function InternalContentLayout({
  children,
  disableOverlap,
  header,
  headerVariant = 'default',
  headerBackgroundStyle,
  __internalRootRef,
  maxContentWidth = Number.MAX_VALUE,
  breadcrumbs,
  notifications,
  defaultPadding,
  secondaryHeader,
  ...rest
}: InternalContentLayoutProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(mainRef, __internalRootRef);

  const baseProps = getBaseProps(rest);

  const isVisualRefresh = useVisualRefresh();
  const mode = useCurrentMode(mainRef);

  const overlapElement = useDynamicOverlap();

  const isOverlapDisabled = !children || disableOverlap;

  const contentHeaderClassName =
    headerVariant === 'high-contrast' && isVisualRefresh ? highContrastHeaderClassName : '';

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
        [styles['has-header']]: !!header,
        [styles['default-padding']]: !!defaultPadding,
        [styles['has-notifications']]: !!notifications,
      })}
      style={{
        [customCssProps.contentLayoutMaxContentWidth]:
          maxContentWidth < Number.MAX_VALUE ? `${maxContentWidth}px` : `${halfGeckoMaxCssLength}px`,
      }}
      ref={mergedRef}
    >
      <div
        className={clsx(
          styles.background,
          { [styles['has-default-background']]: !headerBackgroundStyle },
          contentHeaderClassName
        )}
        ref={overlapElement}
      >
        {headerBackgroundStyle && (
          <div
            className={clsx(styles['header-background'])}
            style={{
              background:
                typeof headerBackgroundStyle === 'function' ? headerBackgroundStyle(mode) : headerBackgroundStyle,
            }}
          />
        )}
      </div>
      {notifications && (
        <div className={clsx(styles.notifications, testutilStyles.notifications, contentHeaderClassName)}>
          {notifications}
        </div>
      )}
      {breadcrumbs && (
        <div className={clsx(styles.breadcrumbs, testutilStyles.breadcrumbs, contentHeaderClassName)}>
          {breadcrumbs}
        </div>
      )}
      {header && !secondaryHeader && (
        <div
          className={clsx(styles['header-wrapper'], testutilStyles.header, contentHeaderClassName, {
            [styles['with-divider']]: headerVariant === 'divider',
          })}
        >
          {header}
        </div>
      )}
      {header && secondaryHeader && (
        <div
          className={clsx(styles['header-wrapper'], {
            [styles['with-divider']]: headerVariant === 'divider',
          })}
        >
          <InternalGrid gridDefinition={[{ colspan: { default: 12, xs: 9 } }, { colspan: { default: 12, xs: 3 } }]}>
            <div className={clsx(testutilStyles.header, contentHeaderClassName)}>{header}</div>
            <div className={clsx(testutilStyles['secondary-header'])}>{secondaryHeader}</div>
          </InternalGrid>
        </div>
      )}

      <div
        className={clsx(styles.content, {
          [styles['with-divider']]: headerVariant === 'divider',
        })}
      >
        {children}
      </div>
    </div>
  );
}
