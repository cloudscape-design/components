// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { ContainerProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

export interface InternalContainerProps extends Omit<ContainerProps, 'variant'>, InternalBaseComponentProps {
  __stickyHeader?: boolean;
  __stickyOffset?: number;
  __disableFooterDivider?: boolean;
  __disableFooterPaddings?: boolean;
  __hiddenContent?: boolean;
  __headerRef?: React.RefObject<HTMLDivElement>;
  __headerId?: string;
  __darkHeader?: boolean;
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
  fitHeight,
  __stickyOffset,
  __stickyHeader = false,
  __internalRootRef = null,
  __disableFooterDivider = false,
  __disableFooterPaddings = false,
  __hiddenContent = false,
  __headerRef,
  __headerId,
  __darkHeader = false,
  ...restProps
}: InternalContainerProps) {
  const baseProps = getBaseProps(restProps);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isSticky, isStuck, stickyStyles } = useStickyHeader(rootRef, headerRef, __stickyHeader, __stickyOffset);
  const { setHasStickyBackground } = useAppLayoutContext();
  const isRefresh = useVisualRefresh();

  const hasDynamicHeight = isRefresh && variant === 'full-page';
  const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight || !__darkHeader });

  const mergedRef = useMergeRefs(rootRef, __internalRootRef);
  const headerMergedRef = useMergeRefs(headerRef, overlapElement, __headerRef);
  const headerIdProp = __headerId ? { id: __headerId } : {};

  /**
   * The visual refresh AppLayout component needs to know if a child component
   * has a high contrast sticky header. This is to make sure the background element
   * stays in the same vertical position as the header content.
   */
  useEffect(() => {
    const shouldUpdateStickyBackground = isSticky && variant === 'full-page' && setHasStickyBackground;
    if (shouldUpdateStickyBackground) {
      setHasStickyBackground(true);
    }

    return () => {
      if (shouldUpdateStickyBackground) {
        setHasStickyBackground(false);
      }
    };
  }, [isSticky, setHasStickyBackground, variant]);

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['root-fit-height']
      )}
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
              [styles['with-hidden-content']]: !children || __hiddenContent,
            })}
            {...headerIdProp}
            {...stickyStyles}
            ref={headerMergedRef}
          >
            {__darkHeader ? (
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
