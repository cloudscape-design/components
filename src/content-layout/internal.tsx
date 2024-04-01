// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
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
    headerBackground && handleCustomHeaderStyleProps({ headerBackground });
  }, [handleCustomHeaderStyleProps, headerBackground]);

  useEffect(() => {
    highContrastHeader && handleHeaderDarkVisualContextProps({ highContrastHeader });
  }, [handleHeaderDarkVisualContextProps, highContrastHeader]);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
        [styles['has-header']]: !!header,
      })}
      ref={__internalRootRef}
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
