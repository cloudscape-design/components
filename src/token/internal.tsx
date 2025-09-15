// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import Tooltip from '../internal/components/tooltip';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../live-region/internal';
import DismissButton from './dismiss-button';
import { TokenProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

const TOKEN_INLINE_MIN_CHARACTER_LIMIT = 15;

type InternalTokenProps = TokenProps &
  InternalBaseComponentProps & {
    role?: string;
    disableInnerPadding?: boolean;
  };

function InternalToken({
  // External
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
  disableTooltip = false,

  // Internal
  role,
  disableInnerPadding,

  // Base
  __internalRootRef,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const labelContainerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const isInline = variant === 'inline';

  const getTextContent = (node: React.ReactNode): string | undefined => {
    // Handle string nodes: trim whitespace and return undefined if empty
    if (typeof node === 'string') {
      const trimmed = node.trim();
      return trimmed || undefined;
    }
    // Handle number nodes: convert to string
    if (typeof node === 'number') {
      return String(node);
    }
    // Handle React elements: recursively extract text from children
    if (React.isValidElement(node) && node.props.children) {
      return getTextContent(node.props.children);
    }
    // Handle arrays: join all text content with spaces and trim
    if (Array.isArray(node)) {
      const texts = node.map(getTextContent).filter(Boolean);
      const joined = texts.join(' ').trim();
      return joined || undefined;
    }
    // Handle all other cases (null, undefined, boolean, etc.)
    return undefined;
  };

  const isLabelOverflowing = () => {
    const labelContent = labelRef.current;
    const labelContainer = labelContainerRef.current;

    if (labelContent && labelContainer) {
      return labelContent.offsetWidth > labelContainer.offsetWidth;
    }
    return false;
  };

  useResizeObserver(labelContainerRef, () => {
    if (isInline) {
      setIsEllipsisActive(isLabelOverflowing());
    }
  });

  const buildOptionDefinition = () => {
    const isLabelAString = typeof label === 'string';
    const labelObject = isLabelAString ? { label } : { labelContent: label };

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

    const textContent = getTextContent(label);
    if (!textContent) {
      return styles[baseClassName];
    } else if (textContent.length >= TOKEN_INLINE_MIN_CHARACTER_LIMIT) {
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

  const getOptionLabelClassName = () => {
    const textContent = getTextContent(label);
    if (isInline && textContent && textContent.length >= TOKEN_INLINE_MIN_CHARACTER_LIMIT) {
      return styles['token-option-label'];
    }
  };

  const shouldHaveAriaDisabled = () => {
    // Must have onDismiss handler
    if (!onDismiss) {
      return false;
    }

    // For inline variant, readOnly matters as it hides the dismiss button
    if (isInline && readOnly) {
      return false;
    }

    // Label must be a JSX element
    if (!React.isValidElement(label)) {
      return false;
    }

    return true;
  };

  return (
    <div
      {...baseProps}
      ref={__internalRootRef}
      className={clsx(
        styles.root,
        !isInline ? styles['token-normal'] : styles['token-inline'],
        getTokenMinWidthClassName(),
        analyticsSelectors.token,
        baseProps.className
      )}
      aria-disabled={shouldHaveAriaDisabled() ? !!disabled : undefined}
      role={role ?? (shouldHaveAriaDisabled() ? 'group' : undefined)}
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
          labelContainerRef={labelContainerRef}
          labelRef={labelRef}
          labelClassName={getOptionLabelClassName()}
        />
        {onDismiss && (!isInline || !readOnly) && (
          <DismissButton
            disabled={disabled}
            dismissLabel={dismissLabel}
            onDismiss={onDismiss}
            readOnly={readOnly}
            inline={isInline}
          />
        )}
      </div>
      {!disableTooltip && isInline && isEllipsisActive && showTooltip && (
        <Tooltip
          trackRef={labelContainerRef}
          value={
            <LiveRegion>
              <span data-testid="tooltip-live-region-content">{getTextContent(label)}</span>
            </LiveRegion>
          }
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
