// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
/**
 * @awsuiSystem core
 */
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import InternalSpinner from '../spinner/internal';
import { StatusIndicatorProps } from './interfaces';

import styles from './styles.css.js';

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

interface InternalStatusIconProps extends Pick<InternalStatusIndicatorProps, 'type' | 'iconAriaLabel'> {
  animate?: InternalStatusIndicatorProps['__animate'];
  size: InternalStatusIndicatorProps['__size'];
  display?: InternalStatusIndicatorProps['__display'];
}

export function InternalStatusIcon({
  type,
  iconAriaLabel,
  animate,
  display,
  size = 'normal',
}: InternalStatusIconProps) {
  return (
    <span
      className={clsx(styles.icon, animate && styles['icon-shake'])}
      aria-label={iconAriaLabel}
      role={iconAriaLabel ? 'img' : undefined}
    >
      {typeToIcon(size)[type]}
      {display === 'inline' && <>&nbsp;</>}
    </span>
  );
}

export default function StatusIndicator({
  type,
  children,
  iconAriaLabel,
  colorOverride,
  wrapText = true,
  nativeAttributes,
  __animate = false,
  __internalRootRef,
  __size = 'normal',
  __display = 'inline-block',
  ...rest
}: InternalStatusIndicatorProps) {
  const baseProps = getBaseProps(rest);
  return (
    <WithNativeAttributes
      {...baseProps}
      tag="span"
      componentName="StatusIndicator"
      nativeAttributes={nativeAttributes}
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
        <InternalStatusIcon
          type={type}
          iconAriaLabel={iconAriaLabel}
          animate={__animate}
          display={__display}
          size={__size}
        />
        {children}
      </span>
    </WithNativeAttributes>
  );
}
