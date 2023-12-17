// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
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
  __internalRootRef,
  ...rest
}: InternalContentLayoutProps) {
  const baseProps = getBaseProps(rest);
  const rootElement = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(rootElement, __internalRootRef);

  const isVisualRefresh = useVisualRefresh();
  const overlapElement = useDynamicOverlap();

  const isOverlapDisabled = !children || disableOverlap;

  /**
   * Mutation observer for Cloudscape User Settings
   * Category: Theme
   * Property: High Contrast Header
   */
  const [userSettingsThemeHighContrastHeader, setUserSettingsThemeHighContrastHeader] = React.useState('enabled');

  function callback(mutationList: any) {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes') {
        setUserSettingsThemeHighContrastHeader(mutation.target.dataset.userSettingsThemeHighContrastHeader);
      }
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(document.body, { attributeFilter: ['data-user-settings-theme-high-contrast-header'] });

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
          userSettingsThemeHighContrastHeader === 'enabled' && 'awsui-context-content-header'
        )}
        ref={overlapElement}
      />

      {header && <div className={clsx(styles.header, 'awsui-context-content-header')}>{header}</div>}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
