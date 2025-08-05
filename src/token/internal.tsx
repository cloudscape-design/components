// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { OptionDefinition } from '../internal/components/option/interfaces';
import DismissButton from './dismiss-button';
import { TokenProps } from './interfaces';

import styles from './styles.css.js';

function InternalToken({
  children,
  onDismiss,
  label,
  ariaLabel,
  labelTag,
  description,
  variant = 'normal',
  disabled,
  readOnly,
  iconAlt,
  iconName,
  iconUrl,
  iconSvg,
  tags,
  dismissLabel,
  ...restProps
}: TokenProps) {
  const baseProps = getBaseProps(restProps);
  const optionDefinition: OptionDefinition = {
    label,
    labelTag,
    description,
    disabled,
    iconAlt,
    iconName,
    iconUrl,
    iconSvg,
    tags,
  };

  return (
    <div
      {...baseProps}
      className={clsx(styles.token, baseProps.className)}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          variant === 'normal' && styles['token-box'],
          variant === 'inline' && styles['token-inline'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly']
        )}
      >
        {children ?? <Option option={optionDefinition} isGenericGroup={false} />}
        {onDismiss && (
          <DismissButton
            disabled={disabled}
            dismissLabel={dismissLabel}
            onDismiss={onDismiss}
            readOnly={readOnly}
            inline={variant === 'inline'}
          />
        )}
      </div>
    </div>
  );
}

export default InternalToken;
