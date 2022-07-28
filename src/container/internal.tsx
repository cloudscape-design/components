// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext, useLayoutEffect, useRef } from 'react';
import { AppLayoutContext } from '../app-layout/visual-refresh/context';
import { ContainerProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

export interface InternalContainerProps extends Omit<ContainerProps, 'variant'>, InternalBaseComponentProps {
  __stickyHeader?: boolean;
  __stickyOffset?: number;
  __disableFooterDivider?: boolean;
  __disableFooterPaddings?: boolean;
  __headerRef?: React.RefObject<HTMLDivElement>;
  /**
   * Additional internal variant:
   * * `embedded` - Use this variant within a parent container (such as a modal,
   *                expandable section, container or split panel).
   * * `full-page` – Only for internal use in table, cards and other components
   */
  variant?: ContainerProps['variant'] | 'embedded' | 'full-page' | 'cards';
}

export default function InternalContainer({
  header,
  footer,
  children,
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  __stickyOffset,
  __stickyHeader = false,
  __internalRootRef = null,
  __disableFooterDivider = false,
  __disableFooterPaddings = false,
  __headerRef,
  ...restProps
}: InternalContainerProps) {
  const baseProps = getBaseProps(restProps);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isRefresh = useVisualRefresh();
  const hasDynamicHeight = isRefresh && variant === 'full-page';
  const { isSticky, isStuck, stickyStyles } = useStickyHeader(rootRef, headerRef, __stickyHeader, __stickyOffset);

  /**
   * Observe the dynamic height of the full page container variant in
   * visual refresh and update the AppLayout dynamicOverlapHeight property.
   */
  const { setDynamicOverlapHeight } = useContext(AppLayoutContext);
  const [overlapContainerQuery, overlapElement] = useContainerQuery(rect => rect.height);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (hasDynamicHeight) {
        setDynamicOverlapHeight(overlapContainerQuery ?? 0);
      }
    },
    [hasDynamicHeight, overlapContainerQuery, setDynamicOverlapHeight]
  );

  const mergedRef = useMergeRefs(rootRef, __internalRootRef);
  const headerMergedRef = useMergeRefs(headerRef, overlapElement, __headerRef);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[`variant-${variant}`])}
      ref={mergedRef}
    >
      {header && (
        <StickyHeaderContext.Provider value={{ isStuck }}>
          <div
            className={clsx(styles.header, styles[`header-variant-${variant}`], {
              [styles['header-sticky-disabled']]: __stickyHeader && !isSticky,
              [styles['header-sticky-enabled']]: isSticky,
              [styles['header-dynamic-height']]: hasDynamicHeight,
              [styles['header-stuck']]: isStuck,
              [styles['with-paddings']]: !disableHeaderPaddings,
            })}
            {...stickyStyles}
            ref={headerMergedRef}
          >
            {hasDynamicHeight ? (
              <div className={clsx(styles['dark-header'], 'awsui-context-content-header')}>{header}</div>
            ) : (
              header
            )}
          </div>
        </StickyHeaderContext.Provider>
      )}
      <div
        className={clsx(styles.content, {
          [styles['with-paddings']]: !disableContentPaddings,
        })}
      >
        {children}
      </div>
      {footer && (
        <div
          className={clsx(styles.footer, {
            [styles['with-divider']]: !__disableFooterDivider,
            [styles['with-paddings']]: !__disableFooterPaddings,
          })}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
