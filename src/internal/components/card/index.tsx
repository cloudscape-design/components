// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { InternalCardProps } from './interfaces';

import styles from './styles.css.js';
import InternalStructuredItem from '../structured-item';

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
  reducedBorderRadius,
  reducedPadding,
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
          [styles['reduced-border-radius']]: reducedBorderRadius,
          [styles['reduced-padding']]: reducedPadding,
        },
        isRefresh && styles.refresh
      )}
      {...metadataAttributes}
      onClick={onClick}
    >
      <div className={styles.header}>
        <InternalStructuredItem
          content={<div className={styles['header-inner']}>{header}</div>}
          secondaryContent={description && <div className={styles.description}>{description}</div>}
          icon={icon}
          actions={actions}
          disablePaddings={disableHeaderPaddings}
        />
      </div>
      <div className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}>{children}</div>
    </div>
  );
}
