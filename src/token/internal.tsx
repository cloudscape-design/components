// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { OptionDefinition } from '../internal/components/option/interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalPopover from '../popover/internal';
import ActionButton from './action-button';
import { TokenProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

type InternalTokenProps = TokenProps &
  InternalBaseComponentProps & {
    role?: string;
    disableInnerPadding?: boolean;
  };

function InternalToken({
  // Base
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
  onDismiss,

  // Core
  children,
  customActionProps,

  // Internal
  disableInnerPadding,
  role,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const isInline = variant === 'inline';

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
      <Option triggerVariant={isInline} option={optionDefinition} isGenericGroup={false} />
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
      <div className={clsx(styles['popover-trigger-wrapper'], isInline && styles['popover-trigger-wrapper-inline'])}>
        <InternalPopover
          triggerType="text-inline"
          triggerClassName={clsx(isInline && styles['popover-trigger-inline-button'])}
          size={popoverProps.size ?? 'medium'}
          position={popoverProps?.position ?? 'top'}
          {...popoverProps}
        >
          {mainContent}
        </InternalPopover>
      </div>
    );
  };

  const getActionButton = () => {
    if (!onDismiss && !customActionProps) {
      return null;
    }

    const popoverProps = customActionProps?.popoverProps;
    const button = (
      <ActionButton
        {...customActionProps}
        isCustom={!!customActionProps}
        disabled={customActionProps?.disabled ?? disabled}
        ariaLabel={customActionProps?.ariaLabel ?? dismissLabel}
        onClick={customActionProps?.onClick ?? onDismiss}
        readOnly={readOnly}
        inline={isInline}
      />
    );

    if (!popoverProps) {
      return button;
    }

    return (
      <InternalPopover
        className={styles['action-button-popover']}
        triggerClassName={styles['action-button-popover-trigger']}
        triggerType="custom"
        size={popoverProps.size ?? 'medium'}
        position={popoverProps?.position ?? 'top'}
        {...popoverProps}
      >
        {button}
      </InternalPopover>
    );
  };

  return (
    <div
      {...baseProps}
      className={clsx(!isInline ? styles.token : styles['token-inline'], analyticsSelectors.token, baseProps.className)}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      role={role ?? (popoverProps ? 'button' : 'none')}
    >
      <div
        className={clsx(
          !isInline ? styles['token-box'] : styles['token-box-inline'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly'],
          disableInnerPadding && styles['disable-padding']
        )}
      >
        {getTokenContent()}
        {getActionButton()}
      </div>
    </div>
  );
}

export default InternalToken;
