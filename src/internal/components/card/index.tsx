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
  active,
  children,
  className,
  header,
  description,
  icon,
  metadataAttributes,
  onClick,
  disableHeaderPaddings,
  disableContentPaddings,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  return (
    <div
      className={clsx(
        className,
        styles.root,
        active && styles.active,
        !children && styles['no-content'],
        isRefresh && styles.refresh
      )}
      {...metadataAttributes}
      onClick={onClick}
    >
      <div
        className={clsx(
          styles.header,
          disableHeaderPaddings && styles['no-padding'],
          !!actions && styles['with-actions']
        )}
      >
        <InternalStructuredItem
          content={<div className={styles['header-inner']}>{header}</div>}
          secondaryContent={description && <div className={styles.description}>{description}</div>}
          icon={icon}
          actions={actions}
          disablePaddings={disableHeaderPaddings}
          wrapActions={false}
        />
      </div>
      <div className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}>{children}</div>
    </div>
  );
}
