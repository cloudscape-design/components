// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { ContainerProps, MediaDefinition } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { StickyHeaderContext, useStickyHeader } from './use-sticky-header';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { Breakpoint, matchBreakpointMapping } from '../internal/breakpoints';

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

  const getBreakpointsFromMedia = (media: any) => {
    const breakpointKeys = new Set<Breakpoint>();

    ['orientation', 'width', 'height'].forEach(key => {
      if (media && typeof media[key] === 'object' && media[key] !== null) {
        const breakpointMapping = media[key] as MediaDefinition.BreakpointMapping<any>;
        Object.keys(breakpointMapping).forEach(breakpoint => {
          breakpointKeys.add(breakpoint as Breakpoint);
        });
      }
    });
    console.log(breakpointKeys);
    return Array.from(breakpointKeys);
  };

  const [breakpoint, breakpointRef] = useContainerBreakpoints(getBreakpointsFromMedia(media));
  const mergedRef = useMergeRefs(rootRef, __internalRootRef, breakpointRef);
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

  const [mediaHeight, setMediaHeight] = useState('' as MediaDefinition.Dimension);
  const [mediaWidth, setMediaWidth] = useState('' as MediaDefinition.Dimension);
  const [mediaOrientation, setMediaOrientation] = useState('horizontal' as MediaDefinition.Orientation);

  useEffect(() => {
    if (!media || !breakpoint) {
      return;
    }
    if (typeof media.orientation === 'string') {
      setMediaOrientation(media.orientation);
    } else {
      const orientation = matchBreakpointMapping(media.orientation, breakpoint);
      setMediaOrientation(orientation || media.orientation.default || 'horizontal');
    }
  }, [media, breakpoint]);

  useEffect(() => {
    if (!media || !media.width || !breakpoint) {
      return;
    }
    if (typeof media.width === 'string' || typeof media.width === 'number') {
      setMediaWidth(media.width);
    } else {
      const width = matchBreakpointMapping(media.width, breakpoint);
      setMediaWidth(width || media.width.default || '');
    }
  }, [media, breakpoint]);

  useEffect(() => {
    if (!media || !media.height || !breakpoint) {
      return;
    }
    if (typeof media.height === 'string' || typeof media.height === 'number') {
      setMediaHeight(media.height);
    } else {
      const height = matchBreakpointMapping(media.height, breakpoint);
      setMediaHeight(height || media.height.default || '');
    }
  }, [media, breakpoint]);

  function getMediaStyles() {
    return mediaOrientation === 'horizontal' ? { height: mediaHeight } : { width: mediaWidth };
  }

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        fitHeight && styles['fit-height'],
        media?.content && mediaOrientation === 'vertical' && styles['vertical-media'],
        shouldHaveStickyStyles && [styles['sticky-enabled']]
      )}
      ref={mergedRef}
    >
      {media?.content && (
        <div className={clsx(styles[`media-${mediaOrientation}`], styles.media)} style={getMediaStyles()}>
          {media.content}
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
