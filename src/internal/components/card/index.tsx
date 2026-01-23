// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';
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
  innerMetadataAttributes,
  metadataAttributes,
  onClick,
  onFocus,
  role,
  tagName: TagName = 'div',
  variant = 'default',
  disableContentPaddings,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  const hasActions = !!actions || variant === 'action';

  const InnerTagName = variant === 'action' ? 'button' : 'div';

  return (
    <TagName
      className={clsx(className, styles.root, {
        [styles['with-actions']]: !!hasActions,
      })}
      onFocus={onFocus}
      role={role}
      {...metadataAttributes}
    >
      <InnerTagName
        className={clsx(
          styles['card-inner'],
          styles[`variant-${variant}`],
          isRefresh && styles.refresh,
          active && [styles.active]
        )}
        {...innerMetadataAttributes}
        onClick={onClick}
      >
        <div className={styles.header}>
          <div className={styles['header-top-row']}>
            <div className={styles['header-inner']}>{header}</div>
            {hasActions && (
              <div className={styles.actions}>
                <div className={styles['actions-inner']}>{actions || <InternalIcon name="angle-right" />}</div>
              </div>
            )}
          </div>
          {description && <div className={styles.description}>{description}</div>}
        </div>
        <div className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}>{children}</div>
      </InnerTagName>
    </TagName>
  );
}
