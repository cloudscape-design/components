// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';
import { useMobile } from '../internal/hooks/use-mobile';

interface TableFooterProps {
  children?: React.ReactNode;
  pagination?: React.ReactNode;
  computedVariant: 'container' | 'embedded' | 'borderless' | 'stacked' | 'full-page';
}

export default function TableFooter({ children, pagination, computedVariant }: TableFooterProps) {
  const isMobile = useMobile();
  const hasPagination = !!pagination;
  const hasChildren = !!children;

  const hasFooter = isMobile ? hasPagination || hasChildren : hasChildren;
  return (
    <>
      {hasFooter && (
        <div
          className={clsx(
            styles['footer-wrapper'],
            styles[`variant-${computedVariant}`],
            isMobile && hasPagination && styles['footer-wrapper-with-pagination']
          )}
        >
          {hasChildren && <div className={styles.footer}>{children}</div>}
          {isMobile && hasPagination && (
            <div className={clsx(styles.footer, styles['footer-pagination'])}>{pagination}</div>
          )}
        </div>
      )}
    </>
  );
}
