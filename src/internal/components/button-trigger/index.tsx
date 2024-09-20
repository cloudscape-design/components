// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalIcon from '../../../icon/internal';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import { BaseKeyDetail, CancelableEventHandler, fireCancelableEvent, fireKeyboardEvent } from '../../events';
import { GeneratedAnalyticsMetadataButtonTriggerExpand } from './analytics-metadata/interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface ButtonTriggerProps extends BaseComponentProps {
  children?: React.ReactNode;
  pressed?: boolean;
  hideCaret?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  warning?: boolean;
  inFilteringToken?: 'root' | 'nested';
  inlineTokens?: boolean;
  ariaHasPopup?: 'true' | 'listbox' | 'dialog';
  ariaControls?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  onKeyDown?: CancelableEventHandler<BaseKeyDetail>;
  onKeyUp?: CancelableEventHandler<BaseKeyDetail>;
  onMouseDown?: CancelableEventHandler;
  onClick?: CancelableEventHandler;
  onFocus?: CancelableEventHandler;
  onBlur?: CancelableEventHandler<{ relatedTarget: Node | null }>;
  autoFocus?: boolean;
}

const ButtonTrigger = (
  {
    children,
    pressed = false,
    hideCaret = false,
    disabled = false,
    readOnly = false,
    invalid = false,
    warning = false,
    inlineTokens,
    inFilteringToken,
    ariaHasPopup,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaControls,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onClick,
    onFocus,
    onBlur,
    autoFocus,
    ...restProps
  }: ButtonTriggerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const baseProps = getBaseProps(restProps);
  let attributes: ButtonHTMLAttributes<HTMLButtonElement> = {
    ...baseProps,
    type: 'button',
    className: clsx(
      styles['button-trigger'],
      analyticsSelectors['button-trigger'],
      baseProps.className,
      pressed && styles.pressed,
      disabled && styles.disabled,
      invalid && styles.invalid,
      warning && !invalid && styles.warning,
      !hideCaret && styles['has-caret'],
      readOnly && styles.readonly,
      inFilteringToken && styles['in-filtering-token'],
      inFilteringToken && styles[`in-filtering-token-${inFilteringToken}`],
      inlineTokens && styles['inline-tokens']
    ),
    disabled: disabled,
    'aria-expanded': pressed,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-haspopup': ariaHasPopup ?? 'listbox',
    'aria-controls': ariaControls,
    'aria-disabled': readOnly && !disabled ? 'true' : undefined,
    autoFocus,
  };

  if (!readOnly) {
    attributes = {
      ...attributes,
      onKeyDown: onKeyDown && (event => fireKeyboardEvent(onKeyDown, event)),
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onMouseDown: onMouseDown && (event => fireCancelableEvent(onMouseDown, {}, event)),
      onClick: onClick && (event => fireCancelableEvent(onClick, {}, event)),
      onFocus: onFocus && (event => fireCancelableEvent(onFocus, {}, event)),
      onBlur: onBlur && (event => fireCancelableEvent(onBlur, { relatedTarget: event.relatedTarget }, event)),
    };
  }

  if (invalid) {
    attributes['aria-invalid'] = invalid;
  }

  const analyticsMetadata: GeneratedAnalyticsMetadataButtonTriggerExpand = {
    action: 'expand',
    detail: {
      label: { root: 'self' },
      expanded: `${!pressed}`,
    },
  };

  return (
    <button
      ref={ref}
      {...attributes}
      {...(disabled || readOnly ? {} : getAnalyticsMetadataAttribute(analyticsMetadata))}
    >
      {children}
      {!hideCaret && (
        <span className={styles.arrow}>
          <InternalIcon name="caret-down-filled" variant={disabled || readOnly ? 'disabled' : 'normal'} />
        </span>
      )}
    </button>
  );
};

export namespace ButtonTriggerProps {
  export interface Ref {
    focus(): void;
  }
}

export default React.forwardRef(ButtonTrigger);
