// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { ContainerProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useContainerBreakpoints, useResizeObserver } from '../internal/hooks/container-queries';

export interface InternalContainerProps extends Omit<ContainerProps, 'variant'>, InternalBaseComponentProps {
  __stickyHeader?: boolean;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  __disableFooterDivider?: boolean;
  __disableFooterPaddings?: boolean;
  __hiddenContent?: boolean;
  __headerRef?: React.RefObject<HTMLDivElement>;
  __headerId?: string;
  __darkHeader?: boolean;
  __disableStickyMobile?: boolean;
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
  media,
  __stickyOffset,
  __mobileStickyOffset,
  __stickyHeader = false,
  __internalRootRef = null,
  __disableFooterDivider = false,
  __disableFooterPaddings = false,
  __hiddenContent = false,
  __headerRef,
  __headerId,
  __darkHeader = false,
  __disableStickyMobile = true,
  ...restProps
}: InternalContainerProps) {
  const isMobile = useMobile();
  const baseProps = getBaseProps(restProps);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isSticky, isStuck, stickyStyles } = useStickyHeader(
    rootRef,
    headerRef,
    __stickyHeader,
    __stickyOffset,
    __mobileStickyOffset,
    __disableStickyMobile
  );
  const { setHasStickyBackground } = useAppLayoutContext();
  const isRefresh = useVisualRefresh();

  const hasDynamicHeight = isRefresh && variant === 'full-page';
  const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight || !__darkHeader });
  //const smallContainer = defaultBreakpoint === 'default';

  const mergedRef = useMergeRefs(rootRef, __internalRootRef);
  const headerMergedRef = useMergeRefs(headerRef, overlapElement, __headerRef);
  const headerIdProp = __headerId ? { id: __headerId } : {};

  const [orientation, setOrientation] = useState(media?.orientation);
  useResizeObserver(rootRef, e => console.log('resize', e));
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

  const [mediaHeight, setMediaHeight] = useState(null);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [mediaOrientation, setMediaOrientation] = useState('horizontal');

  // The container is only sticky on mobile if it is the header for the table.
  // In this case we don't want the container to have sticky styles, as only the table header row will show as stuck on scroll.
  const shouldHaveStickyStyles = isSticky && !isMobile;

  function getMediaStyles() {
    return orientation === 'vertical' ? mediaWidth : mediaHeight;
  }

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['fit-height'],
        media?.orientation === 'vertical' && styles['vertical-media'],
        shouldHaveStickyStyles && [styles['sticky-enabled']]
      )}
      ref={mergedRef}
    >
      {media?.content && (
        <div
          className={clsx(styles[`media-${media?.orientation}`], styles.media)}
          // style={{ height: '200px', backgroundColor: 'red' }}
        >
          {media?.content}
        </div>
      )}
      <div className={styles['content-wrapper']}>
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
    </div>
  );
}
