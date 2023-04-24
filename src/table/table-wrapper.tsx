// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
export interface TableWrapperProps {
  children: React.ReactNode;
  wrapperRef: React.RefCallback<any> | null;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  hasFooter?: boolean;
  hasHeader?: boolean;
  computedVariant: 'container' | 'embedded' | 'stacked' | 'full-page';
  wrapperProps: {
    role?: string;
    tabIndex?: number;
    'aria-label'?: string;
  };
}

const TableWrapper = ({
  children,
  wrapperRef,
  hasFooter,
  hasHeader,
  computedVariant,
  onScroll,
  wrapperProps,
}: TableWrapperProps) => {
  return (
    <div
      ref={wrapperRef}
      className={clsx(styles.wrapper, styles[`variant-${computedVariant}`], {
        [styles['has-footer']]: hasFooter,
        [styles['has-header']]: hasHeader,
      })}
      onScroll={onScroll}
      {...wrapperProps}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
