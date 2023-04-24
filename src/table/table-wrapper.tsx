// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';

export interface TableWrapperProps {
  children: React.ReactNode;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  hasFooter?: boolean;
  hasHeader?: boolean;
  variant: 'container' | 'embedded' | 'stacked' | 'full-page';
  isScrollable: boolean;
  ariaLabel?: string;
}

export default forwardRef(TableWrapper);

function TableWrapper(
  { children, hasFooter, hasHeader, variant, onScroll, isScrollable, ariaLabel }: TableWrapperProps,
  ref: React.Ref<HTMLDivElement>
) {
  // Allows keyboard users to scroll horizontally with arrow keys by making the wrapper part of the tab sequence
  const nativeProps = isScrollable ? { role: 'region', tabIndex: 0, 'aria-label': ariaLabel } : {};
  return (
    <div
      ref={ref}
      className={clsx(styles.wrapper, styles[`variant-${variant}`], {
        [styles['has-footer']]: hasFooter,
        [styles['has-header']]: hasHeader,
      })}
      onScroll={onScroll}
      {...nativeProps}
    >
      {children}
    </div>
  );
}
