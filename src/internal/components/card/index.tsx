// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { InternalCardProps } from './interfaces';

import styles from './styles.css.js';

export default function Card({
  action,
  active,
  children,
  className,
  header,
  innerMetadataAttributes,
  metadataAttributes,
  onClick,
  onFocus,
  role,
  TagName = 'div',
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  return (
    <TagName
      className={clsx(className, styles.card, styles.root, {
        [styles['card-with-action']]: !!action,
        [styles['card-active']]: active,
      })}
      onFocus={onFocus}
      role={role}
      {...metadataAttributes}
    >
      <div
        className={clsx(styles['card-inner'], isRefresh && styles.refresh)}
        {...innerMetadataAttributes}
        onClick={onClick}
      >
        <div className={styles['card-header']}>
          <div className={styles['card-header-inner']}>{header}</div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
        {children}
      </div>
    </TagName>
  );
}
