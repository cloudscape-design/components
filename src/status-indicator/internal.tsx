// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';
import InternalSpinner from '../spinner/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { IconProps } from '../icon/interfaces';
import { SomeRequired } from '../internal/types';

const typeToIcon: (size: IconProps.Size) => Record<StatusIndicatorProps.Type, JSX.Element> = size => ({
  error: <InternalIcon name="status-negative" size={size} />,
  warning: <InternalIcon name="status-warning" size={size} />,
  success: <InternalIcon name="status-positive" size={size} />,
  info: <InternalIcon name="status-info" size={size} />,
  stopped: <InternalIcon name="status-stopped" size={size} />,
  pending: <InternalIcon name="status-pending" size={size} />,
  'in-progress': <InternalIcon name="status-in-progress" size={size} />,
  loading: <InternalSpinner />,
});

export interface StatusIndicatorProps extends BaseComponentProps {
  /**
   * Specifies the status type.
   */
  type?: StatusIndicatorProps.Type;
  /**
   * A text fragment that communicates the status.
   */
  children?: React.ReactNode;
  /**
   * Specifies an `aria-label` for the icon. If the status text alone does not fully describe the status,
   * use this to communicate additional context.
   */
  iconAriaLabel?: string;
  /**
   * Specifies an override for the status indicator color.
   */
  colorOverride?: StatusIndicatorProps.Color;
  /**
   * Specifies if the text content should wrap. If you set it to false, it prevents the text from wrapping
   * and truncates it with an ellipsis.
   */
  wrapText?: boolean;
}

export interface InternalStatusIndicatorProps
  extends SomeRequired<StatusIndicatorProps, 'type'>,
    InternalBaseComponentProps {
  /**
   * Play an animation on the error icon when first rendered
   */
  __animate?: boolean;

  /**
   * Size of icon.
   */
  __size?: IconProps.Size;

  /**
   * The CSS behavior of the status indicator container element.
   */
  __display?: 'inline' | 'inline-block';
}

export namespace StatusIndicatorProps {
  // Why not enums? Explained there
  // https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
  export type Type = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';
  export type Color = 'blue' | 'grey' | 'green' | 'red' | 'yellow';
}

export default function StatusIndicator({
  type,
  children,
  iconAriaLabel,
  colorOverride,
  wrapText = true,
  __animate = false,
  __internalRootRef,
  __size = 'normal',
  __display = 'inline-block',
  ...rest
}: InternalStatusIndicatorProps) {
  const baseProps = getBaseProps(rest);
  return (
    <span
      {...baseProps}
      className={clsx(
        styles.root,
        styles[`status-${type}`],
        {
          [styles[`color-override-${colorOverride}`]]: colorOverride,
        },
        baseProps.className
      )}
      ref={__internalRootRef}
    >
      <span
        className={clsx(
          styles.container,
          styles[`display-${__display}`],
          wrapText === false && styles['overflow-ellipsis'],
          __animate && styles['container-fade-in']
        )}
      >
        <span
          className={clsx(styles.icon, __animate && styles['icon-shake'])}
          aria-label={iconAriaLabel}
          role={iconAriaLabel ? 'img' : undefined}
        >
          {typeToIcon(__size)[type]}
          {__display === 'inline' && <>&nbsp;</>}
        </span>
        {children}
      </span>
    </span>
  );
}
