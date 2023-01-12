// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext } from 'react';
import { getBaseProps } from '../internal/base-component';
import { StickyHeaderContext } from '../container/use-sticky-header';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { HeaderProps } from './interfaces';
import styles from './styles.css.js';
import { SomeRequired } from '../internal/types';

interface InternalHeaderProps extends SomeRequired<HeaderProps, 'variant'>, InternalBaseComponentProps {
  __disableActionsWrapping?: boolean;
}

export default function InternalHeader({
  variant,
  headingTagOverride,
  children,
  actions,
  counter,
  description,
  info,
  __internalRootRef = null,
  __disableActionsWrapping,
  ...restProps
}: InternalHeaderProps) {
  const HeadingTag = headingTagOverride ?? (variant === 'awsui-h1-sticky' ? 'h1' : variant);
  const { isStuck } = useContext(StickyHeaderContext);
  const baseProps = getBaseProps(restProps);
  const isRefresh = useVisualRefresh();
  const dynamicVariant = isStuck ? 'h2' : 'h1';
  const variantOverride = variant === 'awsui-h1-sticky' ? (isRefresh ? dynamicVariant : 'h2') : variant;
  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        styles[`root-variant-${variantOverride}`],
        isRefresh && styles[`root-variant-${variantOverride}-refresh`],
        !actions && [styles[`root-no-actions`]],
        description && [styles[`root-has-description`]],
        __disableActionsWrapping && [styles['root-no-wrap']]
      )}
      ref={__internalRootRef}
    >
      <div
        className={clsx(
          styles.main,
          styles[`main-variant-${variantOverride}`],
          isRefresh && styles[`main-variant-${variantOverride}-refresh`]
        )}
      >
        <div
          className={clsx(
            styles.title,
            styles[`title-variant-${variantOverride}`],
            isRefresh && styles[`title-variant-${variantOverride}-refresh`]
          )}
        >
          <HeadingTag className={clsx(styles.heading, styles[`heading-variant-${variantOverride}`])}>
            <span className={clsx(styles['heading-text'], styles[`heading-text-variant-${variantOverride}`])}>
              {children}
            </span>
            {counter !== undefined && <span className={styles.counter}> {counter}</span>}
          </HeadingTag>
          {!!info && <span className={styles.info}>{info}</span>}
        </div>
        {!!description && (
          <p
            className={clsx(
              styles.description,
              styles[`description-variant-${variantOverride}`],
              isRefresh && styles[`description-variant-${variantOverride}-refresh`]
            )}
          >
            {description}
          </p>
        )}
      </div>
      {!!actions && (
        <div
          className={clsx(
            styles.actions,
            styles[`actions-variant-${variantOverride}`],
            isRefresh && styles[`actions-variant-${variantOverride}-refresh`]
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
