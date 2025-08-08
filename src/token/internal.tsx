// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { OptionDefinition } from '../internal/components/option/interfaces';
import InternalPopover from '../popover/internal';
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
  popoverProps,
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

  const getTokenContent = () => {
    const mainContent = children ?? (
      <Option triggerVariant={variant === 'inline'} option={optionDefinition} isGenericGroup={false} />
    );
    if (children || labelTag || description || tags || !popoverProps?.content) {
      if (popoverProps) {
        throw new Error(
          'Invariant violation: labelTag, description, and tags are not supported in combination with a popover.'
        );
      }
      return mainContent;
    }
    return (
      <div
        className={clsx(
          styles['popover-trigger-wrapper'],
          variant === 'inline' && styles['popover-trigger-wrapper-inline']
        )}
      >
        <InternalPopover
          triggerType="text-inline"
          triggerClassName={clsx(variant === 'inline' && styles['popover-trigger-inline-button'])}
          size={popoverProps.size ?? 'medium'}
          position={popoverProps?.position ?? 'top'}
          {...popoverProps}
        >
          {mainContent}
        </InternalPopover>
      </div>
    );
  };

  return (
    <div
      {...baseProps}
      className={clsx(
        variant === 'normal' && styles.token,
        variant === 'inline' && styles['token-inline'],
        baseProps.className
      )}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          variant === 'normal' && styles['token-box'],
          variant === 'inline' && styles['token-box-inline'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly']
        )}
      >
        {getTokenContent()}
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
