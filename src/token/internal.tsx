// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import Tooltip from '../internal/components/tooltip';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import DismissButton from './dismiss-button';
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
  labelTag,
  description,
  variant = 'normal',
  disabled,
  readOnly,
  icon,
  tags,
  dismissLabel,
  onDismiss,

  // Internal
  role,
  disableInnerPadding,
  disableTooltip,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const labelContainerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const isInline = variant === 'inline';

  const isLabelAString = (label: React.ReactNode): label is string => {
    return typeof label === 'string';
  };

  const isLabelOverflowing = useCallback(() => {
    if (!isInline || !isLabelAString(label)) {
      return false;
    }

    const labelContent = labelRef.current;
    const labelContainer = labelContainerRef.current;

    if (labelContent && labelContainer) {
      return labelContent.offsetWidth > labelContainer.offsetWidth;
    }
    return false;
  }, [isInline, label]);

  useResizeObserver(labelContainerRef, () => {
    if (isInline && isLabelAString(label)) {
      setIsEllipsisActive(isLabelOverflowing());
    }
  });

  const buildOptionDefinition = () => {
    const labelObject = isLabelAString(label) ? { label } : { labelContent: label };
    if (isInline) {
      return {
        ...labelObject,
        disabled,
        __customIcon: icon && <span className={clsx(styles.icon, styles['icon-inline'])}>{icon}</span>,
      };
    } else {
      return {
        ...labelObject,
        disabled,
        labelTag,
        description,
        tags,
        __customIcon: icon && (
          <span className={clsx(styles.icon, (description || tags) && styles[`icon-size-big`])}>{icon}</span>
        ),
      };
    }
  };

  const getTokenMinWidthClassName = () => {
    if (!isInline) {
      return styles['token-min-width'];
    }

    const baseClassName = 'token-inline-min-width';

    if (!isLabelAString(label)) {
      return styles[baseClassName];
    }

    if (isLabelAString(label) && label.length >= INLINE_TOKEN_CHARACTER_LIMIT) {
      const hasDismissButton = onDismiss || dismissLabel;
      const hasIcon = icon;

      if (hasIcon && hasDismissButton) {
        return styles[baseClassName];
      } else if (hasIcon && !hasDismissButton) {
        return styles[baseClassName + '-icon-only'];
      } else if (!hasIcon && hasDismissButton) {
        return styles[baseClassName + '-dismiss-only'];
      } else {
        return styles[baseClassName + '-label-only'];
      }
    }
  };

  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        !isInline ? styles['token-normal'] : styles['token-inline'],
        getTokenMinWidthClassName(),
        analyticsSelectors.token,
        baseProps.className
      )}
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
      tabIndex={!disableTooltip && isInline && isEllipsisActive ? 0 : undefined}
      // The below data attribute is to tell a potentially nested Popover to have less spacing between the text and the underline
      data-token-inline={isInline || undefined}
    >
      <div
        className={clsx(
          !isInline ? styles['token-box'] : styles['token-box-inline'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly'],
          !isInline && !onDismiss && styles['token-box-without-dismiss'],
          disableInnerPadding && styles['disable-padding']
        )}
      >
        <Option
          className={clsx(isInline && styles['token-option-inline'])}
          triggerVariant={isInline}
          option={buildOptionDefinition()}
          isGenericGroup={false}
          labelContainerRef={labelContainerRef}
          labelRef={labelRef}
          labelClassName={clsx(
            isInline &&
              isLabelAString(label) &&
              label?.length >= INLINE_TOKEN_CHARACTER_LIMIT &&
              styles['token-option-label']
          )}
        />
        {onDismiss && (
          <DismissButton
            disabled={disabled}
            dismissLabel={dismissLabel}
            onDismiss={onDismiss}
            readOnly={readOnly}
            inline={isInline}
          />
        )}
      </div>
      {!disableTooltip && isInline && showTooltip && isEllipsisActive && (
        <Tooltip
          trackRef={labelContainerRef}
          value={label}
          size="medium"
          // This is a non-existant class for testing purposes
          className="token-tooltip"
          onDismiss={() => {
            setShowTooltip(false);
          }}
        />
      )}
    </div>
  );
}

export default InternalToken;
