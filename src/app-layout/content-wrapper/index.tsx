// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

export interface ContentWrapperProps {
  className?: string;
  children?: React.ReactNode;
  isMobile: boolean;
  navigationPadding: boolean;
  toolsPadding: boolean;
  disablePaddings?: boolean;
  contentWidthStyles?: React.CSSProperties;
}

const ContentWrapper = React.forwardRef(
  (
    {
      className,
      children,
      toolsPadding,
      disablePaddings,
      navigationPadding,
      isMobile,
      contentWidthStyles,
    }: ContentWrapperProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (disablePaddings) {
      return (
        <div className={className} ref={ref}>
          {children}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          styles['content-wrapper'],
          !navigationPadding && styles['content-wrapper-no-navigation-padding'],
          !toolsPadding && styles['content-wrapper-no-tools-padding'],
          isMobile && styles['content-wrapper-mobile']
        )}
        style={contentWidthStyles}
      >
        {children}
      </div>
    );
  }
);

export default ContentWrapper;
