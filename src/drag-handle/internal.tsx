// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { DragHandleProps } from './interfaces';
import { ResizeIcon } from './resize-icon';

import styles from './styles.css.js';

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
      __internalRootRef,
      ...rest
    }: DragHandleProps & InternalBaseComponentProps,
    ref: React.Ref<DragHandleProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const dragHandleRefObject = useRef<HTMLDivElement>(null);
    const dragHandleRef = useMergeRefs(dragHandleRefObject, __internalRootRef);

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
        ref={dragHandleRef}
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
