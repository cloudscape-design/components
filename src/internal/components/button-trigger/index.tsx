// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import InternalIcon from '../../../icon/internal';
import styles from './styles.css.js';
import { fireKeyboardEvent, fireCancelableEvent, CancelableEventHandler, BaseKeyDetail } from '../../events';

export interface ButtonTriggerProps extends BaseComponentProps {
  children?: React.ReactNode;
  pressed?: boolean;
  hideCaret?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  inFilteringToken?: boolean;
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
  const attributes: ButtonHTMLAttributes<HTMLButtonElement> = {
    ...baseProps,
    type: 'button',
    className: clsx(
      styles['button-trigger'],
      baseProps.className,
      pressed && styles.pressed,
      disabled && styles.disabled,
      invalid && styles.invalid,
      !hideCaret && styles['has-caret'],
      readOnly && styles['read-only'],
      inFilteringToken && styles['in-filtering-token']
    ),
    disabled: disabled || readOnly,
    'aria-expanded': pressed,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-haspopup': ariaHasPopup ?? 'listbox',
    'aria-controls': ariaControls,
    onKeyDown: onKeyDown && (event => fireKeyboardEvent(onKeyDown, event)),
    onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
    onMouseDown: onMouseDown && (event => fireCancelableEvent(onMouseDown, {}, event)),
    onClick: onClick && (event => fireCancelableEvent(onClick, {}, event)),
    onFocus: onFocus && (event => fireCancelableEvent(onFocus, {}, event)),
    onBlur: onBlur && (event => fireCancelableEvent(onBlur, { relatedTarget: event.relatedTarget }, event)),
    autoFocus,
  };

  if (invalid) {
    attributes['aria-invalid'] = invalid;
  }

  return (
    <button ref={ref} {...attributes}>
      {children}
      {!hideCaret && (
        <span className={styles.arrow}>
          <InternalIcon name="caret-down-filled" variant={disabled ? 'disabled' : 'normal'} />
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
