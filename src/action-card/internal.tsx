// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import InternalStructuredItem from '../internal/components/structured-item';
import { fireCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { type ActionCardProps } from './interfaces';
import { getContentStyles, getHeaderStyles, getRootStyles } from './style';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export type InternalActionCardProps = ActionCardProps & InternalBaseComponentProps;

const InternalActionCard = React.forwardRef(
  (
    {
      header,
      description,
      children,
      onClick,
      ariaLabel,
      ariaDescribedby,
      disabled = false,
      disableHeaderPaddings = false,
      disableContentPaddings = false,
      icon,
      iconVerticalAlignment = 'top',
      variant = 'default',
      style,
      nativeButtonAttributes,
      __internalRootRef,
      ...rest
    }: InternalActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const headerId = useUniqueId('action-card-header-');
    const descriptionId = useUniqueId('action-card-description-');

    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    const handleClick = (event: React.MouseEvent) => {
      if (disabled) {
        return event.preventDefault();
      }
      fireCancelableEvent(onClick, {}, event);
    };

    const rootStyleProps = getRootStyles(style);
    const headerStyleProps = getHeaderStyles(style);
    const contentStyleProps = getContentStyles(style);

    const headerRowEmpty = !header && !description;

    const iconWrapper = icon && (
      <div className={clsx(styles.icon, testStyles.icon)} aria-hidden="true">
        {icon}
      </div>
    );
    const iconInHeaderRow = icon && iconVerticalAlignment === 'top' && !!header;

    const headerSection = !headerRowEmpty ? (
      <div className={clsx(styles.header, disableHeaderPaddings && styles['no-padding'])} style={headerStyleProps}>
        <InternalStructuredItem
          content={
            header && (
              <div
                id={headerId}
                className={clsx(styles['header-inner'], testStyles.header, disabled && styles.disabled)}
              >
                {header}
              </div>
            )
          }
          secondaryContent={
            description && (
              <div
                id={descriptionId}
                className={clsx(
                  styles.description,
                  testStyles.description,
                  disabled && styles.disabled,
                  header && styles['has-header']
                )}
              >
                {description}
              </div>
            )
          }
          disablePaddings={disableHeaderPaddings}
        />
      </div>
    ) : null;

    const contentElement = (
      <div className={styles['inner-card']}>
        {iconInHeaderRow ? (
          <div className={styles['header-row']}>
            {headerSection}
            {iconWrapper}
          </div>
        ) : (
          headerSection
        )}
        {children && (
          <div
            className={clsx(styles.body, testStyles.body, disableContentPaddings && styles['no-padding'])}
            style={contentStyleProps}
          >
            {children}
          </div>
        )}
      </div>
    );
    const rootRef = useMergeRefs(buttonRef, __internalRootRef);

    return (
      <WithNativeAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
        {...baseProps}
        ref={rootRef}
        tag="button"
        componentName="ActionCard"
        nativeAttributes={nativeButtonAttributes}
        type="button"
        className={clsx(
          styles.root,
          styles[`variant-${variant}`],
          disabled && styles.disabled,
          !!icon && styles['has-icon'],
          !!icon && styles['icon-align-end'],
          !!icon && styles[`icon-vertical-align-${iconVerticalAlignment}`],
          baseProps.className
        )}
        style={rootStyleProps}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-labelledby={!ariaLabel && header ? headerId : undefined}
        aria-describedby={ariaDescribedby || (description ? descriptionId : undefined)}
        aria-disabled={disabled || undefined}
      >
        {contentElement}
        {!iconInHeaderRow && iconWrapper}
      </WithNativeAttributes>
    );
  }
);

export default InternalActionCard;
