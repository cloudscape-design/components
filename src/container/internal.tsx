// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import { ContainerProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { useModalContext } from '../internal/context/modal-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ContainerHeaderContextProvider } from '../internal/context/container-header';
import { getGlobalFlag } from '../internal/utils/global-flags';

export interface InternalContainerProps extends Omit<ContainerProps, 'variant'>, InternalBaseComponentProps {
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

  __funnelSubStepProps?: ReturnType<typeof useFunnelSubStep>['funnelSubStepProps'];
  __subStepRef?: ReturnType<typeof useFunnelSubStep>['subStepRef'];
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
  __fullPage = false,
  __disableStickyMobile = true,
  __funnelSubStepProps,
  __subStepRef,
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
  const hasToolbar = getGlobalFlag('appLayoutWidget');
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
        isRefresh && styles.refresh
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
      <div
        id={contentId}
        ref={__subStepRef}
        className={clsx(styles['content-wrapper'], fitHeight && styles['content-wrapper-fit-height'])}
      >
        {header && (
          <ContainerHeaderContextProvider>
            <StickyHeaderContext.Provider value={{ isStuck }}>
              <div
                className={clsx(isRefresh && styles.refresh, styles.header, styles[`header-variant-${variant}`], {
                  [styles['header-sticky-disabled']]: __stickyHeader && !isSticky,
                  [styles['header-sticky-enabled']]: isSticky,
                  [styles['header-dynamic-height']]: hasDynamicHeight,
                  [styles['header-stuck']]: isStuck,
                  [styles['with-paddings']]: !disableHeaderPaddings,
                  [styles['with-toolbar']]: hasToolbar,
                  [styles['with-hidden-content']]: !children || __hiddenContent,
                  [styles['header-with-media']]: hasMedia,
                })}
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
