// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useHeroHeader, useHeaderStyle, useHeaderDarkVisualContext } from '../app-layout/visual-refresh/header-style';
//import AppContext from '../app/app-context';

type InternalContentLayoutProps = ContentLayoutProps & InternalBaseComponentProps;

export default function InternalContentLayout({
  children,
  disableOverlap,
  heroHeader,
  header,
  __internalRootRef,
  highContrastHeader,
  headerBackground,
  ...rest
}: InternalContentLayoutProps) {
  const baseProps = getBaseProps(rest);
  const rootElement = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(rootElement, __internalRootRef);

  const isVisualRefresh = useVisualRefresh();
  //const isHeroHeader = heroHeader;
  const isDarkHeaderContext = highContrastHeader;
  const overlapElement = useDynamicOverlap(); //this needs to be refactored

  const isOverlapDisabled = !children || disableOverlap;
  // const setHeaderProps = useHeaderStyle();
  const { handleHeroHeaderProps } = useHeroHeader();
  const { handleCustomHeaderStyleProps } = useHeaderStyle();
  const { handleHeaderDarkVisualContextProps } = useHeaderDarkVisualContext();

  // useEffect(() => {
  //   handleCustomHeaderStyleProps({ headerBackground });
  // });

  useEffect(() => {
    heroHeader && handleHeroHeaderProps({ heroHeader });
  }, [handleHeroHeaderProps, heroHeader]);

  useEffect(() => {
    highContrastHeader && handleHeaderDarkVisualContextProps({ highContrastHeader });
  }, [handleHeaderDarkVisualContextProps, highContrastHeader]);

  useEffect(() => {
    headerBackground && handleCustomHeaderStyleProps({ headerBackground });
  }, [handleCustomHeaderStyleProps, headerBackground]);

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
          { [styles['is-overlap-disabled']]: isOverlapDisabled }
          //getContentHeaderClassName()
        )}
        ref={overlapElement}
      />

      {header && <div className={clsx(styles.header, getContentHeaderClassName(isDarkHeaderContext))}>{header}</div>}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
