// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { OptionDefinition } from '../internal/components/option/interfaces';
import Tooltip from '../internal/components/tooltip';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalPopover from '../popover/internal';
import ActionButton from './action-button';
import { TokenProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

const INLINE_TOKEN_CHARACTER_LIMIT = 15;

type InternalTokenProps = TokenProps &
  InternalBaseComponentProps & {
    role?: string;
    disableInnerPadding?: boolean;
    disableTooltip?: boolean;
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
  role,
  disableInnerPadding,
  disableTooltip,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
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
      <Option
        triggerVariant={isInline}
        option={optionDefinition}
        isGenericGroup={false}
        labelClassName={clsx(
          isInline && label && label?.length >= INLINE_TOKEN_CHARACTER_LIMIT && styles['token-option-label']
        )}
      />
    );
    if (children || labelTag || description || tags || !popoverProps?.content) {
      if (popoverProps) {
        throw new Error(
          'Invariant violation: description, labelTag, and tags are not supported in combination with a popover.'
        );
      }
      return mainContent;
    }
    return (
      <div
        className={clsx(
          styles['popover-trigger-wrapper'],
          isInline && styles['popover-trigger-wrapper-inline'],
          isInline && label && label?.length >= INLINE_TOKEN_CHARACTER_LIMIT && styles['token-option-label']
        )}
      >
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

  const getTokenMinWidthClassName = () => {
    if (children || !isInline) {
      return undefined;
    }

    const baseClassName = 'token-inline-min-width-';
    const hasActionButton = onDismiss || dismissLabel || customActionProps;
    const hasIcon = iconName || iconSvg || iconUrl;

    if (hasIcon && hasActionButton) {
      return styles[baseClassName + 'icon-and-action'];
    }

    if (hasIcon) {
      return styles[baseClassName + 'icon'];
    }

    if (hasActionButton) {
      return styles[baseClassName + 'action'];
    }

    return styles[baseClassName + 'label-only'];
  };

  return (
    <div
      {...baseProps}
      ref={containerRef}
      className={clsx(
        !isInline ? styles.token : styles['token-inline'],
        getTokenMinWidthClassName(),
        analyticsSelectors.token,
        baseProps.className
      )}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      role={role}
      onFocus={() => {
        setShowTooltip(true);
      }}
      onBlur={() => setShowTooltip(false)}
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={!disableTooltip && !popoverProps && isInline ? 0 : undefined}
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
      {!disableTooltip && !popoverProps && isInline && showTooltip && (
        <Tooltip
          trackRef={containerRef}
          value={label}
          size="medium"
          onDismiss={() => {
            setShowTooltip(false);
          }}
        />
      )}
    </div>
  );
}

export default InternalToken;
