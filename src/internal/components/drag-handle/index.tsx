// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';

import { IconProps } from '../../../icon/interfaces';
import InternalIcon from '../../../icon/internal';
import { getBaseProps } from '../../base-component';
import useForwardFocus from '../../hooks/forward-focus';
import { DragHandleProps } from './interfaces';
import { ResizeIcon } from './resize-icon';

import styles from './styles.css.js';

export { DragHandleProps };

const InternalDragHandle = forwardRef(
  (
    {
      variant = 'drag-indicator',
      size = 'normal',
      ariaLabel,
      ariaDescribedby,
      ariaValue,
      disabled,
      onPointerDown,
      onKeyDown,
      ...rest
    }: DragHandleProps,
    ref: React.Ref<DragHandleProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const dragHandleRefObject = useRef<HTMLDivElement>(null);

    useForwardFocus(ref, dragHandleRefObject);

    const iconProps: IconProps = (() => {
      const shared = { variant: disabled ? ('disabled' as const) : undefined, size };
      switch (variant) {
        case 'drag-indicator':
          return { ...shared, name: 'drag-indicator' };
        case 'resize-area':
          return { ...shared, name: 'resize-area' };
        case 'resize-horizontal':
          return { ...shared, svg: <ResizeIcon variant="horizontal" /> };
        case 'resize-vertical':
          return { ...shared, svg: <ResizeIcon variant="vertical" /> };
      }
    })();

    return (
      // We need to use a div with button role instead of a button
      // so that Safari will focus on it when clicking it.
      // (See https://bugs.webkit.org/show_bug.cgi?id=22261)
      // Otherwise, we can't reliably catch keyboard events coming from the handle
      // when it is being dragged.
      <div
        {...baseProps}
        ref={dragHandleRefObject}
        role={ariaValue ? 'slider' : 'button'}
        tabIndex={0}
        className={clsx(
          baseProps.className,
          styles.handle,
          styles[`handle-${variant}`],
          styles[`handle-size-${size}`],
          disabled && styles['handle-disabled']
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-disabled={disabled}
        aria-valuemax={ariaValue?.valueMax}
        aria-valuemin={ariaValue?.valueMin}
        aria-valuenow={ariaValue?.valueNow}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <InternalIcon {...iconProps} />
      </div>
    );
  }
);

export default InternalDragHandle;
