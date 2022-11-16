// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { HeaderProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import useFocusVisible from '../internal/hooks/focus-visible';
import styles from './styles.css.js';

interface FocusableHeaderProps
  extends BaseComponentProps,
    InternalBaseComponentProps,
    Pick<HeaderProps, 'children' | 'description' | 'info'> {
  tagVariant: 'h1' | 'h2' | 'h3';
}

export default function FocusableHeader({
  children,
  description,
  info,
  tagVariant,
  __internalRootRef = null,
  ...restProps
}: FocusableHeaderProps) {
  const isRefresh = useVisualRefresh();
  const focusVisible = useFocusVisible();
  const baseProps = getBaseProps(restProps);
  const HeaderTag = tagVariant;
  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        styles[`root-variant-${tagVariant}`],
        isRefresh && styles[`root-variant-${tagVariant}-refresh`],
        [styles[`root-no-actions`]],
        description && [styles[`root-has-description`]]
      )}
    >
      <div
        className={clsx(
          styles.main,
          styles[`main-variant-${tagVariant}`],
          isRefresh && styles[`main-variant-${tagVariant}-refresh`]
        )}
      >
        <div
          className={clsx(
            styles.title,
            styles[`title-variant-${tagVariant}`],
            isRefresh && styles[`title-variant-${tagVariant}-refresh`]
          )}
        >
          <HeaderTag
            className={clsx(styles.heading, styles[`heading-variant-${tagVariant}`])}
            ref={__internalRootRef}
            tabIndex={-1}
            {...focusVisible}
          >
            {children}
          </HeaderTag>
          {info && <span className={styles.info}>{info}</span>}
        </div>
        {description && (
          <p
            className={clsx(
              styles.description,
              styles[`description-variant-${tagVariant}`],
              isRefresh && styles[`description-variant-${tagVariant}-refresh`]
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
