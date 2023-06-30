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
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';

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
  const { subStepRef, funnelSubStepProps } = useFunnelSubStep();

  const hasDynamicHeight = isRefresh && variant === 'full-page';
  const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight || !__darkHeader });

  const mergedRef = useMergeRefs(rootRef, subStepRef, __internalRootRef);
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

  // The container is only sticky on mobile if it is the header for the table.
  // In this case we don't want the container to have sticky styles, as only the table header row will show as stuck on scroll.
  const shouldHaveStickyStyles = isSticky && !isMobile;

  const hasMedia = !!media?.content;
  const mediaPosition = media?.position ?? 'top';

  return (
    <div
      {...baseProps}
      {...funnelSubStepProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['fit-height'],
        hasMedia && (mediaPosition === 'side' ? styles['with-side-media'] : styles['with-top-media']),
        shouldHaveStickyStyles && [styles['sticky-enabled']]
      )}
      ref={mergedRef}
    >
      {hasMedia && (
        <div
          className={clsx(styles[`media-${mediaPosition === 'side' ? 'side' : 'top'}`], styles.media)}
          style={mediaPosition === 'top' ? { height: media?.height || '' } : { width: media?.width || '' }}
        >
          {media.content}
        </div>
      )}
      <div className={clsx(styles['content-wrapper'], fitHeight && styles['content-wrapper-fit-height'])}>
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
                [styles['header-with-media']]: hasMedia,
                [styles.refresh]: isRefresh,
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
          className={clsx(styles.content, fitHeight && styles['content-fit-height'], {
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
