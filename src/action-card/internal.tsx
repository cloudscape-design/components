// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ActionCardProps, InternalActionCardProps } from './interfaces';

import styles from './styles.css.js';

type InternalActionCardPropsWithRef = InternalActionCardProps & InternalBaseComponentProps;

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
      iconName,
      iconUrl,
      iconSvg,
      iconAlt,
      iconPosition = 'left',
      iconVerticalAlignment = 'top',
      ...rest
    }: InternalActionCardPropsWithRef,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    const handleClick = (event: React.MouseEvent) => {
      if (disabled) {
        return;
      }
      fireCancelableEvent(onClick, {}, event);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fireCancelableEvent(onClick, {}, event);
      }
    };

    const hasIcon = iconName || iconUrl || iconSvg;

    const iconElement = hasIcon && (
      <div className={styles.icon}>
        <InternalIcon name={iconName} url={iconUrl} svg={iconSvg} alt={iconAlt} />
      </div>
    );

    const contentElement = (
      <div className={styles.body}>
        {header && <div className={styles.header}>{header}</div>}
        {description && <div className={styles.description}>{description}</div>}
        {children && <div className={styles.content}>{children}</div>}
      </div>
    );

    return (
      <button
        {...baseProps}
        ref={buttonRef}
        type="button"
        className={clsx(
          styles.root,
          disabled && styles.disabled,
          hasIcon && styles['has-icon'],
          hasIcon && styles[`icon-align-${iconPosition}`],
          hasIcon && styles[`icon-vertical-align-${iconVerticalAlignment}`],
          baseProps.className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {iconPosition === 'left' && iconElement}
        {contentElement}
        {iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

export default InternalActionCard;
