// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { InternalCardProps } from './interfaces';

import styles from './styles.css.js';

export default function Card({
  actions,
  active,
  children,
  className,
  header,
  description,
  metadataAttributes,
  onClick,
  disableContentPaddings,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  return (
    <div
      className={clsx(
        className,
        styles.root,
        {
          [styles['with-actions']]: !!actions,
          [styles.active]: active,
        },
        isRefresh && styles.refresh
      )}
      {...metadataAttributes}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles['header-top-row']}>
          <div className={styles['header-inner']}>{header}</div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <div className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}>{children}</div>
    </div>
  );
}
