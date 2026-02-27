// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalStructuredItem from '../internal/components/structured-item';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { InternalCardProps } from './interfaces';

import styles from './styles.css.js';

export default function InternalCard({
  actions,
  highlighted,
  children,
  className,
  header,
  description,
  footer,
  icon,
  metadataAttributes,
  onClick,
  disableHeaderPaddings,
  disableContentPaddings,
  disableFooterPaddings,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  const headerRowEmpty = !header && !description && !icon && !actions;

  return (
    <div
      className={clsx(
        className,
        styles.root,
        highlighted && styles.highlighted,
        headerRowEmpty && styles['no-header'],
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
          content={header && <div className={styles['header-inner']}>{header}</div>}
          secondaryContent={description && <div className={styles.description}>{description}</div>}
          icon={icon}
          actions={actions}
          disablePaddings={disableHeaderPaddings}
          wrapActions={false}
        />
      </div>
      {children && <div className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}>{children}</div>}
      {footer && <div className={clsx(styles.footer, disableFooterPaddings && styles['no-padding'])}>{footer}</div>}
    </div>
  );
}
