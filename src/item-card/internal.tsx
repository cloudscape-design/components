// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import InternalStructuredItem from '../internal/components/structured-item';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { processAttributes } from '../internal/utils/with-native-attributes';
import { InternalItemCardProps } from './interfaces';
import { getContentStyles, getFooterStyles, getHeaderStyles, getRootStyles } from './style';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export default function InternalItemCard({
  actions,
  highlighted,
  children,
  className,
  header,
  description,
  footer,
  icon,
  style,
  metadataAttributes,
  nativeAttributes,
  onClick,
  disableHeaderPaddings,
  disableContentPaddings,
  disableFooterPaddings,
  fullHeight,
  variant = 'default',
  __internalRootRef,
  ...restProps
}: InternalItemCardProps) {
  const baseProps = getBaseProps(restProps);
  const isRefresh = useVisualRefresh();

  const headerRowEmpty = !header && !description && !icon && !actions;

  const rootAttributes = processAttributes<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    {
      className: clsx(
        className,
        styles.root,
        highlighted && styles.highlighted,
        fullHeight && styles['full-height'],
        isRefresh && styles.refresh,
        styles[`variant-${variant}`]
      ),
      ...metadataAttributes,
      onClick,
      style: getRootStyles(style),
    },
    nativeAttributes,
    'Card'
  );

  return (
    <div ref={__internalRootRef} {...baseProps} {...rootAttributes}>
      <div className={styles['inner-card']}>
        {!headerRowEmpty && (
          <div
            className={clsx(
              styles.header,
              disableHeaderPaddings && styles['no-padding'],
              !!actions && styles['with-actions']
            )}
            style={getHeaderStyles(style)}
          >
            <InternalStructuredItem
              content={header && <div className={clsx(styles['header-inner'], testStyles.header)}>{header}</div>}
              secondaryContent={
                description && <div className={clsx(styles.description, testStyles.description)}>{description}</div>
              }
              icon={icon && <div className={testStyles.icon}>{icon}</div>}
              actions={actions}
              disablePaddings={disableHeaderPaddings}
              wrapActions={false}
            />
          </div>
        )}
        {children && (
          <div
            className={clsx(styles.body, testStyles.body, disableContentPaddings && styles['no-padding'])}
            style={getContentStyles(style)}
          >
            {children}
          </div>
        )}
        {footer && (
          <div
            className={clsx(styles.footer, testStyles.footer, disableFooterPaddings && styles['no-padding'])}
            style={getFooterStyles(style)}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
