// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsLabelAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalBox from '../box/internal';
import { BuiltInErrorBoundary } from '../error-boundary/internal';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getBaseProps } from '../internal/base-component';
import { ContainerHeaderContextProvider } from '../internal/context/container-header';
import { useModalContext } from '../internal/context/modal-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { ContainerProps } from './interfaces';
import { getContentStyles, getFooterStyles, getHeaderStyles, getMediaStyles, getRootStyles } from './style';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export interface InternalContainerProps extends Omit<ContainerProps, 'variant'>, InternalBaseComponentProps {
  disableFooterPaddings?: boolean;
  __stickyHeader?: boolean;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  __disableFooterDivider?: boolean;
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

  __funnelSubStepProps?: ReturnType<typeof useFunnelSubStep>['funnelSubStepProps'];
  __subStepRef?: ReturnType<typeof useFunnelSubStep>['subStepRef'];

  /**
   * React key attached to the content wrapper. It is used to force content re-mount but not container re-mount, which
   * is necessary for components that use container as a root node internally so that their test-utils wrapper is not detached.
   */
  __contentKey?: string;
}

export function InternalContainerAsSubstep(props: InternalContainerProps) {
  const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
  const modalContext = useModalContext();

  return (
    <InternalContainer
      {...props}
      __subStepRef={modalContext?.isInModal ? { current: null } : subStepRef}
      __funnelSubStepProps={modalContext?.isInModal ? {} : funnelSubStepProps}
    />
  );
}

export default function InternalContainer({
  header,
  footer,
  children,
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  disableFooterPaddings = false,
  fitHeight,
  media,
  style,
  __stickyOffset,
  __mobileStickyOffset,
  __stickyHeader = false,
  __internalRootRef,
  __disableFooterDivider = false,
  __hiddenContent = false,
  __headerRef,
  __fullPage = false,
  __disableStickyMobile = true,
  __funnelSubStepProps,
  __subStepRef,
  __contentKey,
  ...restProps
}: InternalContainerProps) {
  const isMobile = useMobile();
  const isRefresh = useVisualRefresh();
  if (isRefresh === false) {
    throw new Error('isRefresh === false');
  }
  const baseProps = getBaseProps(restProps);
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isSticky, isStuck, isStuckAtBottom, stickyStyles } = useStickyHeader(
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
      {...__funnelSubStepProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['fit-height'],
        hasMedia && (mediaPosition === 'side' ? styles['with-side-media'] : styles['with-top-media']),
        shouldHaveStickyStyles && [styles['sticky-enabled']],
        shouldHaveStickyStyles && isStuck && isStuckAtBottom && [styles['with-stuck-sticky-header-at-bottom']],
        isRefresh && styles.refresh
      )}
      ref={mergedRef}
      {...getAnalyticsLabelAttribute(
        `.${analyticsSelectors.header} h1, .${analyticsSelectors.header} h2, .${analyticsSelectors.header} h3`
      )}
      style={getRootStyles(style)}
    >
      {hasMedia && (
        <div
          className={clsx(styles[`media-${mediaPosition === 'side' ? 'side' : 'top'}`], styles.media)}
          style={
            mediaPosition === 'top'
              ? { ...getMediaStyles(mediaPosition, style), height: media?.height || '' }
              : { ...getMediaStyles(mediaPosition, style), width: media?.width || '' }
          }
        >
          {media.content}
        </div>
      )}
      <div
        id={contentId}
        ref={__subStepRef}
        key={__contentKey}
        className={clsx(styles['content-wrapper'], fitHeight && styles['content-wrapper-fit-height'])}
      >
        {/* We use a wrapper around the boundary to preserve container's paddings. */}
        <BuiltInErrorBoundary wrapper={content => <InternalBox padding="m">{content}</InternalBox>}>
          {header && (
            <ContainerHeaderContextProvider>
              <StickyHeaderContext.Provider value={{ isStuck, isStuckAtBottom }}>
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
                  ref={headerMergedRef}
                  style={{
                    ...stickyStyles.style,
                    ...getHeaderStyles(style),
                  }}
                >
                  {isStuck && !isMobile && isRefresh && __fullPage && <div className={styles['header-cover']}></div>}
                  {header}
                </div>
              </StickyHeaderContext.Provider>
            </ContainerHeaderContextProvider>
          )}
          <div className={clsx(styles.content, fitHeight && styles['content-fit-height'])}>
            <div
              className={clsx(styles['content-inner'], testStyles['content-inner'], {
                [styles['with-paddings']]: !disableContentPaddings,
                [styles['with-header']]: !!header,
              })}
              style={getContentStyles(style)}
            >
              {/* We use a wrapper around the boundary to preserve paddings in case they were disabled by the consumer.
              That is needed because the consumer-defined paddings that normally come with the content can no longer
              apply since the content failed to render. */}
              <BuiltInErrorBoundary
                wrapper={content => (
                  <InternalBox padding={disableContentPaddings ? 'm' : undefined}>{content}</InternalBox>
                )}
              >
                {children}
              </BuiltInErrorBoundary>
            </div>
          </div>
          {footer && (
            <div
              className={clsx(styles.footer, {
                [styles['with-divider']]: !__disableFooterDivider,
                [styles['with-paddings']]: !disableFooterPaddings,
              })}
              style={getFooterStyles(style)}
            >
              {footer}
            </div>
          )}
        </BuiltInErrorBoundary>
      </div>
    </div>
  );
}
