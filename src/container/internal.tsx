// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsLabelAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useFunnelSubstep } from '../internal/analytics/funnel/hooks/use-funnel-substep';
import { AnalyticsMetadata } from '../internal/analytics/interfaces';
import { getBaseProps } from '../internal/base-component';
import { ContainerHeaderContextProvider } from '../internal/context/container-header';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { ContainerProps } from './interfaces';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface InternalContainerProps
  extends Omit<ContainerProps, 'variant'>,
    InternalBaseComponentProps<HTMLElement> {
  __stickyHeader?: boolean;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  __disableFooterDivider?: boolean;
  __disableFooterPaddings?: boolean;
  __hiddenContent?: boolean;
  __headerRef?: React.RefObject<HTMLDivElement>;
  __fullPage?: boolean;
  __disableStickyMobile?: boolean;
  /**
   * Additional internal variant:
   * * `embedded` - Use this variant within a parent container (such as a modal,
   *                expandable section, container or split panel).
   * * `full-page` – Only for internal use in table, cards and other components
   */
  variant?: ContainerProps['variant'] | 'embedded' | 'full-page' | 'cards';
}

export function InternalContainerAsSubstep(props: InternalContainerProps & { analyticsMetadata?: AnalyticsMetadata }) {
  const ref = useRef<HTMLDivElement>(null);
  const funnelSubstep = useFunnelSubstep(ref, props.analyticsMetadata);

  return <InternalContainer {...props} __internalRootRef={ref} {...funnelSubstep.domAttributes} />;
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
  __internalRootRef,
  __stickyOffset,
  __mobileStickyOffset,
  __stickyHeader = false,
  __disableFooterDivider = false,
  __disableFooterPaddings = false,
  __hiddenContent = false,
  __headerRef,
  __fullPage = false,
  __disableStickyMobile = true,
  ...restProps
}: InternalContainerProps) {
  const isMobile = useMobile();
  const isRefresh = useVisualRefresh();
  const baseProps = getBaseProps(restProps);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isSticky, isStuck, stickyStyles } = useStickyHeader(
    rootRef,
    headerRef,
    __stickyHeader,
    __stickyOffset,
    __mobileStickyOffset,
    __disableStickyMobile,
    __fullPage && isRefresh && !isMobile
  );
  const contentId = useUniqueId();

  const hasDynamicHeight = isRefresh && variant === 'full-page';

  const mergedRef = useMergeRefs(rootRef, __internalRootRef);
  const headerMergedRef = useMergeRefs(headerRef, __headerRef);

  // The container is only sticky on mobile if it is the header for the table.
  // In this case we don't want the container to have sticky styles, as only the table header row will show as stuck on scroll.
  const shouldHaveStickyStyles = isSticky && !isMobile;

  const hasMedia = !!media?.content;
  const mediaPosition = media?.position ?? 'top';
  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['fit-height'],
        hasMedia && (mediaPosition === 'side' ? styles['with-side-media'] : styles['with-top-media']),
        shouldHaveStickyStyles && [styles['sticky-enabled']],
        isRefresh && styles.refresh
      )}
      ref={mergedRef}
      {...getAnalyticsLabelAttribute(
        `.${analyticsSelectors.header} h1, .${analyticsSelectors.header} h2, .${analyticsSelectors.header} h3`
      )}
    >
      {hasMedia && (
        <div
          className={clsx(styles[`media-${mediaPosition === 'side' ? 'side' : 'top'}`], styles.media)}
          style={mediaPosition === 'top' ? { height: media?.height || '' } : { width: media?.width || '' }}
        >
          {media.content}
        </div>
      )}
      <div
        id={contentId}
        className={clsx(styles['content-wrapper'], fitHeight && styles['content-wrapper-fit-height'])}
      >
        {header && (
          <ContainerHeaderContextProvider>
            <StickyHeaderContext.Provider value={{ isStuck }}>
              <div
                className={clsx(
                  isRefresh && styles.refresh,
                  styles.header,
                  analyticsSelectors.header,
                  styles[`header-variant-${variant}`],
                  {
                    [styles['header-sticky-disabled']]: __stickyHeader && !isSticky,
                    [styles['header-sticky-enabled']]: isSticky,
                    [styles['header-dynamic-height']]: hasDynamicHeight,
                    [styles['header-stuck']]: isStuck,
                    [styles['with-paddings']]: !disableHeaderPaddings,
                    [styles['with-hidden-content']]: !children || __hiddenContent,
                    [styles['header-with-media']]: hasMedia,
                    [styles['header-full-page']]: __fullPage && isRefresh,
                  }
                )}
                {...stickyStyles}
                ref={headerMergedRef}
              >
                {isStuck && !isMobile && isRefresh && __fullPage && <div className={styles['header-cover']}></div>}
                {header}
              </div>
            </StickyHeaderContext.Provider>
          </ContainerHeaderContextProvider>
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
