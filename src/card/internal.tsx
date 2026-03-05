// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import InternalStructuredItem from '../internal/components/structured-item';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { processAttributes } from '../internal/utils/with-native-attributes';
import { InternalCardProps } from './interfaces';
import { getContentStyles, getFooterStyles, getHeaderStyles, getRootStyles } from './style';

import styles from './styles.css.js';

export default function InternalCard({
  actions,
  highlighted,
  children,
  className,
  header,
  description,
  footer,
  iconName,
  iconUrl,
  iconSvg,
  iconAlt,
  style,
  metadataAttributes,
  nativeAttributes,
  onClick,
  disableHeaderPaddings,
  disableContentPaddings,
  disableFooterPaddings,
  fullHeight,
  __internalRootRef,
}: InternalCardProps) {
  const isRefresh = useVisualRefresh();

  const hasIcon = iconName || iconUrl || iconSvg;
  const iconElement = hasIcon ? <InternalIcon name={iconName} url={iconUrl} svg={iconSvg} alt={iconAlt} /> : undefined;

  const headerRowEmpty = !header && !description && !hasIcon && !actions;

  const rootAttributes = processAttributes<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    {
      className: clsx(
        className,
        styles.root,
        highlighted && styles.highlighted,
        headerRowEmpty && styles['no-header'],
        !children && styles['no-content'],
        isRefresh && styles.refresh,
        fullHeight && styles['full-height']
      ),
      ...metadataAttributes,
      onClick,
      style: getRootStyles(style),
    },
    nativeAttributes,
    'Card'
  );

  return (
    <div ref={__internalRootRef} {...rootAttributes}>
      {(header || description || iconElement || actions) && (
        <div
          className={clsx(
            styles.header,
            disableHeaderPaddings && styles['no-padding'],
            !!actions && styles['with-actions']
          )}
          style={getHeaderStyles(style)}
        >
          <InternalStructuredItem
            content={header && <div className={styles['header-inner']}>{header}</div>}
            secondaryContent={description && <div className={styles.description}>{description}</div>}
            icon={iconElement}
            actions={actions}
            disablePaddings={disableHeaderPaddings}
            wrapActions={false}
          />
        </div>
      )}
      {children && (
        <div
          className={clsx(styles.body, disableContentPaddings && styles['no-padding'])}
          style={getContentStyles(style)}
        >
          {children}
        </div>
      )}
      {footer && (
        <div
          className={clsx(styles.footer, disableFooterPaddings && styles['no-padding'])}
          style={getFooterStyles(style)}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
