// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../../hooks/use-visual-mode';
import InternalStructuredItem from '../structured-item';
import { InternalCardProps } from './interfaces';

import styles from './styles.css.js';

export default function Card({
  actions,
  selected,
  children,
  className,
  header,
  description,
  icon,
  metadataAttributes,
  onClick,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  return (
    <div
      className={clsx(
        className,
        styles.root,
        selected && styles.selected,
        !children && styles['no-content'],
        isRefresh && styles.refresh
      )}
      {...metadataAttributes}
      onClick={onClick}
    >
      <div className={clsx(styles.header, !!actions && styles['with-actions'])}>
        <InternalStructuredItem
          content={<div className={styles['header-inner']}>{header}</div>}
          secondaryContent={description && <div className={styles.description}>{description}</div>}
          icon={icon}
          actions={actions}
          wrapActions={false}
        />
      </div>
      <div className={clsx(styles.body)}>{children}</div>
    </div>
  );
}
